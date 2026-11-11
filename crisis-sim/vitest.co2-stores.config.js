// EXPERIMENT ONLY: `npx vitest run -c vitest.co2-stores.config.js` runs the existing suite with the prepared CO2
// correction forced on, to list which existing expectations it would change. See docs/co2-kinetics.md.
export default { test: { setupFiles: ['./test/support/co2-stores-default.setup.js'], exclude: ['**/node_modules/**', 'test/co2-kinetics.test.js'] } };
