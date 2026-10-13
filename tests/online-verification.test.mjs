import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createInventory, verifyOnline, manualChecks, cssResources, inspectHtml, markdownReport } from '../scripts/verify-online.mjs';
import { readCatalog } from '../src/domain/content/catalog.mjs';

const inventory = createInventory(await readCatalog());
const sample = inventory.pages.find((p) => p.path === 'zh-cn/concepts/mcp/');
function html(target, expected, { badCoverage = false, wrongCanonical = false, asset = 'test.js' } = {}) {
  const record = expected.records['zh-CN'];
  return `<!doctype html><html lang="zh-CN"><head>
  <link rel="canonical" href="${target}${wrongCanonical ? expected.path : expected.root}">
  <link rel="alternate" hreflang="en" href="${target}${expected.root}">
  <link rel="alternate" hreflang="x-default" href="${target}${expected.root}">
  <meta name="robots" content="noindex,follow"><meta property="og:url" content="${target}${expected.root}">
  <meta property="og:title" content="MCP"><meta property="og:description" content="English fallback">
  <meta property="og:image" content="${target}brand/social/default.png"><meta name="twitter:image" content="${target}brand/social/default.png">
  <meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
  <script src="${target}${asset}"></script></head><body>
  <aside data-translation-coverage ${Object.entries(record.coverage).map(([k, v]) => `data-${k}="${badCoverage && k === 'translated' ? 99 : v}"`).join(' ')}></aside>
  <p class="concept-deck" lang="en">${record.data.summary}</p><p data-definition-body lang="en">${record.data.definition}</p>
  ${Object.values(record.units).flatMap((u) => [u.text].flat().map((value) => `<p lang="${u.actualLang}">${value}</p>`)).join('')}
  </body></html>`;
}
async function fixture(run, options = {}) {
  const png = Buffer.alloc(24); Buffer.from([137,80,78,71,13,10,26,10]).copy(png); png.writeUInt32BE(1200,16); png.writeUInt32BE(630,20);
  let target;
  const server = createServer((req, res) => {
    if (options.redirectAssets) {
      if (req.url.endsWith('/concepts/mcp/')) return res.writeHead(302, { location: '../../../moved/' }).end();
      if (req.url.endsWith('/moved/')) return res.writeHead(200, { 'content-type': 'text/html' }).end(html(target, sample).replace(`<script src="${target}test.js"></script>`, '<link rel="stylesheet" href="style.css">'));
      if (req.url.endsWith('/moved/style.css')) return res.writeHead(302, { location: '../styles/site.css' }).end();
      if (req.url.endsWith('/styles/site.css')) return res.writeHead(200, { 'content-type': 'text/css' }).end('body{background:url("../images/pattern.svg")}');
      if (req.url.endsWith('/images/pattern.svg')) return res.writeHead(200, { 'content-type': 'image/svg+xml' }).end('<svg xmlns="http://www.w3.org/2000/svg"/>');
      if (!req.url.endsWith('/default.png')) return res.writeHead(404).end('wrong relative asset path');
    }
    if (req.url.endsWith('/default.png')) return res.writeHead(200, { 'content-type': 'image/png' }).end(png);
    if (req.url.endsWith('/test.js')) {
      if (options.redirect) return res.writeHead(302, { location: 'http://outside.invalid/file.js' }).end();
      if (options.missing) return res.writeHead(404).end('missing');
      return res.writeHead(200, { 'content-type': options.badMime ? 'text/html' : 'application/javascript' }).end('/* fixture */');
    }
    if (req.url.endsWith('/broken/')) return req.socket.destroy();
    res.writeHead(200, { 'content-type': 'text/html' }).end(html(target, sample, options));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  target = `http://127.0.0.1:${server.address().port}/lexicon/`;
  try { await run(target); } finally { server.closeAllConnections(); await new Promise((r) => server.close(r)); }
}
const verify = (target, extra = {}) => verifyOnline({ target, inventory: { pages: [sample], coverage: inventory.coverage }, timeout: 1000, ...extra });

test('HTTP seam validates fallback publication and keeps human sessions unverified', async () => {
  await fixture(async (target) => {
    const report = await verify(target);
    assert.equal(report.automatedStatus, 'passed', JSON.stringify(report.failures));
    assert.equal(report.overallAcceptance, 'pending-human-verification');
    assert.deepEqual(report.manual, manualChecks.map((id) => ({ id, status: 'unverified' })));
    assert.equal(report.assets.length, 2); assert.equal(report.assets[0].status, 200);
  });
});
for (const [name, options, pattern] of [
  ['coverage drift', { badCoverage: true }, /coverage/],
  ['wrong canonical', { wrongCanonical: true }, /canonical/],
  ['missing asset', { missing: true }, /HTTP 404/],
  ['HTML MIME for JavaScript', { badMime: true }, /MIME/],
  ['external redirect', { redirect: true }, /Redirect outside target/],
  ['base path escape', { asset: '../outside.js' }, /outside deployment base/],
]) test(`HTTP seam rejects ${name}`, async () => {
  await fixture(async (target) => {
    const report = await verify(target); assert.equal(report.automatedStatus, 'failed');
    assert.ok(report.failures.some((f) => pattern.test(f.message)), JSON.stringify(report.failures));
  }, options);
});
test('network failure preserves successful page evidence and fails run', async () => {
  await fixture(async (target) => {
    const report = await verify(target, { inventory: { ...inventory, pages: [sample, { ...sample, path: 'broken/' }] } });
    assert.equal(report.pages.length, 2); assert.ok(report.pages.some((p) => p.passed));
    assert.equal(report.automatedStatus, 'failed');
  });
});
test('inventory derives both locales and preserves application resource boundaries', () => {
  for (const kind of ['concepts', 'primitives']) {
    assert.equal(inventory.pages.filter((p) => p.kind === kind).length, inventory.coverage.collections[kind].records * 2);
    assert.ok(inventory.coverage.collections[kind].entries.every((r) => r.total === r.translated + r.missing + r.draft + r.stale));
  }
  assert.ok(inventory.coverage.skillMaps.every((m) => m.translationOverlay === 'outside-current-contract'));
  assert.ok(inventory.pages.every((p) => !p.path.includes('undefined')));
});

test('CSS URL extraction keeps quoted SVG data URLs atomic', () => {
  const css = `a{background:url("data:image/svg+xml,%3Csvg filter='url(%23n)'%3E")} b{background:url('../brand/image.webp')}`;
  assert.deepEqual(cssResources(css), ["data:image/svg+xml,%3Csvg filter='url(%23n)'%3E", '../brand/image.webp']);
});

test('HTTP seam resolves HTML and CSS dependencies against each final response URL', async () => {
  await fixture(async (target) => {
    const report = await verify(target);
    assert.equal(report.automatedStatus, 'passed', JSON.stringify(report.failures));
    assert.ok(report.pages[0].finalUrl.endsWith('/moved/'));
    assert.ok(report.assets.some((a) => a.url === `${target}moved/style.css` && a.finalUrl === `${target}styles/site.css`));
    assert.ok(report.assets.some((a) => a.url === `${target}images/pattern.svg` && a.passed));
  }, { redirectAssets: true });
});

test('field language rejects a wrong-language child inside a correctly labelled ancestor', () => {
  const target = 'https://example.com/lexicon/';
  const value = sample.records['zh-CN'].units.why_it_matters.text;
  const source = html(target, sample).replace(`<p lang="en">${value}</p>`, `<div lang="en"><p lang="zh-CN">${value}</p></div>`);
  assert.ok(inspectHtml(source, sample, target).failures.includes('missing localized text/language for why_it_matters'));
});

test('field language accepts inherited language and same-language inline markup', () => {
  const target = 'https://example.com/lexicon/';
  const value = sample.records['zh-CN'].units.why_it_matters.text;
  const source = html(target, sample).replace(`<p lang="en">${value}</p>`, `<div lang="en"><p><em>${value}</em></p></div>`);
  assert.deepEqual(inspectHtml(source, sample, target).failures, []);
});

test('summary language checks nested text even when another correct copy exists', () => {
  const target = 'https://example.com/lexicon/';
  const value = sample.records['zh-CN'].data.summary;
  const source = html(target, sample).replace(`<p class="concept-deck" lang="en">${value}</p>`, `<p class="concept-deck" lang="en"><span lang="zh-CN">${value}</span></p>`);
  assert.ok(inspectHtml(source, sample, target).failures.includes('summary text/language differs from resolver'));
});

test('Markdown summary groups page risks and preserves affected URLs', async () => {
  await fixture(async (target) => {
    const report = await verify(target);
    report.pages.push({ url: `${target}share/speaking-card/card-01/`, risks: ['share canonical targets guide while og:url identifies the card; platform behavior unverified'] });
    const markdown = markdownReport(report);
    assert.match(markdown, /## Page risks/);
    assert.ok(markdown.includes('social description language differs from route locale'));
    assert.ok(markdown.includes(`${target}${sample.path}`));
    assert.ok(markdown.includes('share canonical targets guide'));
  });
});
