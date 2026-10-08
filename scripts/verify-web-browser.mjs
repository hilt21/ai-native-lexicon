import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createServer } from 'node:http';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { chromium } from 'playwright';
import { parse, stringify } from 'yaml';
import { mapInput, nodeInput } from '../tests/skill-map-fixture.mjs';

const run = promisify(execFile);
const base = '/ai-native-lexicon';
const channel = process.env.PLAYWRIGHT_CHANNEL || 'chromium';
const repository = resolve('.');
const evidence = resolve(process.env.WEB_EVIDENCE ?? 'work/web-browser');
const buildEnvironment = { ...process.env, BASE_PATH: base, SKIP_PAGEFIND: 'false', GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'hilt21/ai-native-lexicon', GITHUB_REPOSITORY_OWNER: 'hilt21' };
let root = resolve('dist');
let fixtureDirectory;
let browser;
await mkdir(evidence, { recursive: true });
const report = { base, pagefind: true, environment: { node: process.version, channel }, checks: [], failures: [], optional: { zoom400: 'unverified; 320px reflow is not a 400% zoom test', screenReader: 'unverified; requires an assistive-technology session', lighthouse: 'measured independently outside this behavior suite' } };
report.buildCommit = (await run('git', ['rev-parse', 'HEAD'])).stdout.trim();
async function build(directory) { await run('npm', ['run', 'build'], { cwd: directory, env: buildEnvironment, maxBuffer: 8 * 1024 * 1024 }); }
if (!process.argv.includes('--reuse-build')) await build(repository);
assert.ok((await readFile(join(root, 'search/index.html'), 'utf8')).includes('data-open-modal'), 'Production build must expose Header Search');
assert.ok((await readFile(join(root, 'pagefind/pagefind.js'), 'utf8')).length > 0, 'Production build must include Pagefind');
const dataset = JSON.parse(await readFile(join(root, 'dataset.json'), 'utf8'));
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    assert.ok(pathname.startsWith(`${base}/`));
    const path = resolve(root, pathname.slice(base.length + 1));
    assert.ok(path === root || path.startsWith(`${root}${sep}`));
    const file = pathname.endsWith('/') ? join(path, 'index.html') : path;
    const content = await readFile(file);
    const type = file.endsWith('.html') ? 'text/html' : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.json') ? 'application/json' : file.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream';
    response.writeHead(200, { 'Content-Type': type }); response.end(content);
  } catch { response.writeHead(404).end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}${base}`;
async function check(name, verify, details = {}) {
  try { await verify(); report.checks.push({ name, ...details, expected: 'all stated assertions pass', actual: 'all stated assertions passed', passed: true }); console.log(`PASS ${name} ${JSON.stringify(details)}`); }
  catch (error) { report.failures.push({ name, ...details, message: error.message }); throw error; }
}
async function settled(page) { await page.evaluate(async () => { await document.fonts.ready; await Promise.all(document.getAnimations().filter((a) => a.effect?.getTiming().iterations !== Infinity).map((a) => a.finished.catch(() => {}))); }); }
async function geometry(page) {
  const result = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth, h1: [...document.querySelectorAll('h1')].filter((e) => e.getBoundingClientRect().height > 0).length }));
  assert.equal(result.h1, 1); assert.ok(result.document <= result.width, JSON.stringify(result));
}
async function language(locator, expected) { assert.equal(await locator.evaluate((element) => element.closest('[lang]')?.getAttribute('lang')), expected); }
async function directoryState(page) {
  await page.waitForTimeout(30); // pageshow restoration synchronization runs in the next task.
  const state = await page.locator('[data-map-directory]').evaluate((directory) => {
    const query = directory.querySelector('[data-map-query]').value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const type = directory.querySelector('[data-map-type]').value;
    const cluster = directory.querySelector('[data-map-cluster]')?.value;
    const retired = directory.querySelector('[data-map-retired]').checked;
    const rows = [...directory.querySelectorAll('[data-map-item]')];
    const expected = rows.filter((row) => (retired || row.dataset.retired !== 'true') && (!type || row.dataset.type === type) && (!cluster || row.dataset.clusters.split(' ').includes(cluster)) && query.every((word) => row.dataset.text.includes(word)));
    const visible = rows.filter((row) => row.getBoundingClientRect().height > 0);
    return { expected: expected.map((r) => r.getAttribute('href')), visible: visible.map((r) => r.getAttribute('href')), count: directory.querySelector('[data-map-count]').textContent, empty: !directory.querySelector('[data-map-empty]').hidden };
  });
  assert.deepEqual(state.visible, state.expected); assert.equal(state.count, `${state.expected.length} matching ${state.expected.length === 1 ? 'item' : 'items'}`); assert.equal(state.empty, state.expected.length === 0);
  return state;
}
async function histories(browser, mapId, mode) {
  const context = await browser.newContext();
  await context.addInitScript(() => { window.historyShows = []; window.addEventListener('pageshow', (e) => window.historyShows.push(e.persisted)); });
  const page = await context.newPage();
  const route = `${origin}/skill-maps/${mapId}/nodes/`;
  await page.goto(route);
  await page.locator('[data-map-query]').fill(mapId === 'pstack' ? 'tdd' : 'target');
  await page.locator('[data-map-type]').selectOption(mapId === 'pstack' ? 'capability' : 'custom');
  if (mapId !== 'pstack') { await page.locator('[data-map-cluster]').selectOption('second'); await page.locator('[data-map-retired]').check(); }
  const initial = await directoryState(page); assert.equal(initial.visible.length, mapId === 'pstack' ? 1 : 2);
  await page.locator('[data-map-item]:visible').first().click();
  await page.goBack({ waitUntil: 'commit' }); const restored = await directoryState(page);
  assert.deepEqual(restored.visible, initial.visible);
  const persisted = await page.evaluate(() => window.historyShows.at(-1));
  if (mode === 'bfcache') assert.equal(persisted, true, 'This traversal must actually exercise BFCache');
  else assert.equal(persisted, false, 'This traversal must exercise a reload return');
  await page.goForward({ waitUntil: 'commit' }); await page.goBack({ waitUntil: 'commit' }); await directoryState(page);
  await page.reload(); await directoryState(page);
  await page.locator('[data-map-query]').fill('no-such-filter-result'); await directoryState(page);
  // Keep an empty result while navigating via a different, native map link.
  await page.locator('.map-tabs a').first().click(); await page.goBack({ waitUntil: 'commit' }); await directoryState(page);
  await page.locator('[data-map-clear]').click(); const cleared = await directoryState(page);
  assert.ok(cleared.visible.length > 0); assert.equal(await page.locator('[data-map-query]').evaluate((e) => e === document.activeElement), true);
  await page.goto(route); await directoryState(page);
  report.checks.push({ name: 'history, reload, empty return and Clear', mapId, mode, persisted, passed: true });
  await context.close();
}
async function searchHistory(browser, mode) {
  const context = await browser.newContext();
  await context.addInitScript(() => { window.historyShows = []; window.addEventListener('pageshow', (event) => window.historyShows.push(event.persisted)); });
  const page = await context.newPage();
  const route = `${origin}/search/?q=persistence&type=concept&keep=1`;
  const input = page.locator('#concept-search');
  const type = page.locator('#search-type');
  const visible = () => page.locator('[data-search]:visible').evaluateAll((rows) => rows.map((row) => row.getAttribute('href')));
  await page.goto(route);
  const expected = await visible(); assert.ok(expected.includes(`${base}/concepts/harness/`));
  await page.locator(`[data-search][href="${base}/concepts/harness/"]`).click();
  await page.waitForURL(`${origin}/concepts/harness/`);
  await page.evaluate(() => history.back()); await page.waitForURL(route, { waitUntil: 'commit' }); await page.waitForTimeout(30);
  assert.equal(await input.inputValue(), 'persistence'); assert.equal(await type.inputValue(), 'concept');
  assert.deepEqual(await visible(), expected);
  const persisted = await page.evaluate(() => window.historyShows.at(-1));
  assert.equal(persisted, mode === 'bfcache', `Search return must actually exercise ${mode}`);
  await page.reload(); assert.deepEqual(await visible(), expected);
  await input.fill('no-such-search-result'); assert.equal((await visible()).length, 0);
  await page.locator(`a[href="${base}/concepts/"]`).first().click(); await page.waitForURL(`${origin}/concepts/`);
  await page.evaluate(() => history.back()); await page.waitForURL(/search\//, { waitUntil: 'commit' }); await page.waitForTimeout(30);
  assert.equal(await input.inputValue(), 'no-such-search-result'); assert.equal(await type.inputValue(), 'concept');
  assert.equal((await visible()).length, 0); assert.equal(await page.locator('#search-count').textContent(), '0 matching entries');
  assert.ok(await page.locator('#search-empty').isVisible());
  await page.locator('#search-clear').click();
  assert.equal(await input.inputValue(), ''); assert.equal(await type.inputValue(), '');
  assert.equal(new URL(page.url()).searchParams.get('keep'), '1');
  assert.equal((await visible()).length, await page.locator('[data-search]').count());
  // Push a native same-document history entry, then traverse it to fire real popstate.
  await input.fill('mcp');
  await page.evaluate(() => history.pushState(null, '', '?q=persistence&type=concept&keep=1'));
  await page.evaluate(() => history.back()); await page.waitForURL(/q=mcp/, { waitUntil: 'commit' }); await page.waitForTimeout(30);
  assert.equal(await input.inputValue(), 'mcp'); assert.equal(await type.inputValue(), '');
  await page.evaluate(() => history.forward()); await page.waitForURL(/q=persistence/, { waitUntil: 'commit' }); await page.waitForTimeout(30);
  assert.equal(await input.inputValue(), 'persistence'); assert.equal(await type.inputValue(), 'concept');
  assert.deepEqual(await visible(), expected);
  report.checks.push({ name: 'catalog URL, empty return, Clear, native popstate and reload', mode, persisted, passed: true });
  await context.close();
}
try {
  browser = await chromium.launch({ channel, ignoreDefaultArgs: ['--disable-back-forward-cache'] });
  report.browser = browser.version();
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await context.newPage();
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${origin}/`);
  await check('homepage begins with canonical Concept examples', async () => {
    const sections = await page.locator('.home-section').evaluateAll((items) => items.map((item) => item.textContent));
    assert.match(sections[0], /START HERE/);
    assert.match(sections[1], /ORIENTATION/);
    const featured = ['context-engineering', 'thin-kernel', 'bounded-autonomy', 'harness', 'inspectable-agency'];
    for (const slug of featured) {
      const record = dataset.concepts.find((record) => record.slug === slug);
      assert.equal(await page.locator(`.home-featured [href="${base}/concepts/${slug}/"] .concept-summary`).textContent(), record.summary);
    }
    assert.match(await page.locator('.hero-ledger').textContent(), /canonical content/);
    assert.equal(await page.locator(`[href="${base}/categories/"]`).count() > 0, true);
  });
  await page.goto(`${origin}/search/?q=persistence&type=concept&keep=1`);
  await check('catalog query, type, match context and URL form one state', async () => {
    const input = page.locator('#concept-search');
    const type = page.locator('#search-type');
    assert.equal(await type.count(), 1);
    assert.equal(await input.inputValue(), 'persistence');
    assert.equal(await type.inputValue(), 'concept');
    assert.deepEqual(await type.locator('option').evaluateAll((options) => options.map((option) => option.value)), ['', 'concept', 'primitive', 'speaking-guide', 'skill-map', 'map-node', 'task-journey']);
    const harness = page.locator(`[data-search][href="${base}/concepts/harness/"]`);
    assert.ok(await harness.isVisible());
    assert.match(await harness.locator('[data-match-label]').textContent(), /Definition/);
    assert.match((await harness.locator('[data-match-context]').textContent()).toLowerCase(), /persistence/);
    await input.fill('mcp');
    const first = page.locator('[data-search]:visible').first();
    assert.equal(await first.getAttribute('href'), `${base}/concepts/mcp/`);
    assert.match(await first.locator('[data-match-label]').textContent(), /Title/);
    assert.equal(new URL(page.url()).searchParams.get('q'), 'mcp');
    await input.fill('');
    for (const kind of ['concept', 'primitive', 'speaking-guide', 'skill-map', 'map-node', 'task-journey']) {
      await type.selectOption(kind);
      const kinds = await page.locator('[data-search]:visible').evaluateAll((rows) => rows.map((row) => row.dataset.searchType));
      assert.ok(kinds.length > 0);
      assert.ok(kinds.every((actual) => actual === kind));
      assert.equal(await page.locator('#search-count').textContent(), `${kinds.length} matching ${kinds.length === 1 ? 'entry' : 'entries'}`);
    }
    await input.fill('no-such-search-result');
    assert.equal(await page.locator('[data-search]:visible').count(), 0);
    assert.ok(await page.locator('#search-empty').isVisible());
    await page.locator('#search-clear').click();
    assert.equal(await input.inputValue(), '');
    assert.equal(await type.inputValue(), '');
    assert.equal(await input.evaluate((element) => element === document.activeElement), true);
    assert.equal(await page.locator('[data-search]:visible').count(), await page.locator('[data-search]').count());
    assert.equal(new URL(page.url()).searchParams.get('keep'), '1');
    assert.equal(new URL(page.url()).searchParams.has('q'), false);
    assert.equal(new URL(page.url()).searchParams.has('type'), false);
    await page.goto(`${origin}/search/?q=模型上下文协议&type=unknown&keep=1`);
    assert.equal(await type.inputValue(), '');
    assert.ok(await page.locator(`[data-search][href="${base}/concepts/mcp/"]`).isVisible());
    assert.equal(new URL(page.url()).searchParams.get('keep'), '1');
  });
  for (const theme of ['light', 'dark']) for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    for (const route of ['', 'search/?q=persistence&type=concept']) {
      await page.goto(`${origin}/${route}`);
      await page.evaluate((theme) => { document.documentElement.dataset.theme = theme; }, theme);
      await settled(page);
      const screenshot = `${route ? 'search' : 'home'}-${width}-${theme}.png`;
      await check('discovery screenshot and reflow', async () => { await geometry(page); await page.screenshot({ path: join(evidence, screenshot), fullPage: true }); if (!route) await page.locator('.home-featured').screenshot({ path: join(evidence, `featured-${width}-${theme}.png`) }); }, { route, width, theme, screenshot });
    }
  }
  await page.goto(`${origin}/search/`);
  for (const theme of ['light', 'dark']) await check('computed catalog-control contrast and keyboard focus', async () => {
    await page.evaluate((theme) => { document.documentElement.dataset.theme = theme; }, theme);
    const ratios = await page.locator('.search-controls select, .search-controls button').evaluateAll((controls) => {
      const lum = (color) => color.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
      const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
      return controls.map((e) => { const style = getComputedStyle(e); return { border: contrast(style.borderTopColor, style.backgroundColor), text: contrast(style.color, style.backgroundColor) }; });
    });
    for (const ratio of ratios) { assert.ok(ratio.border >= 3, JSON.stringify(ratio)); assert.ok(ratio.text >= 4.5, JSON.stringify(ratio)); }
    for (const selector of ['#concept-search', '#search-type', '#search-clear']) {
      const control = page.locator(selector); await control.focus();
      assert.equal(await control.evaluate((element) => element === document.activeElement), true);
      assert.ok(await control.isVisible());
    }
    await page.locator('#concept-search').focus(); await page.keyboard.press('Tab');
    assert.equal(await page.locator('#search-type').evaluate((element) => element === document.activeElement), true);
    for (const selector of ['#search-type', '#search-clear']) {
      const control = page.locator(selector); await control.focus();
      const outline = await control.evaluate((element) => { const style = getComputedStyle(element); return { width: parseFloat(style.outlineWidth), style: style.outlineStyle }; });
      assert.ok(outline.width >= 2 && outline.style !== 'none', JSON.stringify(outline));
    }
    report.checks.push({ name: 'catalog contrast ratios', theme, ratios, passed: true });
  }, { theme });
  const routes = ['', 'concepts/', 'categories/', 'categories/context/', 'search/', 'concepts/mcp/', 'primitives/', 'primitives/state/', 'speaking-card/', 'skill-maps/', 'skill-maps/pstack/', 'skill-maps/pstack/nodes/', 'skill-maps/pstack/nodes/tdd/', 'skill-maps/pstack/journeys/fix-bug/', 'skill-maps/pstack/overview/', 'about/', '404.html'];
  const summaries = ['skill-maps/', 'skill-maps/pstack/', 'skill-maps/pstack/overview/', 'skill-maps/pstack/nodes/tdd/', 'skill-maps/pstack/journeys/fix-bug/'];
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    for (const route of routes) { await page.goto(`${origin}/${route}`); await settled(page); await check('template smoke', () => geometry(page), { route, width }); }
  }
  for (const theme of ['light', 'dark']) for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    for (const route of [...summaries, 'concepts/mcp/', 'primitives/state/']) {
      await page.goto(`${origin}/${route}`); await page.evaluate((theme) => { document.documentElement.dataset.theme = theme; }, theme); await settled(page);
      await check('changed layout', async () => {
        await geometry(page);
        if (summaries.includes(route)) {
          const g = await page.locator('.map-summary').first().evaluate((e) => { const probe = document.createElement('div'); probe.style.width = 'var(--lex-reading-width)'; e.parentElement.append(probe); const measure = probe.getBoundingClientRect().width; probe.remove(); return { width: e.getBoundingClientRect().width, expected: Math.min(e.parentElement.clientWidth, measure), display: getComputedStyle(e).display }; });
          assert.equal(g.display, 'block'); assert.ok(Math.abs(g.width - g.expected) <= 2, JSON.stringify(g));
        } else {
          const g = await page.locator('.practice-grid > div').evaluateAll((panels) => panels.map((p) => ({ top: p.getBoundingClientRect().top, label: p.querySelector('span').getBoundingClientRect().top })));
          if (width > 390) { assert.ok(Math.abs(g[0].top - g[1].top) <= 1); assert.ok(Math.abs(g[0].label - g[1].label) <= 1); } else assert.ok(g[1].top > g[0].top);
        }
        await page.screenshot({ path: join(evidence, `${route.replaceAll('/', '-') || 'home'}${width}-${theme}.png`), fullPage: true });
      }, { route, width, theme, screenshot: `${route.replaceAll('/', '-') || 'home'}${width}-${theme}.png` });
    }
  }
  for (const width of [320, 768, 1024]) for (const route of ['search/', 'skill-maps/pstack/nodes/', 'skill-maps/pstack/nodes/tdd/', 'skill-maps/pstack/journeys/fix-bug/', 'speaking-card/', 'concepts/mcp/', 'primitives/state/']) {
    await page.setViewportSize({ width, height: 960 }); await page.goto(`${origin}/${route}`); await settled(page); await check('reflow', () => geometry(page), { route, width });
  }
  await page.setViewportSize({ width: 1440, height: 960 }); await page.goto(`${origin}/search/`);
  await check('catalog search and scope help', async () => {
    const input = page.locator('#concept-search');
    assert.equal(await input.getAttribute('aria-describedby'), 'search-help'); assert.ok(await page.locator('#search-help').isVisible());
    for (const [query, href] of [['persistence','concepts/harness/'],['mcp','concepts/mcp/'],['模型上下文协议','concepts/mcp/'],['tool-calling','concepts/mcp/'],['tool calling','concepts/mcp/'],['tdd','skill-maps/pstack/nodes/tdd/'],['state','primitives/#state']]) {
      await input.fill(`  ${query.toUpperCase()}  `); assert.equal(await page.locator(`[data-search][href="${base}/${href}"]:visible`).count(), 1);
    }
    await input.fill('qwerty no-match'); assert.equal(await page.locator('[data-search]:visible').count(), 0); assert.ok(await page.locator('#search-empty').isVisible());
    await input.fill(''); assert.equal(await page.locator('[data-search]:visible').count(), await page.locator('[data-search]').count());
  });
  await check('Pagefind real punctuation and keyboard focus', async () => {
    const trigger = page.locator('button[data-open-modal]'); await trigger.click();
    const textbox = page.locator('dialog input'); await textbox.waitFor(); await textbox.pressSequentially('a/b'); assert.equal(await textbox.inputValue(), 'a/b');
    assert.equal(await textbox.evaluate((e) => e === document.activeElement), true);
    await page.keyboard.press('Tab'); assert.equal(await page.locator('dialog').evaluate((d) => d.contains(document.activeElement)), true);
    await page.keyboard.press('Escape'); assert.equal(await trigger.evaluate((e) => e === document.activeElement), true);
    const link = page.locator('main a').first(); await link.focus(); await page.keyboard.press('/'); assert.equal(await link.evaluate((e) => e === document.activeElement), true);
    await page.keyboard.press('Control+k'); assert.equal(await page.locator('dialog').evaluate((d) => d.open), true); await page.keyboard.press('Escape');
  });
  await page.goto(`${origin}/search/?type=skill-map`);
  await check('map scope language follows the canonical annotation', async () => {
    for (const map of dataset.skill_maps) {
      const row = page.locator(`[data-search][href="${base}/skill-maps/${map.id}/"]`);
      await language(row.locator('.concept-name > span > span').first(), map.text_languages?.scope ?? 'en');
    }
  });
  for (const slug of ['mcp','skill']) {
    await page.goto(`${origin}/concepts/${slug}/`);
    await check('canonical source links', async () => {
      const concept = dataset.concepts.find((c) => c.slug === slug);
      const links = page.locator('.concept-sources a'); assert.equal(await links.count(), concept.sources.length);
      for (const [i, source] of concept.sources.entries()) { assert.equal(await links.nth(i).textContent(), source.title); assert.equal(await links.nth(i).getAttribute('href'), source.url); await links.nth(i).focus(); assert.equal(await links.nth(i).evaluate((e) => e === document.activeElement), true); }
    }, { slug });
  }
  await page.goto(`${origin}/skill-maps/pstack/nodes/tdd/`);
  await check('node language separation', async () => { await language(page.locator('.map-summary'), 'zh-Hans'); await language(page.getByText('先构造最窄可执行 regression，证明其失败；再做最小修改；最后用同一测试证明通过。', { exact:true }), 'zh-Hans'); await language(page.locator('details').filter({ hasText: 'Official description' }).locator('p'), 'en'); await language(page.locator('.map-provenance > p').first(), 'zh-Hans'); });
  await page.goto(`${origin}/skill-maps/pstack/journeys/fix-bug/`);
  await check('journey language separation', async () => { await language(page.locator('.map-summary'), 'zh-Hans'); await language(page.getByText('Fix this regression', { exact:true }), 'en'); await language(page.getByText('存在适合的局部测试目标时。', { exact:true }), 'zh-Hans'); });
  await page.goto(`${origin}/skill-maps/pstack/overview/`);
  await check('canonical structure examples and counts', async () => {
    const map = dataset.skill_maps.find((m) => m.id === 'pstack'); const active = map.nodes.filter((n) => n.status === 'active');
    for (const type of map.taxonomy.relation_types) {
      const eligible = map.relations.filter((e) => e.type === type.id && active.some((n) => n.id === e.from) && active.some((n) => n.id === e.to)).sort((a,b) => a.from < b.from ? -1 : a.from > b.from ? 1 : a.to < b.to ? -1 : a.to > b.to ? 1 : 0);
      const row = page.locator(`[data-relation-type="${type.id}"]`); assert.equal(await row.count(), eligible.length ? 1 : 0);
      if (eligible.length) assert.deepEqual(await row.locator('a').evaluateAll((links) => links.map((a) => a.getAttribute('href'))), [eligible[0].from,eligible[0].to].map((id) => `${base}/skill-maps/pstack/nodes/${id}/`));
    }
    for (const layer of map.taxonomy.layers) { const group = page.locator(`[data-structure-group="${layer.id}"]`); const count = active.filter((n) => n.layer === layer.id).length; assert.ok((await group.textContent()).includes(`${count} active items`)); assert.equal(await group.locator('ul a').count(), Math.min(3,count)); }
  });
  await page.goto(`${origin}/skill-maps/pstack/nodes/`);
  for (const theme of ['light','dark']) await check('computed map-control contrast', async () => {
    await page.evaluate((theme) => { document.documentElement.dataset.theme = theme; }, theme);
    const ratios = await page.locator('.map-filters input[type="search"], .map-filters select, .map-filters button').evaluateAll((controls) => {
      const lum = (color) => { const channels = color.match(/[\d.]+/g).slice(0,3).map(Number).map((v) => { v/=255; return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4; }); return channels[0]*0.2126+channels[1]*0.7152+channels[2]*0.0722; };
      const contrast = (a,b) => { const x=lum(a), y=lum(b); return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05); };
      return controls.map((e) => { const s=getComputedStyle(e); return { border:contrast(s.borderTopColor,s.backgroundColor), text:contrast(s.color,s.backgroundColor), placeholder:e.matches('input')?contrast(getComputedStyle(e,'::placeholder').color,s.backgroundColor):null }; });
    });
    for (const ratio of ratios) { assert.ok(ratio.border>=3, JSON.stringify(ratio)); assert.ok(ratio.text>=4.5); if(ratio.placeholder!==null)assert.ok(ratio.placeholder>=4.5); }
    report.checks.push({ name:'contrast ratios', theme, ratios, passed:true });
  }, {theme});
  for (const width of [320,390]) {
    await page.setViewportSize({width,height:960}); await page.goto(`${origin}/skill-maps/pstack/nodes/`);
    await check('narrow native controls and visible focus', async () => {
      for (const selector of ['[data-map-query]','[data-map-type]','[data-map-cluster]','[data-map-retired]','[data-map-clear]']) { const control=page.locator(selector);await control.focus(); assert.ok(await control.isVisible()); assert.equal(await control.evaluate((e) => e === document.activeElement), true); }
      await page.locator('[data-map-retired]').press('Space'); assert.equal(await page.locator('[data-map-retired]').isChecked(),true);await directoryState(page);
      const menu=page.locator('starlight-menu-button button');await menu.focus();await menu.press('Enter');assert.equal(await page.locator('starlight-menu-button').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('starlight-menu-button').getAttribute('aria-expanded'),'false');
      await page.goto(`${origin}/speaking-card/`);const summary=page.locator('.speaking-card summary').first();await summary.focus();await summary.press('Enter');assert.equal(await summary.evaluate((e)=>e.parentElement.open),true);await summary.press('Space');assert.equal(await summary.evaluate((e)=>e.parentElement.open),false);
    }, {width});
  }
  await page.goto(`${origin}/`);
  await check('splash skip link', async()=>{await page.locator('.lex-skip-link').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#lexicon-content').evaluate((e)=>e===document.activeElement),true);});
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(`${origin}/`);
  await check('reduced motion',async()=>{const state=await page.evaluate(()=>({scroll:getComputedStyle(document.documentElement).scrollBehavior,animations:document.getAnimations().length}));assert.equal(state.scroll,'auto');assert.equal(state.animations,0);});await page.emulateMedia({reducedMotion:'no-preference'});
  assert.deepEqual(errors, []); await context.close();
  await searchHistory(browser, 'bfcache');
  await histories(browser,'pstack','bfcache');
  await browser.close(); browser = await chromium.launch({channel}); await searchHistory(browser, 'reload'); await histories(browser,'pstack','reload');
  await browser.close(); browser = await chromium.launch({channel,ignoreDefaultArgs:['--disable-back-forward-cache']});

  fixtureDirectory=await mkdtemp(join(tmpdir(),'lexicon-web-fixture-'));
  for(const path of ['src','scripts','schemas','tests','public','package.json','package-lock.json','astro.config.mjs','tsconfig.json','node_modules']) await cp(join(repository,path),join(fixtureDirectory,path),{recursive:true,verbatimSymlinks:true});
  const taxonomy={types:[{id:'custom',label:'自定义',description:'Custom capability.'}],layers:[{id:'empty',label:'Empty',description:'No members.'},{id:'work',label:'工作层',description:'Working items.'}],clusters:[{id:'second',label:'第二簇',description:'Secondary membership.'}],relation_types:[{id:'cycles',outgoing_label:'连接到',incoming_label:'Connected from',description:'Editorial cycle.'}]};
  const mixed={...mapInput,schema_version:'1.1.0',title:'混合地图',summary:'Mixed-language map.',taxonomy,text_languages:{title:'zh-Hans','taxonomy.types.0.label':'zh-Hans','taxonomy.layers.1.label':'zh-Hans','taxonomy.clusters.0.label':'zh-Hans','taxonomy.relation_types.0.outgoing_label':'zh-Hans'}};
  const fixtureNode={...nodeInput,title:'目标条目',summary:'Target capability.',type:'custom',layer:'work',primary_cluster:undefined,secondary_clusters:['second'],tags:['中文','Alpha'],text_languages:{title:'zh-Hans','tags.0':'zh-Hans'}};
  for(const [id,map,nodes,relations] of [['mixed',mixed,{a:fixtureNode,b:{...fixtureNode,title:'Other member',summary:'Another capability.',text_languages:{'tags.0':'zh-Hans'}},c:{...fixtureNode,title:'Third',summary:'Another capability.',text_languages:{'tags.0':'zh-Hans'}},d:{...fixtureNode,title:'Fourth',summary:'Another capability.',text_languages:{'tags.0':'zh-Hans'}},unlayered:{...fixtureNode,title:'Unlayered',summary:'Another capability.',layer:undefined,text_languages:{'tags.0':'zh-Hans'}},old:{title:'Old target',summary:'Retained.',status:'retired',type:'custom',primary_cluster:'second',retirement_note:'Use current tools.'}},[{from:'a',to:'b',type:'cycles'},{from:'b',to:'a',type:'cycles'},{from:'old',to:'a',type:'cycles'}]],['english',mapInput,{explain:nodeInput},[]],['empty',{...mapInput,taxonomy:{types:[{id:'tool',label:'Tool',description:'Capability.'}],relation_types:[]}}, {},[]]]) {
    const directory=join(fixtureDirectory,'src/data/skill-maps',id);await mkdir(join(directory,'nodes'),{recursive:true});await mkdir(join(directory,'journeys'),{recursive:true});await writeFile(join(directory,'map.yaml'),stringify(map));await writeFile(join(directory,'relations.yaml'),stringify({relations}));for(const [slug,node] of Object.entries(nodes))await writeFile(join(directory,'nodes',`${slug}.yaml`),stringify(node));
  }
  const conceptPath=join(fixtureDirectory,'src/data/concepts/verification.yaml');const concept=parse(await readFile(conceptPath,'utf8'));await writeFile(join(fixtureDirectory,'src/data/concepts/web-empty-source.yaml'),stringify({...concept,term:'Empty Source Fixture',sources:[]}));await writeFile(join(fixtureDirectory,'src/data/concepts/web-unusual-source.yaml'),stringify({...concept,term:'Unusual Source Fixture',sources:[{title:'URN source',url:'urn:example:web-source'}]}));
  await build(fixtureDirectory); root=join(fixtureDirectory,'dist');
  const synthetic=await browser.newContext();const fixturePage=await synthetic.newPage();
  await fixturePage.goto(`${origin}/skill-maps/mixed/nodes/`);
  await check('mixed-language composite headings and filters',async()=>{await language(fixturePage.locator('h1 span').first(),'zh-Hans');await language(fixturePage.locator('h1 span').nth(1),'en');await language(fixturePage.locator('option[value="custom"]'),'zh-Hans');await language(fixturePage.locator('option[value="second"]'),'zh-Hans');await language(fixturePage.locator('[data-map-item] strong').first(),'zh-Hans');});
  await fixturePage.goto(`${origin}/search/`);
  await check('mixed map Search composite annotation',async()=>{const row=fixturePage.locator(`[href="${base}/skill-maps/mixed/nodes/a/"]`);await language(row.locator('strong'),'zh-Hans');await language(row.locator('.concept-name > span > span').first(),'zh-Hans');await language(row.locator('.concept-name > span > span').nth(2),'zh-Hans');await language(row.locator('.concept-summary'),'en');});
  for(const id of ['english','empty']) {await fixturePage.goto(`${origin}/skill-maps/${id}/nodes/`);await check('unannotated custom taxonomy and empty directory',async()=>{await directoryState(fixturePage);assert.equal(await fixturePage.locator('[data-map-cluster]').count(),0);await language(fixturePage.locator('h1'),'en');},{mapId:id});await fixturePage.goto(`${origin}/skill-maps/${id}/overview/`);assert.equal(await fixturePage.locator('[data-relationship-examples]').count(),0);}
  await fixturePage.goto(`${origin}/concepts/web-empty-source/`);assert.equal(await fixturePage.locator('.concept-sources').count(),0);assert.equal(await fixturePage.locator('.practice-grid').count(),1);
  await fixturePage.goto(`${origin}/concepts/web-unusual-source/`);assert.equal(await fixturePage.locator('.concept-sources a').getAttribute('href'),'urn:example:web-source');
  await synthetic.close();await histories(browser,'mixed','bfcache');await browser.close();browser=await chromium.launch({channel});await histories(browser,'mixed','reload');
  const nojs=await browser.newContext({javaScriptEnabled:false});const staticPage=await nojs.newPage();
  for(const route of ['skill-maps/mixed/overview/','skill-maps/empty/overview/','skill-maps/mixed/nodes/','skill-maps/mixed/nodes/old/']) {await staticPage.goto(`${origin}/${route}`);await check('no-JavaScript canonical reading',async()=>{assert.equal(await staticPage.locator('h1:visible').count(),1);assert.ok(await staticPage.locator('main a:visible').count()>0);},{route});}
  await nojs.close();
} catch (error) { if (!report.failures.length) report.failures.push({ name:'browser execution',message:error.message }); process.exitCode=1;console.error(error); }
finally {
  if(browser)await browser.close();await new Promise((r)=>server.close(r));if(fixtureDirectory)await rm(fixtureDirectory,{recursive:true,force:true});
  await writeFile(join(evidence,'manifest.json'),`${JSON.stringify(report,null,2)}\n`);console.log(`${report.checks.length} passed; ${report.failures.length} failed. Evidence: ${evidence}`);
}
