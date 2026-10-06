import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { stringify } from 'yaml';
import { readCategories } from '../src/domain/taxonomy/categories.mjs';

const category = { name: 'L2 Category', slug: 'l2-category', code: 'L2', description: 'A new domain of practice.', question: 'What does this domain help us do?', order: 3 };

test('category YAML is discovered in explicit order and invalid configuration is diagnosed', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-category-taxonomy-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(join(directory, 'a.yaml'), stringify(category));
  await writeFile(join(directory, 'z.yml'), stringify({ ...category, name: 'First Domain', slug: 'first-domain', order: 1 }));
  assert.deepEqual(readCategories(directory).categories.map(({ name }) => name), ['First Domain', 'L2 Category']);
  assert.deepEqual(readCategories(directory).errors, []);
  for (const [data, expected] of [
    [{ ...category, slug: 'another-slug', order: 10 }, /duplicate name/],
    [{ ...category, name: 'Another Domain', order: 10 }, /duplicate slug/],
    [{ ...category, name: 'Another Domain', slug: 'another-slug' }, /duplicate order/],
    [{ ...category, slug: 'Bad Slug' }, /slug/],
    [{ ...category, question: undefined }, /question/],
    [{ ...category, description: ' ' }, /description/],
    [{ ...category, unknown: 'field' }, /Unrecognized key/],
  ]) {
    await writeFile(join(directory, 'invalid.yaml'), stringify(data));
    assert.match(readCategories(directory).errors.join('\n'), expected);
    await rm(join(directory, 'invalid.yaml'));
  }
});
