import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import { readCatalog, validateCatalog } from '../src/domain/content/catalog.mjs';
import { renderBrandShareImages } from '../src/lib/brand-share-images.mjs';

test('share output preserves full text, updates records, prunes retired output and rejects overflow', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-share-test-'));
  const outputDirectory = join(directory, 'social');
  const catalog = await readCatalog();
  assert.equal(validateCatalog(catalog).errors.length, 0);
  const guide = { ...catalog.speakingCards[0].data, number: 101, title: 'Context & tools: <input> "output"', coreIdea: 'A shared image preserves the guide’s complete idea, with & and <markup> rendered as text.' };
  const render = (guides) => renderBrandShareImages({ guides, outputDirectory, site: 'https://example.com', base: '/ai-native-lexicon' });
  try {
    const initial = await render([guide]);
    assert.equal(initial.length, 3);
    for (const image of initial.filter((image) => image.number !== null)) {
      assert.equal(image.title, guide.title);
      assert.equal(image.coreIdea, guide.coreIdea);
      assert.equal(image.url, 'https://example.com/ai-native-lexicon/speaking-card/#card-101');
      const metadata = await sharp(await readFile(join(outputDirectory, image.file))).metadata();
      assert.equal(metadata.width, image.width);
      assert.equal(metadata.height, image.height);
      assert.equal(metadata.format, 'png');
    }
    const digest = async () => createHash('sha256').update(await readFile(join(outputDirectory, 'card-101-landscape.png'))).digest('hex');
    const before = await digest();
    await render([guide]);
    assert.equal(await digest(), before, 'unchanged inputs produce the same image');
    await render([{ ...guide, coreIdea: 'The updated idea must produce a new image.' }]);
    assert.notEqual(await digest(), before);
    await render([]);
    assert.deepEqual((await readdir(outputDirectory)).sort(), ['default.png', 'manifest.json']);
    await assert.rejects(render([{ ...guide, title: 'Oversized title '.repeat(1000) }]), /card-101-landscape\.png.*cannot fit complete text/);
    assert.deepEqual((await readdir(outputDirectory)).sort(), ['default.png', 'manifest.json'], 'failed rendering does not publish a partial replacement');
    assert.deepEqual(await readdir(directory), ['social'], 'temporary image output is cleaned');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
