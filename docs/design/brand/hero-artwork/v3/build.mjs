import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../../../../../', import.meta.url);
const input = new URL('public/brand/hero-v2/rider-dark.svg', root);
const output = new URL('public/brand/hero-v3/', root);
const source = await readFile(input, 'utf8');
const paperStart = source.indexOf('<g fill="#EEF0E7">');
assert.ok(paperStart > 0, 'Expected the v2 warm-white path group');
const paperEnd = source.indexOf('</g>', paperStart) + 4;
const paper = '<mask id="hero-v3-paper" maskUnits="userSpaceOnUse" x="0" y="0" width="1111" height="1416">'
  + source.slice(paperStart, paperEnd).replace('fill="#EEF0E7"', 'fill="#FFFFFF"') + '</mask>';

// Paint the existing shapes; the silhouette, pose and arrow-tip star remain unchanged.
const highlights = [
  { id: 'face', cx: 750, cy: 355, radius: 180, color: '#E3E6DA' },
  { id: 'front-hand', cx: 410, cy: 485, radius: 100, color: '#C7CABF' },
  { id: 'back-hand', cx: 835, cy: 490, radius: 100, color: '#C7CABF' },
  { id: 'unicorn', cx: 955, cy: 990, radius: 245, color: '#C7CABF' },
];
const paint = '<linearGradient id="hero-v3-body" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1416">'
  + '<stop offset="0" stop-color="#999E91"/><stop offset="0.35" stop-color="#6C7165"/><stop offset="0.65" stop-color="#41473A"/><stop offset="1" stop-color="#383C34"/></linearGradient>'
  + highlights.map(({ id, cx, cy, radius, color }) => `<radialGradient id="hero-v3-${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${radius}"><stop offset="0" stop-color="${color}"/><stop offset="0.48" stop-color="${color}" stop-opacity="0.92"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`).join('');
const layers = '<g mask="url(#hero-v3-paper)"><rect width="1111" height="1416" fill="url(#hero-v3-body)"/>'
  + highlights.map(({ id }) => `<rect width="1111" height="1416" fill="url(#hero-v3-${id})"/>`).join('') + '</g>';
const svg = source.slice(0, paperStart) + layers + source.slice(paperEnd);
const result = svg.replace('</defs>', `${paper}${paint}</defs>`)
  .replace('AI Native Lexicon rider artwork, dark theme', 'AI Native Lexicon rider artwork, dark blended variant');
assert.doesNotMatch(result, /<(?:image|script|foreignObject)\b|data:image|\bon\w+=/i);
assert.doesNotMatch(result, /\bhref=/i);
await mkdir(output, { recursive: true });
await writeFile(new URL('rider-dark.svg', output), result);
const hash = data => createHash('sha256').update(data).digest('hex');
const exports = [];
for (const width of [340, 680]) {
  const data = await sharp(Buffer.from(result), { density: 144 }).resize({ width }).webp({ quality: 94, alphaQuality: 100 }).toBuffer();
  const file = `rider-dark-${width}.webp`;
  await writeFile(new URL(file, output), data);
  const metadata = await sharp(data).metadata();
  assert.equal(metadata.width, width);
  assert.equal(metadata.hasAlpha, true);
  exports.push({ file, width, height: metadata.height, bytes: data.length, sha256: hash(data) });
}
const alphaChecks = [];
for (const width of [240, 330, 340, 680]) {
  const alphaHash = async vector => {
    const { data } = await sharp(Buffer.from(vector), { density: 144 }).resize({ width }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    return hash(data.filter((_, index) => index % 4 === 3));
  };
  const before = await alphaHash(source);
  const after = await alphaHash(result);
  assert.equal(after, before, `Silhouette changed at ${width}px`);
  alphaChecks.push({ width, before, after });
}
await sharp(Buffer.from(result), { density: 144 }).resize({ width: 340 }).flatten({ background: '#151713' }).png().toFile(fileURLToPath(new URL('preview-dark-340.png', import.meta.url)));
await writeFile(new URL('assets.json', output), JSON.stringify({
  version: 3,
  status: 'local-dark-blend-experiment',
  source: 'public/brand/hero-v2/rider-dark.svg',
  source_sha256: hash(source),
  method: 'Native SVG recoloring of existing path geometry with internal paint references; no new image generation or raster embedding.',
  svg: { file: 'rider-dark.svg', bytes: Buffer.byteLength(result), sha256: hash(result), viewBox: [0, 0, 1111, 1416] },
  palette: ['#151713', '#999E91', '#6C7165', '#41473A', '#383C34', '#E3E6DA', '#C7CABF', '#C8FF3D', '#FFFFFF'],
  highlights,
  exports,
  alphaChecks,
}, null, 2) + '\n');
console.log(JSON.stringify({ output: fileURLToPath(output), exports, alphaChecks: alphaChecks.length }));
