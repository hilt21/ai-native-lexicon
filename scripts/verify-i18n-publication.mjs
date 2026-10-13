import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readCatalog } from '../src/domain/content/catalog.mjs';
import { createInventory, inspectHtml } from './verify-online.mjs';

/** Release gate: complete approved coverage AND correct rendered production HTML. */
export async function verifyI18nPublication({ directory = 'dist', target = 'https://hilt21.github.io/ai-native-lexicon/', catalog } = {}) {
  const inventory = createInventory(catalog ?? await readCatalog());
  const collections = inventory.coverage.collections;
  for (const [kind, c] of Object.entries(collections)) assert.equal(c.translated, c.total, `${kind}: full publication requires reviewed/current prose`);
  for (const map of inventory.coverage.skillMaps) assert.equal(map.coverage.translated, map.coverage.total, `${map.id}: full publication requires reviewed/current prose`);
  const failures = [];
  for (const page of inventory.pages) {
    const html = await readFile(join(directory, page.path, 'index.html'), 'utf8');
    const result = inspectHtml(html, page, new URL(target));
    if (result.failures.length) failures.push({ path: page.path, failures: result.failures });
  }
  assert.deepEqual(failures, [], JSON.stringify(failures, null, 2));
  return { pages: inventory.pages.length, collections: Object.fromEntries(Object.entries(collections).map(([kind, c]) => [kind, { records: c.records, translated: c.translated, total: c.total }])), skillMaps: inventory.coverage.skillMaps.map(({ id, coverage }) => ({ id, coverage })), failures };
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const result = await verifyI18nPublication();
  await mkdir('work/i18n-publication', { recursive: true });
  await writeFile('work/i18n-publication/rendered.json', `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
}
