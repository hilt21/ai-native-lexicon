import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../../../../../', import.meta.url);
const output = new URL('public/brand/hero-mobile/', root);
const hash = data => createHash('sha256').update(data).digest('hex');
const assets = [];
await mkdir(output, { recursive: true });
for (const [theme, directory] of [['light', 'hero-v2'], ['dark', 'hero-v3']]) {
  const source = `public/brand/${directory}/rider-${theme}.svg`;
  const svg = await readFile(new URL(source, root));
  const exports = [];
  for (const width of [480, 960]) {
    const data = await sharp(svg, { density: 144 }).resize({ width }).webp({ quality: 94, alphaQuality: 100 }).toBuffer();
    const file = `rider-${theme}-${width}.webp`;
    await writeFile(new URL(file, output), data);
    const metadata = await sharp(data).metadata();
    assert.equal(metadata.width, width);
    assert.equal(metadata.hasAlpha, true);
    exports.push({ file, width, height: metadata.height, bytes: data.length, sha256: hash(data) });
  }
  assets.push({ theme, source, source_sha256: hash(svg), exports });
}
await writeFile(new URL('assets.json', output), JSON.stringify({
  purpose: 'Mobile artwork at up to 480 CSS px with 1x/2x exports; existing vector geometry and colors preserved.',
  assets,
}, null, 2) + '\n');
console.log(JSON.stringify({ output: fileURLToPath(output), assets }));
