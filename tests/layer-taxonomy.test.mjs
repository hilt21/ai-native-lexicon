import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { stringify } from 'yaml';
import { readLayers, layerRegistry } from '../src/domain/taxonomy/layers.mjs';

const layer = { name: 'New Layer', anchor: 'layer-explicit-target', order: 10 };

test('layer YAML uses explicit anchors and rejects duplicate or invalid configuration', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-layer-taxonomy-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(join(directory, 'a.yaml'), stringify(layer));
  await writeFile(join(directory, 'z.yml'), stringify({ name: 'Earlier Layer', anchor: 'layer-first-target', order: 1 }));
  assert.deepEqual(readLayers(directory).errors, []);
  assert.deepEqual(readLayers(directory).layers.map(({ anchor }) => anchor), ['layer-first-target', 'layer-explicit-target']);
  for (const [data, expected] of [
    [{ ...layer, anchor: 'layer-another', order: 20 }, /duplicate name/],
    [{ ...layer, name: 'Another Layer', order: 20 }, /duplicate anchor/],
    [{ ...layer, name: 'Another Layer', anchor: 'layer-another' }, /duplicate order/],
    [{ ...layer, anchor: 'layer Bad Anchor' }, /anchor/],
    [{ ...layer, anchor: 'primitive-target' }, /anchor/],
    [{ ...layer, name: ' ' }, /name/],
    [{ ...layer, unknown: true }, /Unrecognized key/],
    [{ name: 'Heading Collision', anchor: 'layer-first-target-title', order: 20 }, /navigation ID.*layer-first-target-title/],
  ]) {
    await writeFile(join(directory, 'invalid.yaml'), stringify(data));
    assert.match(readLayers(directory).errors.join('\n'), expected);
    await rm(join(directory, 'invalid.yaml'));
  }
});

test('the original five public layer anchors remain stable', () => {
  const original = ['layer-purpose-governance', 'layer-structure-representation', 'layer-dynamics-control', 'layer-cognition-action', 'layer-runtime-trust'];
  assert.deepEqual(layerRegistry.slice(0, 5).map(({ anchor }) => anchor), original);
});
