import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('custom splash titles replace the generated Starlight title panel', async () => {
  const css = await readSource('../src/styles/custom.css');
  assert.match(css, /body:has\(\.lexicon-home\) main > \.content-panel:first-of-type/);
  assert.match(css, /body:has\(\.not-found\) main > \.content-panel:first-of-type \{ display: none; \}/);
});

test('search result styles preserve the hidden attribute', async () => {
  const css = await readSource('../src/styles/custom.css');
  assert.match(css, /\.search-results > a\[hidden\], \.search-empty\[hidden\] \{ display: none; \}/);
});

test('listing surfaces omit empty tables of contents', async () => {
  const paths = [
    '../src/views/ConceptIndexPage.astro',
    '../src/views/CategoryIndexPage.astro',
    '../src/views/CategoryDetailPage.astro',
    '../src/views/SearchPage.astro',
  ];
  const sources = await Promise.all(paths.map(readSource));
  for (const source of sources) assert.match(source, /tableOfContents: false/);
});

test('the splash page exposes primary navigation without a sidebar', async () => {
  const home = await readSource('../src/views/HomePage.astro');
  assert.match(home, /<nav aria-label=\{ui\('Primary'\)\}>/);
  for (const path of ['/concepts/', '/categories/', '/search/']) {
    assert.match(home, new RegExp(`pathWithBase\\('${path}'\\)`));
  }
});

test('primitive catalog and concept links resolve to stable detail routes', async () => {
  const [row, detail, concept] = await Promise.all([
    '../src/components/PrimitiveRow.astro',
    '../src/lib/page-paths.ts',
    '../src/views/ConceptDetailPage.astro',
  ].map(readSource));

  assert.match(row, /id=\{primitive\.id\}/);
  assert.match(row, /href=\{pathWithBase\(`\/primitives\/\$\{primitive\.id\}\/`\)\}/);
  assert.match(detail, /params: \{ slug: id \}/);
  assert.match(concept, /`\/primitives\/\$\{primitive\.id\}\/`/);
});
