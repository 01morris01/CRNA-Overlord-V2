// overlord-server.mjs: serves the institute, and keeps progress for the people walking around in it.
//
// Two halves:
//   static    the checkout, read-only, refusing anything that escapes the root or starts with a dot
//   /api/sync accounts and save slots, so the same person on a phone is the same person
//
// Zero dependencies, so it can run anywhere Node runs with nothing installed.
//
// Environment:
//   OVERLORD_ROOT        the checkout to serve            (default: the parent of this file's directory)
//   OVERLORD_DATA        where accounts and saves live    (default: <root>/../overlord-data)
//   OVERLORD_PORT        HTTP port                        (default: 8800)
//   OVERLORD_HTTPS_PORT  HTTPS port, when a cert is given (default: 8801)
//   OVERLORD_TLS_CERT    PEM certificate chain, the DEFAULT one  (optional)
//   OVERLORD_TLS_KEY     its private key                          (optional)
//   OVERLORD_TLS_TAILNET_CERT / _TAILNET_KEY   served instead when the client asks for a *.ts.net name
//
// A password crossing a LAN in clear text is a password anyone on that LAN can read, so point
// OVERLORD_TLS_* at a real certificate wherever one exists. Over Tailscale the tunnel is already
// encrypted; over the bare LAN it is not.
import http from 'node:http';
import https from 'node:https';
import tls from 'node:tls';
import { createReadStream, statSync, existsSync, realpathSync, readFileSync } from 'node:fs';
import { join, extname, normalize, sep, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { openStore } from './store.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = realpathSync(process.env.OVERLORD_ROOT || join(HERE, '..'));
const DATA = process.env.OVERLORD_DATA || join(ROOT, '..', 'overlord-data');
const PORT = Number(process.env.OVERLORD_PORT || 8800);
const HTTPS_PORT = Number(process.env.OVERLORD_HTTPS_PORT || 8801);
const MAX_BODY = 5 * 1024 * 1024;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.hdr': 'image/vnd.radiance', '.ktx2': 'image/ktx2', '.bin': 'application/octet-stream',
  '.wasm': 'application/wasm', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.npy': 'application/octet-stream',
  '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
};

/**
 * Which certificate answers which name.
 *
 * SNICallback runs only when the client sends a server name. A client opening https://<ip>:<port> sends
 * none, because SNI cannot carry an IP literal, and gets the default context instead. So the default has
 * to be the certificate for the LAN address, with the tailnet certificate as the named case. Getting this
 * the wrong way round presents a .ts.net certificate to every browser on the LAN, which warns every time
 * — and it looks correct until someone actually opens the LAN address in a browser.
 */
export const isTailnetName = (servername) => !!servername && servername.endsWith('.ts.net');

export function tlsPlan({ cert, key, tailnetCert, tailnetKey }) {
  if (!cert || !key) return null;
  const haveTailnet = !!(tailnetCert && tailnetKey);
  return {
    default: { cert, key },                                   // every no-SNI connection, i.e. every bare IP
    tailnet: haveTailnet ? { cert: tailnetCert, key: tailnetKey } : null,
    for: (servername) => (haveTailnet && isTailnetName(servername)
      ? { cert: tailnetCert, key: tailnetKey }
      : { cert, key }),
  };
}

