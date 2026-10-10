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
      await page.locator('.header starlight-theme-select select:visible').selectOption(theme);
      await settled(page);
      await visibleImagesLoaded(page.locator('.site-title img:visible'));
      await visibleImagesLoaded(page.locator('.resource-icon img:visible'));
      const edition = page.locator('[data-home-edition]');
      assert.equal(await edition.count(), 1);
      assert.equal(await edition.textContent(), locale ? '版本 0.1' : 'EDITION 0.1');
      assert.equal(await page.locator('.lexicon-hero').getByText(locale ? '版本 0.1' : 'EDITION 0.1', { exact: true }).count(), 0);
      assert.ok(await edition.evaluate((element) => element.getBoundingClientRect().top >= document.querySelector('.pagination-links').getBoundingClientRect().bottom), 'edition metadata follows the bottom navigation');
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
      const artwork = page.locator('[data-hero-artwork]');
      const loaded = await artwork.evaluate(async (element) => {
        const background = getComputedStyle(element).backgroundImage;
        const urls = [...background.matchAll(/url\("([^"]+)"\)/g)].map((match) => match[1]);
        const source = urls[devicePixelRatio > 1 ? 1 : 0];
        if (!source) throw new Error(`Missing theme artwork: ${background}`);
        const image = new Image(); image.src = source; await image.decode();
        return { source, width: image.naturalWidth };
      });
      assert.ok(loaded.source.includes(`/brand/hero-mobile/rider-${theme}-`));
      assert.equal(loaded.width, 480);
      const mobileArt = await artwork.boundingBox();
      const mobileCopy = await page.locator('.brand-hero-copy').boundingBox();
      const mobilePrimary = await primary.boundingBox();
      assert.ok(mobileArt && mobileCopy && Math.abs(mobileArt.x - mobileCopy.x) < 1, 'mobile artwork shares the text left edge');
      assert.ok(Math.abs(mobileArt.width - mobileCopy.width) < 1, '390px artwork fills the available text column');
      assert.ok(mobilePrimary && mobileArt.y >= mobilePrimary.y + mobilePrimary.height, 'the primary action precedes the artwork');
      await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
      await settled(page);
      await page.screenshot({ path: join(evidence, `brand-home-${locale ? 'zh' : 'en'}-${theme}-390.png`), fullPage: true });
      await page.setViewportSize({ width: 1440, height: 900 });
      await settled(page);
      const wide = await primary.boundingBox();
      assert.ok(wide && wide.x >= 0 && wide.x + wide.width <= 1440 && wide.y >= 0 && wide.y + wide.height <= 900);
      const wideDescription = await description.boundingBox();
      assert.ok(wideDescription && wideDescription.y >= 0 && wideDescription.y + wideDescription.height <= 900);
      assert.ok(await edition.evaluate((element) => element.getBoundingClientRect().top >= document.querySelector('.pagination-links').getBoundingClientRect().bottom), 'desktop edition metadata also follows the bottom navigation');
      const artBox = await artwork.boundingBox();
      const copyBox = await page.locator('.brand-hero-copy').boundingBox();
      assert.ok(artBox && artBox.width >= 310 && artBox.width <= 340 && artBox.y >= 0 && artBox.y + artBox.height <= 900);
      assert.ok(copyBox && artBox.x >= copyBox.x + copyBox.width, 'artwork does not overlap the text column');
      await page.screenshot({ path: join(evidence, `brand-home-${locale ? 'zh' : 'en'}-${theme}-1440.png`), fullPage: true });
      await page.setViewportSize({ width: 320, height: 844 });
      await settled(page);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '320px homepage has no horizontal overflow');
      for (const width of [320, 360, 390, 799]) {
        await page.setViewportSize({ width, height: 844 });
        await settled(page);
        const controls = page.locator('.header .right-group select:visible');
        assert.equal(await controls.count(), 2, 'both native selectors are visible in the mobile header');
        assert.equal(await page.locator('.lexicon-home select').count(), 0, 'Home has no duplicate content selectors');
        const items = [page.locator('.header .site-title img:visible'), page.locator('.header [data-open-modal]'), ...await controls.all()];
        const boxes = await Promise.all(items.map((item) => item.boundingBox()));
        assert.ok(boxes.every(Boolean));
        assert.ok(boxes[0].width >= 120, 'the wordmark meets its brand minimum width');
        for (let index = 1; index < boxes.length; index++) {
          const box = boxes[index];
          assert.ok(box.width >= 44 && box.height >= 44, 'mobile controls retain 44px targets');
          assert.ok(box.x >= boxes[index - 1].x + boxes[index - 1].width, 'header items do not overlap');
          assert.ok(box.x + box.width <= width, 'header items fit the viewport');
          assert.ok(Math.abs(box.y + box.height / 2 - (boxes[0].y + boxes[0].height / 2)) < 1, 'header items share one row');
        }
        for (const control of await controls.all()) {
          assert.ok(await control.evaluate((element) => element.labels[0].querySelector('.sr-only').textContent.trim()), 'icon selectors retain accessible names');
          await control.focus();
          assert.equal(await control.evaluate((element) => element === document.activeElement), true);
        }
        await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
        await page.screenshot({ path: join(evidence, `header-home-${locale ? 'zh' : 'en'}-${theme}-${width}.png`) });
        if (width === 360) {
          await page.locator('.home-footer').screenshot({ path: join(evidence, `edition-footer-${locale ? 'zh' : 'en'}-${theme}-360.png`) });
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
          await settled(page);
        }
      }
    }, { locale: locale || 'en', theme });
  }

  for (const locale of ['', 'zh-cn/']) for (const theme of ['light', 'dark']) {
    for (const width of [800, 1200]) await check('homepage exact responsive boundary', async () => {
      await page.setViewportSize({ width, height: 960 });
      await page.goto(`${origin}/${locale}`);
      await page.locator('.header starlight-theme-select select:visible').selectOption(theme);
      await settled(page);
      const artwork = page.locator('[data-hero-artwork]');
      const art = await artwork.boundingBox();
      const copy = await page.locator('.brand-hero-copy').boundingBox();
      const primary = await page.locator('.hero-actions .button-primary').boundingBox();
      assert.ok(art && copy && primary);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.equal(await artwork.evaluate((element) => getComputedStyle(element).transform), 'none', 'neither exact boundary shifts the artwork vertically');
      assert.ok(Math.abs(art.width - (width === 800 ? 480 : 310)) < 1);
      if (width === 800) {
        assert.ok(Math.abs(art.x - copy.x) < 1, '800px retains the single-column left edge');
        assert.ok(art.y >= primary.y + primary.height, '800px artwork follows the primary action');
      } else assert.ok(art.x >= copy.x + copy.width, '1200px artwork stays beside the text');
      const controls = page.locator('.header .right-group select:visible');
      assert.equal(await controls.count(), 2);
      for (const control of await controls.all()) {
        assert.notEqual(await control.evaluate((element) => getComputedStyle(element).color), 'rgba(0, 0, 0, 0)', '800px and 1200px retain desktop selector text');
      }
      await page.locator('.brand-hero-grid').screenshot({ path: join(evidence, `hero-boundary-${locale ? 'zh' : 'en'}-${theme}-${width}.png`) });
    }, { locale: locale || 'en', theme, width });
  }

  for (const locale of ['', 'zh-cn/']) for (const dpr of [1, 2]) await check('homepage native Auto selects and decodes theme and DPR artwork', async () => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: dpr, colorScheme: 'light' });
    try {
      const home = await context.newPage();
      async function assetAfter(path, action, theme, width) {
        const responsePromise = home.waitForResponse((response) => new URL(response.url()).pathname === `${base}/brand/${path}`);
        await action();
        const response = await responsePromise;
        assert.ok(response.ok());
        const metadata = await sharp(await response.body()).metadata();
        assert.equal(metadata.width, width);
        assert.equal(metadata.hasAlpha, true);
        await home.waitForFunction((expected) => document.documentElement.dataset.theme === expected, theme);
        await settled(home);
      }
      const mobileWidth = dpr === 1 ? 480 : 960;
      const desktopWidth = dpr === 1 ? 340 : 680;
      await assetAfter(`hero-mobile/rider-light-${mobileWidth}.webp`, () => home.goto(`${origin}/${locale}`), 'light', mobileWidth);
      const select = home.locator('.header starlight-theme-select select:visible');
      await select.selectOption('auto');
      assert.equal(await select.inputValue(), 'auto');
      await assetAfter(`hero-mobile/rider-dark-${mobileWidth}.webp`, () => home.emulateMedia({ colorScheme: 'dark' }), 'dark', mobileWidth);
      await assetAfter(`hero-v3/rider-dark-${desktopWidth}.webp`, () => home.setViewportSize({ width: 1440, height: 960 }), 'dark', desktopWidth);
      await assetAfter(`hero-v2/rider-light-${desktopWidth}.webp`, () => home.emulateMedia({ colorScheme: 'light' }), 'light', desktopWidth);
      await assetAfter(`hero-v2/rider-light-${desktopWidth}.webp`, () => home.reload(), 'light', desktopWidth);
      assert.equal(await select.inputValue(), 'auto', 'Auto survives reload without a second theme controller');
    } finally { await context.close(); }
  }, { locale: locale || 'en', dpr });

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
