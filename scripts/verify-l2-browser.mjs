import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { join, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

export async function verifyBrowser(directory, evidence, fixture) {
  const { base, category, layer, conceptSlug, primitiveSlug, concept, primitive, guide, anchor, mapId, audience } = fixture;
  const root = resolve(directory, 'dist');
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (!pathname.startsWith(`${base}/`)) { response.writeHead(404).end(); return; }
      const path = resolve(root, pathname.slice(base.length + 1));
      if (!path.startsWith(`${root}${sep}`) && path !== root) { response.writeHead(404).end(); return; }
      const file = pathname.endsWith('/') ? join(path, 'index.html') : path;
      const contentType = file.endsWith('.html') ? 'text/html' : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.json') ? 'application/json' : file.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream';
      const content = await readFile(file);
      response.writeHead(200, { 'Content-Type': contentType }); response.end(content);
    } catch { response.writeHead(404).end(); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  let browser;
  const results = [];
  try {
    browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
    const url = `http://127.0.0.1:${server.address().port}${base}`;
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 960 }, isMobile: width === 390, hasTouch: width === 390 });
      try {
        await context.addInitScript(() => { window.l2HistoryShows = []; window.addEventListener('pageshow', (event) => window.l2HistoryShows.push(event.persisted)); });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(`${url}/search/?keep=fixture`);
        await page.waitForFunction(() => !!document.querySelector('#concept-search'));
        const input = page.locator('#concept-search');
        const type = page.locator('#search-type');
        const guideLink = page.locator(`[data-search][href="${base}/speaking-card/#${anchor}"]`);
        const total = await page.locator('[data-search]').count();
        const result = { width, queries: [], total };
        async function overflow(label) {
          const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
          assert.ok(dimensions.document <= width, `${label}: overflow ${JSON.stringify(dimensions)}`);
        }
        for (const query of [guide.title, 'Quasar acceptance', concept.term, concept.zh, primitive.term, primitive.zh]) {
          await input.fill(query);
          await guideLink.waitFor({ state: 'visible' });
          assert.ok(await guideLink.isVisible());
          if ([concept.term, concept.zh].includes(query)) await page.locator(`[data-search][href="${base}/concepts/${conceptSlug}/"]`).waitFor({ state: 'visible' });
          if ([primitive.term, primitive.zh].includes(query)) await page.locator(`[data-search][href="${base}/primitives/#${primitiveSlug}"]`).waitFor({ state: 'visible' });
          await overflow(query); result.queries.push(query);
        }
        await input.fill('CelestialAudience');
        const mapRow = page.locator(`[data-search][href="${base}/skill-maps/${mapId}/"]`);
        assert.equal(await page.locator('[data-search]:visible').count(), 1);
        assert.match(await mapRow.locator('[data-match-label]').textContent(), /Audience/);
        assert.equal(await mapRow.locator('[data-match-context]').textContent(), audience);
        assert.equal(await mapRow.locator('[data-match-context]').evaluate((element) => element.closest('[lang]')?.getAttribute('lang')), 'zh-Hans');
        result.audienceContext = true;
        await type.selectOption('skill-map');
        async function state(expected) {
          assert.equal(await input.inputValue(), expected.query);
          assert.equal(await type.inputValue(), expected.type);
          assert.deepEqual(await page.locator('[data-search]:visible').evaluateAll((rows) => rows.map((row) => row.getAttribute('href'))), expected.hrefs);
          assert.equal(await page.locator('#search-count').textContent(), `${expected.hrefs.length} matching ${expected.hrefs.length === 1 ? 'entry' : 'entries'}`);
          assert.equal(await page.locator('#search-empty').isVisible(), expected.hrefs.length === 0);
          const params = new URL(page.url()).searchParams;
          assert.equal(params.get('q'), expected.query); assert.equal(params.get('type'), expected.type);
          assert.equal(params.get('keep'), 'fixture');
        }
        const audienceState = { query: 'CelestialAudience', type: 'skill-map', hrefs: [`${base}/skill-maps/${mapId}/`] };
        await state(audienceState);
        const audienceUrl = page.url();
        await mapRow.click(); await page.waitForURL(`${url}/skill-maps/${mapId}/`);
        await page.evaluate(() => history.back()); await page.waitForURL(audienceUrl, { waitUntil: 'commit' }); await page.waitForTimeout(30);
        await state(audienceState);
        const persisted = await page.evaluate(() => window.l2HistoryShows.at(-1));
        assert.equal(persisted, false, 'The fixture visit return exercises a real reload; the main suite independently exercises BFCache');
        await page.reload(); await state(audienceState);
        const nodeState = { query: 'Quasar', type: 'map-node', hrefs: [`${base}/skill-maps/${mapId}/nodes/node/`, `${base}/skill-maps/${mapId}/nodes/retired/`] };
        await page.evaluate(() => history.pushState(null, '', '?q=Quasar&type=map-node&keep=fixture'));
        await page.evaluate(() => history.back()); await page.waitForURL(audienceUrl, { waitUntil: 'commit' }); await page.waitForTimeout(30); await state(audienceState);
        await page.evaluate(() => history.forward()); await page.waitForURL(/q=Quasar/, { waitUntil: 'commit' }); await page.waitForTimeout(30); await state(nodeState);
        await input.fill('zzzz-no-acceptance-match');
        const emptyState = { query: 'zzzz-no-acceptance-match', type: 'map-node', hrefs: [] };
        await state(emptyState); const emptyUrl = page.url();
        await page.locator(`main a[href="${base}/concepts/"]`).first().click(); await page.waitForURL(`${url}/concepts/`);
        await page.evaluate(() => history.back()); await page.waitForURL(emptyUrl, { waitUntil: 'commit' }); await page.waitForTimeout(30); await state(emptyState);
        await page.reload(); await state(emptyState);
        await page.locator('#search-clear').click();
        assert.equal(await input.inputValue(), ''); assert.equal(await type.inputValue(), '');
        assert.equal(await input.evaluate((element) => element === document.activeElement), true);
        assert.equal(new URL(page.url()).searchParams.get('keep'), 'fixture');
        assert.equal(new URL(page.url()).searchParams.has('q'), false); assert.equal(new URL(page.url()).searchParams.has('type'), false);
        assert.equal(await page.locator('[data-search]:visible').count(), total);
        assert.equal(await page.locator('#search-count').textContent(), `Showing all ${total} entries`);
        assert.equal(await page.locator('#search-empty').isVisible(), false);
        result.restoration = { persisted, reload: true, popstate: true, controls: true, rowsCountEmpty: true, clear: true, unrelatedParameters: true };
        await input.fill(concept.aliases[0]);
        const conceptRow = page.locator(`[data-search][href="${base}/concepts/${conceptSlug}/"]`);
        assert.equal(await page.locator('[data-search]:visible').count(), 1);
        assert.match(await conceptRow.locator('[data-match-label]').textContent(), /Aliases/);
        await input.fill('Quasar');
        assert.deepEqual(await page.locator('[data-search]:visible').evaluateAll((rows) => rows.map((row) => row.getAttribute('href'))), [
          `${base}/skill-maps/${mapId}/`, `${base}/skill-maps/${mapId}/journeys/journey/`, `${base}/skill-maps/${mapId}/nodes/node/`,
          `${base}/concepts/${conceptSlug}/`, `${base}/speaking-card/#${anchor}`, `${base}/primitives/#${primitiveSlug}`, `${base}/skill-maps/${mapId}/nodes/retired/`,
        ]);
        assert.match(await page.locator(`[data-search][href="${base}/skill-maps/${mapId}/nodes/retired/"]`).textContent(), /Retired/);
        for (const kind of ['concept', 'primitive', 'speaking-guide', 'skill-map', 'map-node', 'task-journey']) {
          await type.selectOption(kind);
          const visible = await page.locator('[data-search]:visible').evaluateAll((rows) => rows.map((row) => row.dataset.searchType));
          assert.equal(visible.length, kind === 'map-node' ? 2 : 1);
          assert.ok(visible.every((actual) => actual === kind));
          assert.equal(await page.locator('#search-count').textContent(), `${visible.length} matching ${visible.length === 1 ? 'entry' : 'entries'}`);
          const params = new URL(page.url()).searchParams; assert.equal(params.get('q'), 'Quasar'); assert.equal(params.get('type'), kind); assert.equal(params.get('keep'), 'fixture');
        }
        await type.selectOption('');
        await input.fill('zzzz-no-acceptance-match');
        await page.locator('#search-empty').waitFor({ state: 'visible' });
        assert.equal(await page.locator('[data-search]:visible').count(), 0);
        await page.locator('#search-clear').click();
        await page.waitForFunction((total) => document.querySelector('#search-count').textContent === `Showing all ${total} entries`, total);
        assert.equal(await page.locator('[data-search]:visible').count(), total);
        const pagefind = await page.evaluate(async () => {
          const index = await import(`${location.origin}${location.pathname.split('/search/')[0]}/pagefind/pagefind.js`);
          const result = await index.search('Quasar');
          return Promise.all(result.results.map((record) => record.data()));
        });
        assert.ok(pagefind.some((record) => new URL(record.url, url).pathname.includes(`/skill-maps/${mapId}/`)), 'Pagefind indexes the actual added map pages');
        result.pagefind = true;
        await input.fill(guide.title);
        await guideLink.waitFor({ state: 'visible' });
        await page.screenshot({ path: join(evidence, `search-${width}.png`), fullPage: true });
        await guideLink.click();
        await page.waitForURL(`${url}/speaking-card/#${anchor}`);
        const card = page.locator(`#${anchor}`);
        await card.locator('summary').click();
        assert.equal(await card.locator('details').evaluate((element) => element.open), true);
        assert.ok(await card.getByText(guide.keyLines[0], { exact: true }).isVisible());
        await overflow('expanded guide');
        await page.screenshot({ path: join(evidence, `card-${width}.png`), fullPage: false });
        await card.locator(`a[href="${base}/concepts/${conceptSlug}/"]`).click();
        await page.waitForURL(`${url}/concepts/${conceptSlug}/`);
        assert.ok(await page.locator('h1').filter({ hasText: concept.term }).isVisible());
        await overflow('concept');
        await page.locator(`main a[href="${base}/primitives/${primitiveSlug}/"]`).first().click();
        await page.waitForURL(`${url}/primitives/${primitiveSlug}/`);
        await page.locator('.primitive-definition p').filter({ hasText: concept.definition }).waitFor({ state: 'visible' });
        await overflow('primitive');
        await page.locator(`main a[href="${base}/primitives/#${layer.anchor}"]`).first().click();
        await page.waitForURL(`${url}/primitives/#${layer.anchor}`);
        assert.ok(await page.locator(`#${layer.anchor}`).isVisible());
        await overflow('layer');
        await page.goto(`${url}/categories/${category.slug}/`);
        await page.locator(`a[href="${base}/concepts/${conceptSlug}/"]`).first().click();
        await page.waitForURL(`${url}/concepts/${conceptSlug}/`);
        await page.locator(`main a[href="${base}/speaking-card/#${anchor}"]`).first().click();
        await page.waitForURL(`${url}/speaking-card/#${anchor}`);
        await overflow('category and backlink navigation');
        assert.deepEqual(errors, []);
        result.navigation = ['search→guide', 'guide→concept', 'concept→primitive', 'primitive→layer', 'category→concept', 'concept→guide'];
        result.aliases = true; result.sixTypes = true; result.ranking = true; result.retired = true;
        result.clear = true; result.noResults = true; result.notes = true; result.overflow = false;
        results.push(result);
      } finally { await context.close(); }
    }
    return { version: browser.version(), channel: process.env.PLAYWRIGHT_CHANNEL || 'chromium', viewports: results };
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}
