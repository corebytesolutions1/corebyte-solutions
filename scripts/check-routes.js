/**
 * Smoke test: boots the app on a free port and requests every public page,
 * plus sitemap/robots and a 404. Run with `npm run check`.
 */
process.env.NO_LISTEN = '1';
const app = require('../server');
const { publicPaths } = require('../routes/pages');

const server = app.listen(0, async () => {
  const base = `http://127.0.0.1:${server.address().port}`;
  const checks = [
    ...publicPaths().map((p) => [p, 200]),
    ['/sitemap.xml', 200],
    ['/robots.txt', 200],
    ['/site.webmanifest', 200],
    ['/api/health', 200],
    ['/this-page-does-not-exist', 404]
  ];
  let failed = 0;
  for (const [p, expected] of checks) {
    const res = await fetch(base + p, { redirect: 'manual' });
    const ok = res.status === expected;
    if (!ok) failed++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${res.status} ${p}`);
  }
  server.close();
  console.log(failed ? `\n${failed} check(s) failed` : '\nAll routes OK');
  process.exit(failed ? 1 : 0);
});