export function createHandler(store, { root = ROOT } = {}) {
  const send = (res, code, obj) => {
    const body = JSON.stringify(obj);
    res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    res.end(body);
  };

  const readBody = (req) => new Promise((ok, no) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { no(Object.assign(new Error('too large'), { code: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return ok({});
      try { ok(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { no(Object.assign(new Error('bad json'), { code: 400 })); }
    });
    req.on('error', no);
  });

  const bearer = (req) => {
    const h = req.headers.authorization || '';
    return h.startsWith('Bearer ') ? h.slice(7).trim() : null;
  };

  async function api(req, res, path, url) {
    // ---- open routes ----
    if (path === '/api/sync/health' && req.method === 'GET') {
      return send(res, 200, { ok: true, sync: true, users: store.userCount });
    }

    if ((path === '/api/sync/register' || path === '/api/sync/login') && req.method === 'POST') {
      let body;
      try { body = await readBody(req); }
      catch (e) { return send(res, e.code || 400, { ok: false, error: 'Could not read the request.' }); }
      const r = path.endsWith('register')
        ? await store.register(body.username, body.password)
        : await store.login(body.username, body.password);
      if (!r.ok) return send(res, r.code, { ok: false, error: r.error });
      return send(res, 200, { ok: true, token: r.token, displayName: r.displayName });
    }

    // ---- everything below needs a token ----
    const who = store.whoIs(bearer(req));
    if (!who) return send(res, 401, { ok: false, error: 'Sign in again.' });

    if (path === '/api/sync/me' && req.method === 'GET') {
      return send(res, 200, { ok: true, displayName: who.displayName });
    }

    if (path === '/api/sync/logout' && req.method === 'POST') {
      store.revoke(bearer(req));
      return send(res, 200, { ok: true });
    }

    if (path === '/api/sync/save') {
      const slot = url.searchParams.get('slot');
      if (!store.isSlot(slot)) return send(res, 400, { ok: false, error: 'Unknown save slot.' });

      if (req.method === 'GET') {
        const cur = store.read(who.userId, slot);
        return send(res, 200, { ok: true, slot, rev: cur.rev, updatedAt: cur.updatedAt, data: cur.data });
      }
      if (req.method === 'PUT') {
        let body;
        try { body = await readBody(req); }
        catch (e) { return send(res, e.code || 400, { ok: false, error: 'Could not read the request.' }); }
        if (!Number.isInteger(body.baseRev) || body.baseRev < 0) {
          return send(res, 400, { ok: false, error: 'baseRev must be a whole number.' });
        }
        const r = store.write(who.userId, slot, body.baseRev, body.data);
        if (!r.ok) return send(res, r.code, { ok: false, error: r.error, server: r.server });
        return send(res, 200, { ok: true, slot, rev: r.rev, updatedAt: r.updatedAt });
      }
      return send(res, 405, { ok: false, error: 'Method not allowed.' });
    }

    return send(res, 404, { ok: false, error: 'No such endpoint.' });
  }

  return function handle(req, res) {
    let url;
    try { url = new URL(req.url, 'http://x'); }
    catch { res.writeHead(400); return res.end('bad path'); }

    let p;
    try { p = decodeURIComponent(url.pathname); }
    catch { res.writeHead(400); return res.end('bad path'); }

    if (p.startsWith('/api/sync')) {
      return api(req, res, p, url).catch((e) => {
        console.error('[overlord] api error', e);
        if (!res.headersSent) { res.writeHead(500, { 'content-type': 'application/json' }); }
        res.end(JSON.stringify({ ok: false, error: 'Server error.' }));
      });
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end('method not allowed'); }
    if (p === '/') p = '/world/index.html';

    // Resolve, then confirm the result is still inside the root. normalize() alone is not enough on
    // Windows, where a symlink or a junction could still point out of the tree.
    const target = normalize(join(root, p));
    if (target !== root && !target.startsWith(root + sep)) {
      res.writeHead(403); return res.end('outside root');
    }
    // Never serve the repository's own metadata or dotfiles. The repo is public, so .git/config holds no
    // secret today, but serving a .git tree over a network is a bad habit that stops being harmless the
    // moment a credential helper or a private remote appears in it.
    if (p.split('/').some((seg) => seg.startsWith('.'))) {
      res.writeHead(403); return res.end('forbidden');
    }
    if (!existsSync(target)) { res.writeHead(404); return res.end('not found'); }

    let real, st;
    try { real = realpathSync(target); st = statSync(real); }
    catch { res.writeHead(404); return res.end('not found'); }
    if (real !== root && !real.startsWith(root + sep)) {
      res.writeHead(403); return res.end('outside root');
    }
    if (st.isDirectory()) {
      const idx = join(real, 'index.html');
      if (!existsSync(idx)) { res.writeHead(403); return res.end('no index'); }
      return sendFile(idx, res, req);
    }
    sendFile(real, res, req);
  };
}

function sendFile(file, res, req) {
  const t = TYPES[extname(file).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, { 'content-type': t, 'cache-control': 'no-cache' });
  if (req && req.method === 'HEAD') return res.end();
  createReadStream(file).on('error', () => { if (!res.headersSent) res.writeHead(500); res.end(); }).pipe(res);
}

/** Start the server(s). Exported so the tests can run one on an ephemeral port. */
export function start({ port = PORT, httpsPort = HTTPS_PORT, data = DATA, root = ROOT,
  cert = process.env.OVERLORD_TLS_CERT, key = process.env.OVERLORD_TLS_KEY } = {}) {
  const store = openStore(data);
  const handle = createHandler(store, { root });
  const servers = [];

  const plain = http.createServer(handle);
  servers.push(plain);
  plain.listen(port, '0.0.0.0', () => {
    console.log(`[overlord] serving ${root} on http://0.0.0.0:${port}`);
    console.log(`[overlord]   accounts and saves in ${store.dir}`);
  });

  let certWatch = null;
  if (cert && key && existsSync(cert) && existsSync(key)) {
    try {
      // Two certificates, picked by the name the client asked for. A public CA will certify the tailnet
      // name and will never certify a bare LAN address, so one certificate cannot serve both paths —
      // the same reason JARVIS on this box does it this way.
      //
      // Which one is the DEFAULT matters more than it looks. SNICallback only runs when the client sends
      // a server name, and a client opening https://192.168.1.78:8801 sends none, because SNI cannot
      // carry an IP literal. Those connections get the default context. So the default has to be the
      // certificate for the LAN address; putting the tailnet one there presents a .ts.net certificate to
      // every browser on the LAN, which warns on every visit.
      let tsCert = process.env.OVERLORD_TLS_TAILNET_CERT, tsKey = process.env.OVERLORD_TLS_TAILNET_KEY;
      if (!(tsCert && tsKey && existsSync(tsCert) && existsSync(tsKey))) { tsCert = tsKey = null; }
      const plan = tlsPlan({ cert, key, tailnetCert: tsCert, tailnetKey: tsKey });
      const read = (pair) => ({ cert: readFileSync(pair.cert), key: readFileSync(pair.key) });
      const load = () => {
        const opts = read(plan.default);
        if (plan.tailnet) {
          const tailnet = tls.createSecureContext(read(plan.tailnet));
          const lan = tls.createSecureContext(read(plan.default));
          opts.SNICallback = (servername, cb) => cb(null, isTailnetName(servername) ? tailnet : lan);
        }
        return opts;
      };

      const sec = https.createServer(load(), handle);
      servers.push(sec);
      sec.listen(httpsPort, '0.0.0.0', () => console.log(`[overlord] also on https://0.0.0.0:${httpsPort}`));

      // These certificates last 90 days and are replaced by a scheduled renewal. A server that read the
      // files once at boot would go on presenting the expired one until somebody noticed — months later,
      // with no warning. Re-read them when they change instead, which needs no coordination with whatever
      // does the renewing.
      let seen = statSync(cert).mtimeMs;
      certWatch = setInterval(() => {
        try {
          const now = statSync(cert).mtimeMs;
          if (now === seen) return;
          seen = now;
          sec.setSecureContext(load());
          console.log('[overlord] TLS certificate reloaded');
        } catch (e) {
          console.error('[overlord] certificate reload failed, keeping the one in use:', e.message);
        }
      }, 3600000);
      certWatch.unref?.();
    } catch (e) {
      // A bad certificate must not take the world offline — it degrades to HTTP and says so loudly.
      console.error('[overlord] TLS certificate unusable, continuing on HTTP only:', e.message);
    }
  } else if (cert || key) {
    console.error('[overlord] OVERLORD_TLS_CERT/KEY set but not both readable — HTTP only.');
  }

  return {
    store, servers,
    close: () => { if (certWatch) clearInterval(certWatch); return Promise.all(servers.map((s) => new Promise((r) => s.close(r)))); },
  };
}

// pathToFileURL, not `file://${argv[1]}` — the second is never equal on Windows, which is exactly the bug
// that made JARVIS exit silently on this machine.
if (import.meta.url === pathToFileURL(process.argv[1]).href) start();
