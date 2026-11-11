#!/usr/bin/env python3
"""dev_server.py: serve the repo for local work with caching switched off, so an edit shows on the next reload.
   python3 tools/dev_server.py [PORT]   (default 8081; binds 127.0.0.1 only)"""
import http.server, os, sys

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()
    def log_message(self, fmt, *args):
        if args and str(args[1]) not in ("200", "304"):
            super().log_message(fmt, *args)

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8081
http.server.ThreadingHTTPServer(("127.0.0.1", port), NoCache).serve_forever()
