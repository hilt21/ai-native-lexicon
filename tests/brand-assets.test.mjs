import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const assets = new URL('public/brand/', root);
const manifest = JSON.parse(await readFile(new URL('assets.json', assets), 'utf8'));

test('brand delivery has ten uniquely identified, source-traceable assets', async () => {
  assert.equal(manifest.assets.length, 10);
  assert.equal(new Set(manifest.assets.map((asset) => asset.id)).size, 10);
  for (const asset of manifest.assets) {
    const source = await readFile(new URL(`docs/design/brand/v1/${asset.source}`, root));
    assert.equal(createHash('sha256').update(source).digest('hex'), asset.source_sha256);
    assert.equal(asset.status, 'source-derived-reviewed');
    for (const file of asset.files) assert.ok((await readFile(new URL(file, assets))).length > 0);
  }
});

test('brand SVGs render at target sizes without external resources', async () => {
  for (const asset of manifest.assets.filter((asset) => asset.id !== 'rider-mascot')) {
    for (const file of asset.files) {
      const source = await readFile(new URL(file, assets), 'utf8');
      assert.match(source, /viewBox="0 0 \d+ \d+"/);
      assert.doesNotMatch(source, /<(?:script|foreignObject|image)\b|\bon\w+=|\bhref=/i);
      for (const width of asset.id === 'north-star' ? [16, 32] : asset.id === 'wordmark' ? [120] : [24, 64]) {
        const result = await sharp(Buffer.from(source)).resize({ width }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
        assert.equal(result.info.width, width);
        const alpha = result.data.filter((_, index) => index % 4 === 3);
        assert.ok(alpha.some((value) => value > 0), `${file} has visible pixels`);
        assert.ok(alpha.some((value) => value === 0), `${file} has transparent background`);
      }
    }
  }
});

test('mascot outputs retain alpha and stay within original source resolution', async () => {
  const mascot = manifest.assets.find((asset) => asset.id === 'rider-mascot');
  assert.deepEqual(mascot.native_size, [491, 626]);
  for (const file of mascot.files) {
    const content = await readFile(new URL(file, assets));
    const metadata = await sharp(content).metadata();
    assert.ok(metadata.width <= mascot.native_size[0]);
    assert.ok(metadata.height <= mascot.native_size[1]);
    assert.equal(metadata.hasAlpha, true);
  }
});
