import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { join, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

export async function verifyBrowser(directory, evidence, fixture) {
  const { base, category, layer, conceptSlug, primitiveSlug, concept, primitive, guide, anchor, mapId, audience, translations } = fixture;
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
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
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
        for (const example of concept.examples) { assert.ok(await page.getByText(example.context, { exact: true }).isVisible()); assert.ok(await page.getByText(example.example, { exact: true }).isVisible()); }
        for (const distinction of concept.distinguish_from) { assert.ok(await page.getByText(distinction.distinction, { exact: true }).isVisible()); assert.equal(await page.locator(`.reading-distinction a[href="${base}/concepts/${distinction.target}/"]`).count(), 1); }
        await page.getByRole('button', { name: `Copy definition: ${concept.term}`, exact: true }).click();
        await page.locator('[data-copy-status]').getByText('Definition copied.', { exact: true }).waitFor();
        assert.equal(await page.evaluate(() => navigator.clipboard.readText()), concept.definition);
        assert.equal(await page.locator('[data-definition-body]').textContent(), concept.definition);
        await overflow('concept');
        await page.locator(`main a[href="${base}/primitives/${primitiveSlug}/"]`).first().click();
        await page.waitForURL(`${url}/primitives/${primitiveSlug}/`);
        await page.locator('.primitive-definition p').filter({ hasText: concept.definition }).waitFor({ state: 'visible' });
        await page.getByRole('button', { name: `Copy definition: ${primitive.term}: ${concept.term}`, exact: true }).click();
        await page.locator('[data-copy-status]').getByText('Definition copied.', { exact: true }).waitFor();
        assert.equal(await page.evaluate(() => navigator.clipboard.readText()), concept.definition);
        await page.evaluate(() => { Object.defineProperty(navigator.clipboard, 'writeText', { value: async () => { throw new DOMException('Permission denied', 'NotAllowedError'); } }); });
        await page.getByRole('button', { name: `Copy definition: ${primitive.term}: ${concept.term}`, exact: true }).click();
        await page.waitForFunction(() => document.querySelector('[data-copy-status]').textContent.startsWith('Could not copy'));
        assert.doesNotMatch(await page.locator('.primitive-definition').first().locator('[data-copy-status]').textContent(), /Definition copied/);
        result.reading = { examples: true, distinctions: true, referencedCopy: true, actualClipboard: true, denial: true };
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
        if (translations) {
          const chineseConcept = `${url}/zh-cn/concepts/${conceptSlug}/`;
          const chinesePrimitive = `${url}/zh-cn/primitives/${primitiveSlug}/`;
          async function renderedUnit(selector, expected, lang) {
            const body = page.locator(selector).filter({hasText:expected}).first();
            assert.equal((await body.innerText()).trim(),expected);
            assert.equal(await body.getAttribute('lang'),lang);
          }
          for (const theme of ['light','dark']) {
            await page.emulateMedia({colorScheme:theme});
            await page.goto(chineseConcept);
            assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
            assert.equal(await page.locator('h1').getAttribute('lang'),'en');
            await renderedUnit('.concept-deck',translations.conceptSummary,'zh-CN');
            await renderedUnit('[data-definition-body]',translations.conceptDefinition,'zh-CN');
            await renderedUnit('.reading-examples p',concept.examples[0].example,'en');
            assert.equal(await page.locator('.reading-distinction').count(),0);
            const coverage = page.locator('[data-translation-coverage]');
            assert.ok(Number(await coverage.getAttribute('data-stale'))>=2);
            assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),`https://hilt21.github.io${base}/zh-cn/concepts/${conceptSlug}/`);
            assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),0);
            assert.equal(await page.locator('link[hreflang="zh-CN"]').count(),1);
            for (const old of translations.retiredText) assert.ok(!(await page.locator('main').innerText()).includes(old));
            await page.locator('copy-definition button').click();
            await page.locator('[data-copy-status]').getByText('定义已复制。',{exact:true}).waitFor();
            assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),translations.conceptDefinition);
            await overflow(`translated concept ${theme}`);
            await page.screenshot({path:join(evidence,`translation-concept-${theme}-${width}.png`),fullPage:true,animations:'disabled'});

            await page.goto(chinesePrimitive);
            const definitions = page.locator('[data-definition-body]');
            assert.equal(await definitions.count(),3);
            assert.equal(await definitions.nth(0).getAttribute('lang'),'zh-CN');
            assert.equal(await definitions.nth(0).innerText(),translations.conceptDefinition);
            assert.equal(await definitions.nth(1).getAttribute('lang'),'en');
            assert.equal(await definitions.nth(1).innerText(),translations.referenceConcept.definition);
            assert.equal(await definitions.nth(2).getAttribute('lang'),'en');
            assert.equal(await definitions.nth(2).innerText(),primitive.definitions[2].text);
            await page.locator('copy-definition').nth(0).locator('button').click();
            await page.locator('copy-definition').nth(0).locator('[data-copy-status]').getByText('定义已复制。',{exact:true}).waitFor();
            assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),translations.conceptDefinition);
            await page.locator('copy-definition').nth(1).locator('button').click();
            await page.locator('copy-definition').nth(1).locator('[data-copy-status]').getByText('定义已复制。',{exact:true}).waitFor();
            assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),translations.referenceConcept.definition);
            for (const old of translations.retiredText) assert.ok(!(await page.locator('main').innerText()).includes(old));
            await overflow(`translated primitive ${theme}`);
            await page.screenshot({path:join(evidence,`translation-primitive-${theme}-${width}.png`),fullPage:true,animations:'disabled'});
          }
          for (const [id,state] of [['l2-partial-concept','missing'],['l2-draft-concept','draft'],['l2-stale-concept','stale']]) {
            await page.goto(`${url}/zh-cn/concepts/${id}/`);
            assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(),1);
            assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),`https://hilt21.github.io${base}/concepts/${id}/`);
            assert.equal(await page.locator('link[hreflang="zh-CN"]').count(),0);
            assert.equal(await page.locator('[data-definition-body]').getAttribute('lang'),'en');
            assert.ok(Number(await page.locator('[data-translation-coverage]').getAttribute(`data-${state}`))>0);
            assert.ok(!(await page.locator('main').innerText()).includes('L2草稿定义不得发布'));
            assert.ok(!(await page.locator('main').innerText()).includes('L2过期定义不得发布'));
          }
          await page.goto(`${chineseConcept}?q=HanOverlayFixture&type=concept#_top`);
          await page.locator('lexicon-language-select select:visible').first().selectOption(`${base}/concepts/${conceptSlug}/`);
          await page.waitForURL(`${url}/concepts/${conceptSlug}/?q=HanOverlayFixture&type=concept#_top`);
          await page.locator('lexicon-language-select select:visible').first().selectOption(`${base}/zh-cn/concepts/${conceptSlug}/`);
          await page.waitForURL(`${chineseConcept}?q=HanOverlayFixture&type=concept#_top`);
          assert.equal(await page.locator('[data-definition-body]').innerText(),translations.conceptDefinition);

          await page.goto(`${url}/zh-cn/search/?q=HanOverlayFixture&type=concept&keep=translation`);
          const chineseInput = page.locator('#concept-search'), chineseType = page.locator('#search-type');
          assert.equal(await chineseInput.inputValue(),'HanOverlayFixture');
          assert.equal(await chineseType.inputValue(),'concept');
          assert.deepEqual(await page.locator('[data-search]:visible').evaluateAll((rows)=>rows.map((row)=>row.getAttribute('href'))),[`${base}/zh-cn/concepts/${conceptSlug}/`]);
          for (const old of translations.retiredText) {
            await chineseInput.fill(old);
            assert.equal(await page.locator('[data-search]:visible').count(),0,`Stale vector searchable: ${old}`);
          }
          await chineseInput.fill('HanOverlayFixture');
          await page.reload();
          assert.equal(await chineseInput.inputValue(),'HanOverlayFixture');
          assert.equal(await chineseType.inputValue(),'concept');
          await page.locator('#search-clear').click();
          assert.equal(await chineseInput.inputValue(),'');
          assert.equal(await chineseType.inputValue(),'');
          assert.equal(new URL(page.url()).searchParams.get('keep'),'translation');
          const identities = await page.locator('[data-search]').evaluateAll((rows)=>rows.map((row)=>row.dataset.searchIdentity));
          assert.equal(new Set(identities).size,identities.length,'Field search counts each canonical identity once');
          const chinesePagefind = await page.evaluate(async ({base})=>{
            const index=await import(`${location.origin}${base}/pagefind/pagefind.js`); await index.init();
            const translated=await index.search('HanOverlayFixture');
            const fallback=await index.search('NebulaFallbackFixture');
            const stale=await index.search('L2旧示例甲');
            return {translated:await Promise.all(translated.results.map((result)=>result.data())),fallback:await Promise.all(fallback.results.map((result)=>result.data())),stale:stale.results.length};
          },{base});
          for (const key of ['translated','fallback']) {
            assert.ok(chinesePagefind[key].some((entry)=>new URL(entry.url,url).pathname===`${base}/zh-cn/concepts/${conceptSlug}/`),`Chinese Pagefind ${key} context`);
            assert.ok(chinesePagefind[key].every((entry)=>new URL(entry.url,url).pathname.startsWith(`${base}/zh-cn/`)),`Chinese Pagefind ${key} mixes languages`);
          }
          assert.equal(chinesePagefind.stale,0,'Pagefind must never expose removed owner translations');
          await page.goto(`${url}/search/`);
          const englishPagefind=await page.evaluate(async ({base})=>{
            const index=await import(`${location.origin}${base}/pagefind/pagefind.js`); await index.init();
            const result=await index.search('NebulaFallbackFixture');
            return Promise.all(result.results.map((entry)=>entry.data()));
          },{base});
          assert.ok(englishPagefind.some((entry)=>new URL(entry.url,url).pathname===`${base}/concepts/${conceptSlug}/`));
          assert.ok(englishPagefind.every((entry)=>!new URL(entry.url,url).pathname.startsWith(`${base}/zh-cn/`)));
          result.translations={themes:['light','dark'],actualLanguage:true,coreSEO:true,partialDraftStale:true,staleVectorsUnpublished:true,clipboard:true,referenceClipboard:true,selectorQueryAndFragment:true,fieldIdentity:true,fieldRestoration:true,pagefindLanguages:true,pagefindFallback:true,pagefindStaleAbsent:true};
        }
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
