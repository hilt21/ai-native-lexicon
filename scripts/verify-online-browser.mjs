import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

/** Deliberately small: changed native options and deployed lazy search requests only. */
export async function browserSmoke({ target, output }) {
  const report = { status: 'running', checkedAt: new Date().toISOString(), checks: [], failures: [], responses: [], errors: [], screenshots: [], limitations: ['Computed option styles do not prove OS-native popup rendering.', 'No screen reader or actual browser zoom session.'] };
  let browser;
  await mkdir(output, { recursive: true });
  try {
    try { browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chromium', headless: true }); }
    catch (error) { report.status = 'unavailable'; report.failures.push({ name: 'launch', message: error.message }); return report; }
    report.browserVersion = browser.version();
    const context = await browser.newContext();
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.on('pageerror', (error) => report.errors.push(error.message));
    page.on('requestfailed', (request) => {
      // Navigation can cancel speculative work; retain separately without hiding real network failures.
      const error = request.failure()?.errorText ?? '';
      report.responses.push({ url: request.url(), failure: error });
      if (!error.includes('ERR_ABORTED')) report.errors.push(`${request.url()}: ${error}`);
    });
    page.on('response', (response) => {
      report.responses.push({ url: response.url(), status: response.status(), type: response.headers()['content-type'] });
      if (response.status() >= 400) report.errors.push(`${response.url()}: HTTP ${response.status()}`);
    });
    const check = async (name, run) => {
      try { await run(); report.checks.push({ name, passed: true }); }
      catch (error) {
        report.checks.push({ name, passed: false }); report.failures.push({ name, message: error.message });
        const screenshot = `failed-${name.replace(/[^a-z0-9-]/gi, '-').slice(0,100)}.png`;
        try { await page.screenshot({ path: join(output, screenshot) }); report.screenshots.push(screenshot); }
        catch (captureError) { report.failures.push({ name: 'failure screenshot', message: captureError.message }); }
      }
    };
    for (const locale of ['en', 'zh-cn']) {
      await page.goto(new URL(locale === 'en' ? '' : 'zh-cn/', target).href);
      for (const theme of ['light', 'dark']) for (const width of [320, 1440]) {
        const name = `native-options-${locale}-${theme}-${width}`;
        await check(name, async () => {
          await page.setViewportSize({ width, height: 900 });
          await page.locator('starlight-theme-select select:visible').selectOption(theme);
          const selects = page.locator('.header :is(starlight-theme-select, lexicon-language-select) select:visible');
          assert.equal(await selects.count(), 2);
          const options = await selects.locator('option').evaluateAll((items) => items.map((item) => {
            const s = getComputedStyle(item);
            return { text: item.textContent.trim(), color: s.color, background: s.backgroundColor, ink: getComputedStyle(document.documentElement).getPropertyValue('--lex-ink').trim() };
          }));
          assert.ok(options.length >= 5);
          for (const option of options) {
            assert.ok(option.text, 'Option must have text');
            assert.ok(option.color !== 'transparent' && !/rgba\([^)]*,\s*0\s*\)/.test(option.color), `Invisible option ${JSON.stringify(option)}`);
          }
          const screenshot = `${name}.png`;
          await page.screenshot({ path: join(output, screenshot), fullPage: false }); report.screenshots.push(screenshot);
        });
      }
    }
    await check('deployed Pagefind query loads lazy resources and returns a result', async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(target);
      await page.locator('button[data-open-modal]').click();
      const input = page.locator('.pagefind-ui__search-input');
      await input.fill('harness');
      await page.locator('.pagefind-ui__result-link').first().waitFor({ state: 'visible' });
      assert.ok(report.responses.some((r) => r.url.includes('/pagefind/') && r.status === 200), 'No Pagefind network evidence');
      const screenshot = 'pagefind-online.png';
      await page.screenshot({ path: join(output, screenshot) }); report.screenshots.push(screenshot);
      await page.keyboard.press('Escape');
    });
    await check('no page errors or failed resource responses', async () => assert.deepEqual(report.errors, []));
    report.status = report.failures.length ? 'failed' : 'passed';
  } catch (error) { report.failures.push({ name: 'browser session', message: error.message }); report.status = 'failed'; }
  finally { await browser?.close(); report.finishedAt = new Date().toISOString(); }
  return report;
}
