import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { join, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

export async function verifyBrowser(directory, evidence, fixture) {
  const { base, category, layer, conceptSlug, primitiveSlug, concept, primitive, guide, anchor } = fixture;
  const root = resolve(directory, 'dist');
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (!pathname.startsWith(`${base}/`)) { response.writeHead(404).end(); return; }
      const path = resolve(root, pathname.slice(base.length + 1));
      if (!path.startsWith(`${root}${sep}`) && path !== root) { response.writeHead(404).end(); return; }
      const file = pathname.endsWith('/') ? join(path, 'index.html') : path;
      const contentType = file.endsWith('.html') ? 'text/html' : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'application/octet-stream';
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
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(`${url}/search/`);
        await page.waitForFunction(() => !!document.querySelector('#concept-search'));
        const input = page.locator('#concept-search');
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
        await input.fill('zzzz-no-acceptance-match');
        await page.locator('#search-empty').waitFor({ state: 'visible' });
        assert.equal(await page.locator('[data-search]:visible').count(), 0);
        await input.fill('');
        await page.waitForFunction((total) => document.querySelector('#search-count').textContent === `Showing all ${total} entries`, total);
        assert.equal(await page.locator('[data-search]:visible').count(), total);
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
