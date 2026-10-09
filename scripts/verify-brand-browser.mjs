import assert from 'node:assert/strict';
import { join } from 'node:path';
import sharp from 'sharp';

async function visibleImagesLoaded(locator) {
  assert.ok(await locator.count(), 'at least one visible brand image exists');
  for (const image of await locator.all()) {
    assert.ok(await image.evaluate((element) => element.complete && element.naturalWidth > 0), await image.getAttribute('src'));
  }
}

export async function verifyBrandBrowser({ browser, page, origin, base, evidence, check, settled }) {
  for (const locale of ['', 'zh-cn/']) for (const theme of ['light', 'dark']) {
    await check('brand homepage primary action and task discovery', async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${origin}/${locale}`);
      await page.evaluate((theme) => { document.documentElement.dataset.theme = theme; }, theme);
      await settled(page);
      await visibleImagesLoaded(page.locator('.site-title img:visible'));
      await visibleImagesLoaded(page.locator('.resource-icon img:visible'));
      const primary = page.locator('.hero-actions .button-primary');
      const box = await primary.boundingBox();
      assert.ok(box && box.x >= 0 && box.x + box.width <= 390 && box.y >= 0 && box.y + box.height <= 844, 'the entire primary action is in the first viewport');
      assert.equal(await primary.evaluate((element) => getComputedStyle(element).opacity), '1');
      const description = page.locator('.hero-manifesto > p');
      const descriptionBox = await description.boundingBox();
      assert.ok(descriptionBox && descriptionBox.y >= 0 && descriptionBox.y + descriptionBox.height <= 844);
      assert.equal(await description.evaluate((element) => getComputedStyle(element).opacity), '1');
      assert.equal(await page.locator('[data-task-entry]').count(), 4);
      for (const [kind, suffix] of [['concept', 'concepts/'], ['primitive', 'primitives/'], ['speaking-guide', 'speaking-card/'], ['skill-map', 'skill-maps/']]) {
        const link = page.locator(`[data-task-entry="${kind}"]`);
        assert.equal(await link.getAttribute('href'), `${base}/${locale}${suffix}`);
        await link.focus();
        assert.equal(await link.evaluate((element) => element === document.activeElement), true);
      }
      const image = page.locator('.brand-mascot');
      assert.ok(await image.evaluate((element) => element.complete && element.naturalWidth > 0));
      assert.ok((await image.boundingBox()).width <= 245);
      await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
      await settled(page);
      await page.screenshot({ path: join(evidence, `brand-home-${locale ? 'zh' : 'en'}-${theme}-390.png`), fullPage: true });
      await page.setViewportSize({ width: 1440, height: 900 });
      await settled(page);
      const wide = await primary.boundingBox();
      assert.ok(wide && wide.x >= 0 && wide.x + wide.width <= 1440 && wide.y >= 0 && wide.y + wide.height <= 900);
      const wideDescription = await description.boundingBox();
      assert.ok(wideDescription && wideDescription.y >= 0 && wideDescription.y + wideDescription.height <= 900);
      await page.screenshot({ path: join(evidence, `brand-home-${locale ? 'zh' : 'en'}-${theme}-1440.png`), fullPage: true });
      await page.setViewportSize({ width: 320, height: 844 });
      await settled(page);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '320px homepage has no horizontal overflow');
    }, { locale: locale || 'en', theme });
  }

  await check('six resource identities retain search result labels', async () => {
    await page.goto(`${origin}/search/`);
    await settled(page);
    for (const kind of ['concept', 'primitive', 'speaking-guide', 'skill-map', 'map-node', 'task-journey']) {
      const result = page.locator(`[data-search-type="${kind}"]`).first();
      assert.ok(await result.count());
      assert.equal(await result.locator('[data-resource-icon]').getAttribute('data-resource-icon'), kind);
      await visibleImagesLoaded(result.locator('.resource-icon img:visible'));
      assert.ok((await result.locator('.concept-category').innerText()).trim());
    }
  });

  await check('default brand metadata and actual image response', async () => {
    for (const locale of ['', 'zh-cn/']) {
      await page.goto(`${origin}/${locale}`);
      assert.equal(await page.locator('meta[property="og:image"]').count(), 1);
      assert.equal(await page.locator('meta[name="twitter:image"]').count(), 1);
      const url = new URL(await page.locator('meta[property="og:image"]').getAttribute('content'));
      assert.equal(url.protocol, 'https:');
      assert.equal(url.pathname, `${base}/brand/social/default.png`);
    }
    const response = await page.request.get(`${origin}/brand/social/default.png`);
    assert.ok(response.ok());
    const metadata = await sharp(await response.body()).metadata();
    assert.equal(metadata.width, 1200); assert.equal(metadata.height, 630);
  });

  const data = await (await page.request.get(`${origin}/dataset.json`)).json();
  const images = await (await page.request.get(`${origin}/brand/social/manifest.json`)).json();
  assert.equal(images.images.length, data.speaking_cards.length * 2 + 1);
  const noScript = await browser.newContext({ javaScriptEnabled: false });
  try {
    const share = await noScript.newPage();
    for (const card of data.speaking_cards) {
      const id = `card-${String(card.number).padStart(2, '0')}`;
      await check('static card sharing matches the original guide', async () => {
        const response = await share.goto(`${origin}/share/speaking-card/${id}/`);
        assert.ok(response.ok());
        assert.equal(await share.locator('h1').textContent(), card.title);
        assert.equal(await share.locator('.lead').textContent(), card.coreIdea);
        assert.equal(await share.locator('meta[name="robots"]').getAttribute('content'), 'noindex,follow');
        assert.equal(new URL(await share.locator('link[rel="canonical"]').getAttribute('href')).pathname, `${base}/speaking-card/`);
        assert.equal(new URL(await share.locator('meta[property="og:url"]').getAttribute('content')).pathname, `${base}/share/speaking-card/${id}/`);
        assert.equal(await share.locator('.read').getAttribute('href'), `${base}/speaking-card/#${id}`);
        for (const format of ['landscape', 'portrait']) {
          const file = `${id}-${format}.png`, record = images.images.find((image) => image.file === file);
          assert.equal(record.title, card.title); assert.equal(record.coreIdea, card.coreIdea);
          const response = await share.request.get(`${origin}/brand/social/${file}`);
          assert.ok(response.ok());
          const metadata = await sharp(await response.body()).metadata();
          assert.equal(metadata.width, format === 'landscape' ? 1200 : 1080);
          assert.equal(metadata.height, format === 'landscape' ? 630 : 1350);
        }
      }, { card: card.number });
    }
    await check('unknown card has no generated sharing route', async () => {
      const missing = await share.request.get(`${origin}/share/speaking-card/card-999999/`);
      assert.equal(missing.status(), 404);
    });
  } finally { await noScript.close(); }
  await check('sharing projections do not enter Pagefind', async () => {
    await page.goto(`${origin}/`);
    const urls = await page.evaluate(async (base) => {
      const pagefind = await import(`${base}/pagefind/pagefind.js`);
      const result = await pagefind.search('Agent Harness');
      return Promise.all(result.results.map(async (item) => (await item.data()).url));
    }, base);
    assert.ok(urls.length > 0);
    assert.ok(urls.every((url) => !url.includes('/share/') && !url.includes('/brand/preview')));
  });
}
