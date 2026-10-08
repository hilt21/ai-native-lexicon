import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, join, sep, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'parse5';

function walk(node, visit) {
  visit(node, Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value])));
  for (const child of node.childNodes ?? []) walk(child, visit);
}
function text(node) { return node.value ?? (node.childNodes ?? []).map(text).join(''); }

/** Verify public XML against actual emitted HTML, including every alternate target. */
export async function verifySitemap(directory, { base = '/ai-native-lexicon' } = {}) {
  const root = resolve(directory), prefix = base.replace(/\/$/, '');
  const filenames = (await readdir(root)).filter((name) => /^sitemap-\d+\.xml$/.test(name));
  assert.ok(filenames.length, 'Build must emit native sitemap XML');
  const locations = new Map(), policies = new Map();
  async function policy(href) {
    const url = new URL(href);
    assert.ok(!prefix || url.pathname === prefix || url.pathname.startsWith(`${prefix}/`), `Sitemap URL outside deployment base: ${href}`);
    const relative = decodeURIComponent(url.pathname.slice(prefix.length));
    assert.ok(!extname(relative.replace(/\/$/, '')) || relative.endsWith('.html'), `Non-HTML sitemap entry: ${href}`);
    const file = resolve(root, `.${relative}`, relative.endsWith('/') ? 'index.html' : '');
    assert.ok(file.startsWith(`${root}${sep}`), href);
    if (policies.has(href)) return policies.get(href);
    const source = await readFile(file, 'utf8'), canonical = [], robots = [], links = [];
    let head;
    walk(parse(source), (node) => { if (node.tagName === 'head') head = node; });
    assert.ok(head, `Missing HTML head: ${href}`);
    walk(head, (node, attrs) => {
      if (node.tagName === 'link' && attrs.rel === 'canonical') canonical.push(attrs.href);
      if (node.tagName === 'meta' && attrs.name?.toLowerCase() === 'robots') robots.push(attrs.content ?? '');
      if (node.tagName === 'link' && attrs.rel === 'alternate' && attrs.hreflang) links.push({ lang: attrs.hreflang, url: attrs.href });
    });
    assert.equal(canonical.length, 1, `Exactly one canonical: ${href}`);
    assert.equal(new Set(links.map(({ lang }) => lang)).size, links.length, `Duplicate HTML alternate: ${href}`);
    const result = { canonical: canonical[0], indexable: !robots.some((value) => value.toLowerCase().split(/[\s,]+/).includes('noindex')), links };
    policies.set(href, result); return result;
  }
  for (const filename of filenames) {
    walk(parse(await readFile(join(root, filename), 'utf8')), (node) => {
      if (node.tagName !== 'url') return;
      let loc; const links = [];
      walk(node, (child, attrs) => {
        if (child.tagName === 'loc') loc = text(child);
        if (child.tagName === 'xhtml:link') links.push({ lang: attrs.hreflang, url: attrs.href });
      });
      assert.ok(loc, 'Sitemap URL requires loc');
      assert.ok(!locations.has(loc), `Duplicate sitemap location: ${loc}`);
      locations.set(loc, links);
    });
  }
  assert.ok(locations.size, 'Sitemap must contain eligible HTML pages');
  for (const [location, links] of locations) {
    const actual = await policy(location);
    assert.ok(actual.indexable && actual.canonical === location, `Sitemap includes noindex/non-self-canonical page: ${location}`);
    const sorted = (values) => values.map(({ lang, url }) => `${lang}\u0000${url}`).sort();
    assert.deepEqual(sorted(links), sorted(actual.links), `Sitemap alternates differ from HTML head: ${location}`);
    assert.equal(new Set(links.map(({ lang }) => lang)).size, links.length, `Duplicate sitemap alternate: ${location}`);
    for (const link of links) {
      assert.equal(new URL(link.url).origin, new URL(location).origin, `Foreign sitemap alternate: ${link.url}`);
      const target = await policy(link.url);
      assert.ok(target.indexable && target.canonical === link.url, `Sitemap alternate targets ineligible HTML: ${link.url}`);
      assert.ok(locations.has(link.url), `Sitemap alternate target is absent from sitemap: ${link.url}`);
    }
  }
  return { locations: locations.size, chunks: filenames.length, alternateTargets: policies.size };
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  console.log(await verifySitemap(process.argv[2] ?? 'dist', { base: process.env.BASE_PATH ?? '/ai-native-lexicon' }));
}
