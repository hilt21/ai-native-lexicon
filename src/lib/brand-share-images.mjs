import { readFile, mkdir, writeFile, mkdtemp, rm, rename } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const project = fileURLToPath(new URL('../../', import.meta.url));
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const idFor = (number) => `card-${String(number).padStart(2, '0')}`;

/** Build-time image projection of already validated Guide records. No new content parser. */
export async function renderBrandShareImages({ guides, outputDirectory, site, base = '', assetDirectory = join(project, 'public/brand') }) {
  const font = (await readFile(join(project, 'src/assets/brand/share-font.ttf'))).toString('base64');
  const asset = async (name, type = 'image/svg+xml') => `data:${type};base64,${(await readFile(join(assetDirectory, name))).toString('base64')}`;
  const [logo, darkLogo, star, mascot] = await Promise.all([asset('wordmark.svg'), asset('wordmark-dark.svg'), asset('north-star.svg'), asset('rider-mascot-491.webp', 'image/webp')]);
  await mkdir(dirname(outputDirectory), { recursive: true });
  const staging = await mkdtemp(join(dirname(outputDirectory), '.brand-social-'));
  let browser;
  const images = [];
  try {
    browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chromium' });
    const page = await browser.newPage({ deviceScaleFactor: 1 });
    const jobs = [{ number: null, title: 'AI Native Lexicon', coreIdea: 'Navigate AI-native systems. Concepts, Primitives, Speaking Cards and Skill Maps.', format: 'landscape' }, ...guides.flatMap((guide) => ['landscape', 'portrait'].map((format) => ({ ...guide, format })))];
    for (const job of jobs) {
      const portrait = job.format === 'portrait', branded = job.number === null;
      const width = portrait ? 1080 : 1200, height = portrait ? 1350 : 630;
      const name = branded ? 'default.png' : `${idFor(job.number)}-${job.format}.png`;
      const url = new URL(`${base.replace(/\/$/, '')}/speaking-card/${branded ? '' : `#${idFor(job.number)}`}`, site).href;
      const label = branded ? 'A FIELD GUIDE TO AI-NATIVE SYSTEMS' : `SPEAKING CARD / ${String(job.number).padStart(2, '0')}`;
      await page.setViewportSize({ width, height });
      await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
        @font-face{font-family:LexiconShare;src:url(data:font/ttf;base64,${font}) format('truetype');font-weight:100 900;font-display:block}
        *{box-sizing:border-box}body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:${branded ? '#171916' : '#f3f0e6'};color:${branded ? '#f3f0e6' : '#171916'};font-family:LexiconShare,sans-serif}
        .frame{position:relative;height:100%;padding:${portrait ? 80 : 64}px}header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid ${branded ? '#5f6358' : '#cfcec2'};padding-bottom:28px}header img{width:${portrait ? 310 : 250}px;height:auto}.label{font-size:20px;font-weight:600;letter-spacing:.1em}.copy{position:absolute;top:${portrait ? 240 : 172}px;left:${portrait ? 80 : 64}px;right:${branded ? 430 : portrait ? 80 : 64}px}.title{font-weight:800;line-height:1.08;letter-spacing:-.04em;max-height:${portrait ? 365 : 166}px;overflow-wrap:anywhere}.idea{margin-top:${portrait ? 48 : 26}px;font-size:${portrait ? 40 : 30}px;line-height:1.45;max-height:${portrait ? 435 : 176}px;overflow-wrap:anywhere}.star{width:${portrait ? 110 : 55}px;height:auto;position:absolute;bottom:${portrait ? 240 : 90}px;right:${portrait ? 80 : 64}px}.mascot{position:absolute;bottom:0;right:40px;width:340px;height:auto}footer{position:absolute;bottom:${portrait ? 70 : 36}px;left:${portrait ? 80 : 64}px;right:${portrait ? 80 : 64}px;border-top:1px solid ${branded ? '#5f6358' : '#cfcec2'};padding-top:18px;font-size:18px;overflow-wrap:anywhere}
      </style></head><body><div class="frame"><header><img src="${branded ? darkLogo : logo}" alt="AI Lexicon"><span class="label">${label}</span></header><div class="copy"><div class="title">${escape(job.title)}</div><div class="idea">${escape(job.coreIdea)}</div></div>${branded ? `<img class="mascot" src="${mascot}" alt="">` : `<img class="star" src="${star}" alt="">`}<footer>${escape(branded ? new URL(base || '/', site).href : url)}</footer></div></body></html>`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      if (!await page.evaluate(() => document.fonts.check('32px LexiconShare'))) throw new Error(`Brand share image ${name}: bundled font did not load`);
      for (const [selector, sizes] of [['.title', portrait ? [90, 80, 70, 60, 48, 40, 32] : [64, 60, 56, 48, 40, 32]], ['.idea', portrait ? [40, 36, 32, 28, 24] : [30, 28, 26, 24]]]) {
        const fits = await page.locator(selector).evaluate((element, sizes) => {
          for (const size of sizes) {
            element.style.fontSize = `${size}px`;
            if (element.scrollHeight <= Number.parseFloat(getComputedStyle(element).maxHeight) && element.scrollWidth <= element.clientWidth) return true;
          }
          return false;
        }, sizes);
        if (!fits) throw new Error(`Brand share image ${name}: ${selector} cannot fit complete text`);
      }
      const titleBox = await page.locator('.title').boundingBox(), ideaBox = await page.locator('.idea').boundingBox(), footerBox = await page.locator('footer').boundingBox();
      if (!titleBox || !ideaBox || !footerBox || titleBox.y + titleBox.height > ideaBox.y || ideaBox.y + ideaBox.height > footerBox.y) throw new Error(`Brand share image ${name}: text regions overlap`);
      await page.screenshot({ path: join(staging, name), type: 'png', animations: 'disabled' });
      images.push({ file: name, number: job.number, title: job.title, coreIdea: job.coreIdea, width, height, url });
    }
    await writeFile(join(staging, 'manifest.json'), JSON.stringify({ images }, null, 2) + '\n');
    await rm(outputDirectory, { recursive: true, force: true });
    await rename(staging, outputDirectory);
    return images;
  } finally {
    try { await browser?.close(); }
    finally { await rm(staging, { recursive: true, force: true }); }
  }
}
