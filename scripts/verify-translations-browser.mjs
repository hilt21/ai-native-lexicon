import assert from 'node:assert/strict';
import { join } from 'node:path';
import { readCatalog } from '../src/domain/content/catalog.mjs';
import { resolveCatalog } from '../src/domain/content/localize-catalog.mjs';

/** Real production-subpath acceptance; expectations come from the public immutable resolver. */
export async function verifyTranslationBrowser({ browser, origin, base, repository, evidence, check, report }) {
  const catalog = await readCatalog(join(repository, 'src/data'));
  const localized = resolveCatalog(catalog, catalog.translations, 'zh-CN');
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const page = await context.newPage();
  const localeUrl = (path) => `${origin}/zh-cn/${path}`;
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  try {
    await check('mobile splash exposes native language and theme controls with query/fragment round-trip', async () => {
      await page.setViewportSize({ width: 390, height: 960 });
      await page.goto(`${origin}/?q=harness&type=concept&keep=1#lexicon-content`);
      const theme = page.locator('starlight-theme-select select:visible');
      const language = page.locator('lexicon-language-select select:visible');
      assert.equal(await theme.count(), 1); assert.equal(await language.count(), 1);
      await language.focus(); assert.ok(await language.evaluate((element) => element === document.activeElement));
      await theme.selectOption('dark'); assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
      await language.selectOption(`${base}/zh-cn/`);
      await page.waitForURL(`${origin}/zh-cn/?q=harness&type=concept&keep=1#lexicon-content`);
      assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
      const labelFits = await language.evaluate((element) => { const style = getComputedStyle(element); const canvas = document.createElement('canvas').getContext('2d'); canvas.font = style.font; return element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) >= canvas.measureText(element.selectedOptions[0].text).width; });
      assert.ok(labelFits, 'Mobile Home language label must fit the native select');
      assert.equal(await page.locator('#lexicon-content').count(), 1);
      await theme.selectOption('light');
      await language.selectOption(`${base}/`);
      await page.waitForURL(`${origin}/?q=harness&type=concept&keep=1#lexicon-content`);
      assert.equal(await page.locator('html').getAttribute('lang'), 'en');
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
      await page.setViewportSize({ width: 1440, height: 960 });
      assert.equal(await language.count(), 1); assert.equal(await theme.count(), 1);
    });
    await check('bilingual shared records, unit languages, reference definition, Copy and core SEO', async () => {
      for (const [kind, records, ids] of [['concepts', localized.concepts, ['context-engineering', 'harness', 'mcp']], ['primitives', localized.primitives, ['harness', 'state']]]) {
        for (const id of ids) {
          const record = records.find((entry) => entry.id === id);
          await page.goto(localeUrl(`${kind}/${id}/`));
          assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
          assert.equal(await page.locator('h1').getAttribute('lang'), 'en');
          assert.equal(await page.locator('.concept-deck').textContent(), record.data.summary);
          assert.equal(await page.locator('.concept-deck').getAttribute('lang'), record.units.summary.actualLang);
          assert.equal(await page.locator('[data-translation-coverage]').getAttribute('data-translated'), `${record.coverage.translated}`);
          assert.equal(await page.locator('link[rel=canonical]').count(), 1);
          assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), `https://hilt21.github.io${base}/${record.coreTranslated ? 'zh-cn/' : ''}${kind}/${id}/`);
          assert.equal(await page.locator('meta[name=robots]').count(), record.coreTranslated ? 0 : 1);
          assert.equal(await page.locator('link[hreflang="zh-CN"]').count(), record.coreTranslated ? 1 : 0);
          const definitions = kind === 'concepts' ? [{ text: record.data.definition, textLang: record.units.definition.actualLang }] : record.definitions;
          for (const [index, definition] of definitions.entries()) {
            const body = page.locator('[data-definition-body]').nth(index);
            assert.equal(await body.textContent(), definition.text); assert.equal(await body.getAttribute('lang'), definition.textLang);
            const button = page.locator('copy-definition button').nth(index); await button.focus(); await button.press('Enter');
            await page.locator('[data-copy-status]').nth(index).getByText('定义已复制。', { exact: true }).waitFor();
            assert.equal(await page.evaluate(() => navigator.clipboard.readText()), definition.text);
          }
          const englishNeighbors = await page.locator('.record-navigation a').evaluateAll((links) => links.map((link) => ({ rel: link.rel, path: link.pathname.replace('/zh-cn/', '/') })));
          await page.goto(`${origin}/${kind}/${id}/`);
          assert.deepEqual(await page.locator('.record-navigation a').evaluateAll((links) => links.map((link) => ({ rel: link.rel, path: link.pathname }))), englishNeighbors);
          assert.equal(await page.locator('link[hreflang="zh-CN"]').count(), record.coreTranslated ? 1 : 0);
        }
      }
    });
    await check('Chinese rejected clipboard gives translated accessible feedback', async () => {
      await page.goto(localeUrl('concepts/harness/'));
      await page.evaluate(() => Object.defineProperty(navigator.clipboard, 'writeText', { value: async () => { throw new DOMException('Denied', 'NotAllowedError'); } }));
      await page.locator('copy-definition button').click(); await page.locator('[data-copy-status]').getByText('无法复制定义。请选中文字并手动复制。', { exact: true }).waitFor();
      assert.equal(await page.locator('[data-copy-status]').getAttribute('role'), 'status');
    });
    await check('locale selector keeps identity, q/type and valid destination fragment', async () => {
      for (const [path, hash] of [['concepts/harness/', '_top'], ['primitives/', 'layer-runtime-trust'], ['speaking-card/', 'card-01'], ['about/', 'editorial-stance']]) {
        await page.goto(`${origin}/${path}?q=harness&type=concept&keep=1#${hash}`);
        const valid = await page.locator(`lexicon-language-select`).first().evaluate((element, { base, path, hash }) => JSON.parse(element.dataset.fragments)[`${base}/zh-cn/${path}`].includes(hash), { base, path, hash });
        await page.locator('lexicon-language-select select:visible').first().selectOption(`${base}/zh-cn/${path}`);
        await page.waitForURL((url) => url.pathname === `${base}/zh-cn/${path}`);
        assert.equal(new URL(page.url()).searchParams.get('q'), 'harness'); assert.equal(new URL(page.url()).searchParams.get('type'), 'concept'); assert.equal(new URL(page.url()).searchParams.get('keep'), '1');
        assert.equal(new URL(page.url()).hash, valid ? `#${hash}` : '');
        if (valid) assert.equal(await page.locator(`[id="${hash}"]`).count(), 1);
        await page.locator('lexicon-language-select select:visible').first().selectOption(`${base}/${path}`); await page.waitForURL((url) => url.pathname === `${base}/${path}`);
        assert.equal(await page.locator('lexicon-language-select select:visible').first().inputValue(), `${base}/${path}`);
      }
      await page.goto(`${origin}/concepts/harness/#not-an-existing-heading`); await page.locator('lexicon-language-select select:visible').first().selectOption(`${base}/zh-cn/concepts/harness/`); await page.waitForURL(localeUrl('concepts/harness/')); assert.equal(new URL(page.url()).hash, '');
    });
    await check('native documentation fallback keeps English lang and omits untranslated alternate', async () => {
      for (const prefix of ['', 'zh-cn/']) {
        await page.goto(`${origin}/${prefix}about/`); assert.equal(await page.locator('link[hreflang="zh-CN"]').count(), 0);
        assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), `https://hilt21.github.io${base}/about/`);
        if (prefix) { assert.equal(await page.locator('main').getAttribute('lang'), 'en'); assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'noindex,follow'); }
      }
    });
    await check('Chinese field-search canonical identities, resolved excerpt language, labels and Clear', async () => {
      await page.goto(localeUrl('search/?q=Harness&type=concept&keep=1'));
      assert.equal(await page.locator('[data-search]:visible').first().getAttribute('href'), `${base}/zh-cn/concepts/harness/`);
      const row = page.locator('[data-search-identity="concept:harness"]'); const harness = localized.concepts.find((entry) => entry.id === 'harness');
      assert.equal(await row.locator('.concept-summary').textContent(), harness.data.summary); assert.equal(await row.locator('.concept-summary').getAttribute('lang'), harness.units.summary.actualLang);
      await page.locator('#concept-search').fill('模型上下文协议'); assert.equal(await page.locator('[data-search]:visible').first().getAttribute('href'), `${base}/zh-cn/concepts/mcp/`);
      await page.locator('#concept-search').fill('no-such-localized-result'); assert.equal(await page.locator('#search-count').textContent(), '0 条匹配记录'); assert.ok(await page.locator('#search-empty').isVisible());
      await page.locator('#search-clear').click(); assert.equal(await page.locator('#search-type').inputValue(), ''); assert.equal(new URL(page.url()).searchParams.get('keep'), '1');
      const identities = await page.locator('[data-search]:visible').evaluateAll((rows) => rows.map((row) => row.dataset.searchIdentity)); assert.equal(identities.length, new Set(identities).size);
      for (const kind of ['concept', 'primitive', 'speaking-guide', 'skill-map', 'map-node', 'task-journey']) { await page.locator('#search-type').selectOption(kind); assert.ok(await page.locator('[data-search]:visible').count()); assert.ok((await page.locator('[data-search]:visible').evaluateAll((rows) => rows.map((row) => row.dataset.searchType))).every((value) => value === kind)); }
    });
    await check('Chinese guide core-idea match preserves its original English excerpt language', async () => {
      const guide = catalog.speakingCards[0].data;
      await page.goto(localeUrl(`search/?type=speaking-guide&q=${encodeURIComponent(guide.coreIdea)}`));
      const row = page.locator(`[data-search-identity="speaking-guide:${guide.number}"]`);
      assert.ok(await row.isVisible());
      assert.equal(await row.locator('[data-match-context]').evaluate((element) => element.closest('[lang]')?.getAttribute('lang')), 'en');
      assert.ok((await row.locator('[data-match-context]').textContent()).includes(guide.coreIdea.slice(0, 25)));
    });
    await check('Pagefind executes separate real English and Chinese indexes including English fallback', async () => {
      async function search(prefix, query) {
        await page.goto(`${origin}/${prefix}search/`);
        return page.evaluate(async ({ base, query }) => { const pagefind = await import(`${base}/pagefind/pagefind.js`); const result = await pagefind.search(query); return Promise.all(result.results.map(async (item) => { const data = await item.data(); return { url: data.url, excerpt: data.excerpt, content: data.content }; })); }, { base, query });
      }
      const chinese = await search('zh-cn/', '上下文工程'); assert.ok(chinese.length); assert.ok(chinese.every((item) => item.url.includes('/zh-cn/')), JSON.stringify(chinese));
      // Native Chinese segmentation can prefer a directory's complete token over a detail's split tokens.
      // Prove the accepted Chinese definition itself is indexed, independently of that alias query.
      const translatedBody = await search('zh-cn/', '最小信息集');
      const pilot = translatedBody.find((item) => item.url.includes('/zh-cn/concepts/context-engineering/'));
      assert.ok(pilot, JSON.stringify(translatedBody));
      assert.ok(pilot.content.includes(localized.concepts.find((record) => record.id === 'context-engineering').data.definition));
      const fallback = await search('zh-cn/', 'protocol'); assert.ok(fallback.some((item) => item.url.includes('/zh-cn/concepts/mcp/')), JSON.stringify(fallback));
      const english = await search('', 'protocol'); assert.ok(english.length); assert.ok(english.every((item) => !item.url.includes('/zh-cn/')), JSON.stringify(english));
      report.checks.push({ name: 'actual Pagefind localized result targets', chinese, translatedBody, fallback, english, passed: true });
    });
    await check('Chinese native header search dialog keyboard and punctuation', async () => {
      await page.goto(localeUrl('search/')); await page.keyboard.press('Control+k'); const dialog = page.locator('dialog'); await dialog.waitFor({ state: 'visible' });
      const input = dialog.locator('input'); await input.fill('context'); await input.press('End'); await input.press('/'); assert.equal(await input.inputValue(), 'context/'); assert.equal(await page.locator('#concept-search').inputValue(), ''); await page.keyboard.press('Escape'); assert.ok(!(await dialog.isVisible()));
    });
    const routes = ['', 'concepts/', 'concepts/context-engineering/', 'concepts/harness/', 'concepts/mcp/', 'categories/', 'categories/context/', 'primitives/', 'primitives/harness/', 'primitives/state/', 'search/', 'speaking-card/', 'skill-maps/', 'skill-maps/pstack/', 'skill-maps/pstack/nodes/', 'skill-maps/pstack/nodes/tdd/', 'skill-maps/pstack/journeys/fix-bug/', 'skill-maps/pstack/overview/'];
    for (const theme of ['light', 'dark']) for (const width of [390, 1440]) for (const route of routes) {
      await page.setViewportSize({ width, height: 960 }); await page.goto(localeUrl(route)); await page.evaluate((value) => { document.documentElement.dataset.theme = value; }, theme);
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all(document.getAnimations().filter((animation) => animation.effect?.getTiming().iterations !== Infinity).map((animation) => animation.finished.catch(() => {}))); });
      await check('Chinese shell screenshot, native links, original language and narrow/wide geometry', async () => {
        assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
        const geometry = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth })); assert.ok(geometry.scroll <= geometry.width, JSON.stringify(geometry)); assert.equal(await page.locator('h1:visible').count(), 1);
        const internal = await page.locator('main a[href]').evaluateAll((links) => links.map((link) => ({ href: link.getAttribute('href'), card: link.closest('.speaking-card')?.id, download: link.hasAttribute('download'), shareAction: !!link.closest('.card-share-actions') })).filter(({ href }) => href.startsWith('/') && !href.endsWith('/dataset.json')));
        assert.ok(internal.every(({ href, card, download, shareAction }) => {
          if (shareAction && card) return download
            ? [`${base}/brand/social/${card}-landscape.png`, `${base}/brand/social/${card}-portrait.png`].includes(href)
            : href === `${base}/share/speaking-card/${card}/`;
          return href.startsWith(`${base}/zh-cn/`) && !href.includes('/zh-cn/zh-cn/') && !href.includes(`${base}${base}`);
        }), JSON.stringify(internal));
        const filename = `zh-cn-${route.replaceAll('/', '-') || 'home-'}${width}-${theme}.png`; await page.screenshot({ path: join(evidence, filename), fullPage: true, animations: 'disabled' });
        if (route === '' || route === 'categories/' || route === 'primitives/') {
          const eligible = route === 'primitives/' ? localized.layers.every((entry) => entry.units.label.status === 'reviewed') : localized.categories.every((entry) => ['label', 'description'].every((path) => entry.units[path].status === 'reviewed'));
          assert.equal(await page.locator('meta[name=robots]').count(), eligible ? 0 : 1);
          assert.equal(await page.locator('link[hreflang="zh-CN"]').count(), eligible ? 1 : 0);
        }
        if (route === 'categories/context/') { const category = localized.categories.find((entry) => entry.id === 'context'); assert.equal(await page.locator('meta[name=robots]').count(), category.coreTranslated ? 0 : 1); assert.equal(await page.locator('h1').getAttribute('lang'), category.units.label.actualLang); }
        if (route === 'speaking-card/') { assert.equal(await page.locator('.speaking-card h2').first().getAttribute('lang'), 'en'); assert.ok(await page.locator('[data-resource-language-note]').isVisible()); }
        if (route === 'skill-maps/pstack/nodes/tdd/') { assert.equal(await page.locator('.map-summary').getAttribute('lang'), 'zh-Hans'); assert.equal(await page.locator('details p[lang="en"]').first().getAttribute('lang'), 'en'); assert.ok(await page.locator('[data-resource-language-note]').isVisible()); }
      }, { route, width, theme });
    }
    await check('Chinese keyboard Copy focus, computed contrast and reduced motion', async () => {
      for (const theme of ['light', 'dark']) {
        await page.goto(localeUrl('concepts/harness/')); await page.evaluate((value) => { document.documentElement.dataset.theme = value; }, theme);
        const button = page.locator('copy-definition button'); await button.focus(); await button.press('Tab'); await page.keyboard.press('Shift+Tab');
        const ratio = await button.evaluate((element) => { const style = getComputedStyle(element); const lum = (color) => color.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0); const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }; return { active: element === document.activeElement, outline: parseFloat(style.outlineWidth), text: contrast(style.color, style.backgroundColor), focus: contrast(style.outlineColor, style.backgroundColor) }; });
        assert.ok(ratio.active && ratio.outline >= 2 && ratio.text >= 4.5 && ratio.focus >= 3, JSON.stringify(ratio)); report.checks.push({ name: 'Chinese actual Copy contrast', theme, ratio, passed: true });
      }
      await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto(localeUrl('')); assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto'); assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
    });
    await check('unknown locale and nonexistent localized record return actual 404', async () => { for (const path of ['fr/concepts/harness/', 'zh-cn/concepts/no-such-record/', 'zh-cn/skill-maps/no-such-map/']) { const response = await page.request.get(`${origin}/${path}`); assert.equal(response.status(), 404); } });
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
}
