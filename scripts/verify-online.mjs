import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'parse5';
import { readCatalog, validateCatalog } from '../src/domain/content/catalog.mjs';
import { resolveCatalog } from '../src/domain/content/localize-catalog.mjs';
import { resolveSkillMaps } from '../src/domain/content/skill-map-translations.mjs';
import { skillMapOverview } from '../src/domain/content/skill-map-overview.mjs';

export function walk(node, visit, inheritedLang = '') {
  const attrs = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
  const lang = attrs.lang ?? inheritedLang;
  visit(node, attrs, lang);
  for (const child of node.childNodes ?? []) walk(child, visit, lang);
}
const text = (node) => node.value ?? (node.childNodes ?? []).map(text).join('');
const normal = (value) => String(value).replace(/\s+/g, ' ').trim();
function localizedText(node, inheritedLang) {
  const languages = new Set();
  walk(node, (child, _attrs, lang) => {
    if (child.nodeName === '#text' && normal(child.value)) languages.add(lang);
  }, inheritedLang);
  return { text: normal(text(node)), lang: languages.size === 1 ? [...languages][0] : null };
}
export const manualChecks = ['screen-reader', 'browser-400-percent', 'real-device-selects', 'linkedin-preview', 'x-preview', 'social-cache-refresh'];

export function createInventory(catalog) {
  const errors = validateCatalog(catalog).errors;
  assert.equal(errors.length, 0, errors.join('\n'));
  const zh = resolveCatalog(catalog, catalog.translations, 'zh-CN');
  const en = resolveCatalog(catalog, catalog.translations, 'en');
  const pages = [];
  const add = (path, eligible = true, extra = {}) => {
    for (const locale of ['en', 'zh-CN']) pages.push({ path: `${locale === 'zh-CN' ? 'zh-cn/' : ''}${path}`, root: path, locale, eligible, ...extra });
  };
  const navigationReady = zh.categories.every((r) => ['label', 'description'].every((key) => r.units[key].status === 'reviewed'));
  const sumCoverage = (records) => records.reduce((sum, record) => {
    for (const key of Object.keys(sum)) sum[key] += record.coverage[key];
    return sum;
  }, { translated: 0, total: 0, missing: 0, draft: 0, stale: 0 });
  add('', navigationReady, { coverage: sumCoverage(zh.categories) });
  add('categories/', navigationReady, { coverage: sumCoverage(zh.categories) });
  const maps = resolveSkillMaps(catalog.skillMaps, catalog.skillMapTranslations ?? [], 'zh-CN');
  const ownerTexts = (map, key, predicate = () => true) => Object.entries(map.localization.owners[key].units).filter(([path]) => predicate(path)).map(([path, unit]) => ({ owner: `${map.id}/${key}/${path}`, ...unit }));
  const taxonomyText = (map, kind, id, field) => {
    const index = map.data.taxonomy[kind].findIndex((r) => r.id === id);
    return ownerTexts(map, `map/${map.id}`, (path) => path === `taxonomy.${kind}.${index}.${field}`);
  };
  const commonMapTexts = (map) => ownerTexts(map, `map/${map.id}`, (path) => ['title', 'scope'].includes(path));
  add('concepts/'); add('search/'); add('skill-maps/', maps.every((m) => m.localization.owners[`map/${m.id}`].coreTranslated), { mapTexts: maps.flatMap((map) => ownerTexts(map, `map/${map.id}`, (path) => /^(title|summary|audience\.)/.test(path))) });
  add('about/');
  add('primitives/', zh.layers.every((r) => r.units.label.status === 'reviewed'), { coverage: sumCoverage(zh.layers) });
  add('speaking-card/', zh.speakingCards.every((r) => r.coreTranslated), { guides: zh.speakingCards });
  for (const kind of ['concepts', 'primitives']) {
    const english = new Map(en[kind].map((r) => [r.id, r]));
    for (const record of zh[kind]) add(`${kind}/${record.id}/`, record.coreTranslated, { kind, records: { en: english.get(record.id), 'zh-CN': record }, coverage: record.coverage });
  }
  for (const record of zh.categories) add(`categories/${record.id}/`, record.coreTranslated, { coverage: record.coverage });
  for (const map of maps) {
    const ready = map.localization.owners[`map/${map.id}`].coreTranslated;
    const tasks = [...commonMapTexts(map), ...ownerTexts(map, `map/${map.id}`, (path) => path === 'summary')];
    for (const j of map.data.journeys.filter((j) => j.status === 'active')) tasks.push(...ownerTexts(map, `journey/${j.id}`, (path) => /^(title|summary|outputs\.)/.test(path)));
    for (const item of map.data.taxonomy.layers.length ? map.data.taxonomy.layers : map.data.taxonomy.types) tasks.push(...taxonomyText(map, map.data.taxonomy.layers.length ? 'layers' : 'types', item.id, 'label'));
    add(`skill-maps/${map.id}/`, ready, { mapTexts: tasks });
    const directory = [...commonMapTexts(map), ...map.data.nodes.flatMap((n) => ownerTexts(map, `node/${n.id}`, (path) => ['title', 'summary'].includes(path)))];
    for (const kind of ['types', 'clusters']) for (const item of map.data.taxonomy[kind]) directory.push(...taxonomyText(map, kind, item.id, 'label'));
    add(`skill-maps/${map.id}/nodes/`, ready, { mapTexts: directory });
    const overview = skillMapOverview(map.data), structure = [...commonMapTexts(map)];
    for (const group of [...overview.groups, ...overview.clusters.map((c) => ({ ...c, kind: 'clusters' }))]) {
      if (group.kind) for (const field of ['label', 'description']) structure.push(...taxonomyText(map, group.kind, group.id, field));
      for (const n of group.examples) structure.push(...ownerTexts(map, `node/${n.id}`, (path) => path === 'title'));
    }
    for (const { type, edge, from, to } of overview.relationships) {
      for (const field of ['outgoing_label', 'description']) structure.push(...taxonomyText(map, 'relation_types', type.id, field));
      if (edge.note) structure.push(...ownerTexts(map, `relation/${JSON.stringify([edge.from, edge.type, edge.to])}`));
      for (const n of [from, to]) structure.push(...ownerTexts(map, `node/${n.id}`, (path) => path === 'title'));
    }
    add(`skill-maps/${map.id}/overview/`, ready, { mapTexts: structure });
    for (const kind of ['nodes', 'journeys']) for (const item of map.data[kind]) {
      const owner = `${kind === 'nodes' ? 'node' : 'journey'}/${item.id}`;
      const texts = [...commonMapTexts(map), ...ownerTexts(map, owner, (path) => !path.startsWith('tags.'))];
      if (kind === 'nodes') {
        texts.push(...taxonomyText(map, 'types', item.type, 'label'));
        for (const edge of map.data.relations.filter((e) => e.from === item.id || e.to === item.id)) {
          if (edge.note) texts.push(...ownerTexts(map, `relation/${JSON.stringify([edge.from, edge.type, edge.to])}`));
          texts.push(...taxonomyText(map, 'relation_types', edge.type, edge.from === item.id ? 'outgoing_label' : 'incoming_label'));
        }
      }
      add(`skill-maps/${map.id}/${kind}/${item.id}/`, ready && map.localization.owners[owner].coreTranslated, { mapTexts: texts });
    }
  }
  for (const card of catalog.speakingCards) {
    const id = `card-${String(card.data.number).padStart(2, '0')}`;
    pages.push({ path: `share/speaking-card/${id}/`, root: 'speaking-card/', locale: 'en', share: true, card: card.data, image: `brand/social/${id}-landscape.png` });
  }
  return { pages, coverage: {
    collections: Object.fromEntries(['concepts', 'primitives', 'categories', 'layers', 'speakingCards'].map((kind) => [kind, {
      records: zh[kind].length, coreTranslated: zh[kind].filter((r) => r.coreTranslated).length, ...sumCoverage(zh[kind]),
      entries: zh[kind].map((r) => ({ id: r.id, coreTranslated: r.coreTranslated, ...r.coverage, units: Object.fromEntries(Object.entries(r.units).map(([path, u]) => [path, { status: u.status, actualLang: u.actualLang, sourceFingerprint: u.sourceFingerprint }])) })),
    }])),
    skillMaps: maps.map((map) => ({ id: map.id, translationOverlay: 'shared-prose-resolver', coverage: sumCoverage(Object.values(map.localization.owners)),
      annotations: [{ id: map.id, kind: 'map', languages: map.data.text_languages ?? {} }, ...['nodes', 'journeys'].flatMap((kind) => map.data[kind].map((r) => ({ id: r.id, kind, languages: r.text_languages ?? {} })))],
    })),
  } };
}

export function inspectHtml(source, expected, target) {
  const document = parse(source), metadata = {}, canonicals = [], alternates = [], resources = [], definitions = [], summaries = [], coverages = [], languageTexts = [];
  let htmlLang;
  walk(document, (node, a, lang) => {
    if (node.tagName === 'html') htmlLang = a.lang;
    if (node.tagName === 'meta') (metadata[a.property ?? a.name] ??= []).push(a.content ?? '');
    if (node.tagName === 'link' && a.rel === 'canonical') canonicals.push(a.href);
    if (node.tagName === 'link' && a.rel === 'alternate' && a.hreflang) alternates.push({ lang: a.hreflang, url: a.href });
    if (node.tagName === 'link' && /^(stylesheet|icon|preload|modulepreload)$/.test(a.rel)) resources.push(a.href);
    if (['img', 'script', 'source'].includes(node.tagName) && a.src) resources.push(a.src);
    if (a.srcset) resources.push(...a.srcset.split(',').map((part) => part.trim().split(/\s+/)[0]));
    if (a.style) resources.push(...cssResources(a.style));
    if (node.tagName === 'style') resources.push(...cssResources(text(node)));
    if ('data-definition-body' in a) definitions.push(localizedText(node, lang));
    if ((a.class ?? '').split(' ').includes('concept-deck')) summaries.push(localizedText(node, lang));
    if ('data-translation-coverage' in a) coverages.push(Object.fromEntries(['translated', 'total', 'missing', 'draft', 'stale'].map((key) => [key, Number(a[`data-${key}`])])));
    if (['p', 'span', 'li', 'div', 'h1', 'h2', 'h3', 'a', 'strong', 'option'].includes(node.tagName)) languageTexts.push(localizedText(node, lang));
  });
  const failures = [], risks = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  const url = (path) => new URL(path, target).href;
  const canonical = url(expected.share ? expected.root : `${expected.locale === 'zh-CN' && expected.eligible ? 'zh-cn/' : ''}${expected.root}`);
  check(htmlLang === expected.locale, `html lang: expected ${expected.locale}, received ${htmlLang}`);
  check(canonicals.length === 1 && canonicals[0] === canonical, `canonical: expected ${canonical}, received ${canonicals}`);
  const noindex = (metadata.robots ?? []).some((r) => r.toLowerCase().split(/[\s,]+/).includes('noindex'));
  check(noindex === Boolean(expected.share || (expected.locale === 'zh-CN' && !expected.eligible)), 'robots eligibility differs from expected publication policy');
  if (!expected.share) {
    const wanted = [{ lang: 'en', url: url(expected.root) }, { lang: 'x-default', url: url(expected.root) }];
    if (expected.eligible) wanted.push({ lang: 'zh-CN', url: url(`zh-cn/${expected.root}`) });
    const signature = (items) => items.map((a) => `${a.lang}:${a.url}`).sort().join('\n');
    check(signature(alternates) === signature(wanted), 'hreflang targets differ from resolver eligibility');
  }
  if (expected.locale === 'zh-CN' && expected.coverage) check(coverages.length === 1 && Object.keys(expected.coverage).every((key) => coverages[0][key] === expected.coverage[key]), 'translation coverage counters differ from resolver');
  const record = expected.records?.[expected.locale];
  if (record) {
    check(summaries.length === 1 && summaries[0].text === normal(record.data.summary) && summaries[0].lang === record.units.summary.actualLang, 'summary text/language differs from resolver');
    const wanted = expected.kind === 'concepts' ? [{ text: record.data.definition, textLang: record.units.definition.actualLang }] : record.definitions;
    check(definitions.length === wanted.length && wanted.every((d, i) => definitions[i]?.text === normal(d.text) && definitions[i]?.lang === d.textLang), 'definition text/language differs from resolver');
    for (const [path, unit] of Object.entries(record.units)) {
      if (path.startsWith('definitions.')) continue; // Inline definition names include punctuation; bodies are compared above.
      for (const value of [unit.text].flat()) check(languageTexts.some((item) => item.lang === unit.actualLang && item.text === normal(value)), `missing localized text/language for ${path}`);
    }
  }
  if (expected.locale === 'zh-CN' && expected.mapTexts) for (const unit of expected.mapTexts) check(languageTexts.some((item) => item.lang === unit.actualLang && (item.text === normal(unit.text) || item.text === `— ${normal(unit.text)}`)), `map ${unit.owner} text/language differs from resolver`);
  if (expected.locale === 'zh-CN' && expected.guides) for (const guide of expected.guides) {
    for (const [path, unit] of Object.entries(guide.units)) {
      if (path === 'title') continue; // Resource icon contributes accessible text to the heading.
      for (const value of [unit.text].flat()) check(languageTexts.some((item) => item.text === normal(value) && item.lang === unit.actualLang), `guide ${guide.id}/${path} text/language differs from resolver`);
    }
  }
  const image = url(expected.image ?? 'brand/social/default.png');
  for (const key of ['og:image', 'twitter:image']) check(metadata[key]?.length === 1 && metadata[key][0] === image, `${key}: expected absolute image ${image}`);
  resources.push(...(metadata['og:image'] ?? []), ...(metadata['twitter:image'] ?? []));
  check(metadata['og:url']?.length === 1 && metadata['og:url'][0] === (expected.share ? url(expected.path) : canonical), 'og:url does not match the publication contract');
  check(metadata['og:image:width']?.[0] === '1200' && metadata['og:image:height']?.[0] === '630', 'missing social image dimensions');
  check(metadata['twitter:card']?.[0] === 'summary_large_image', 'missing large Twitter card');
  check(Boolean(metadata['og:title']?.[0] && metadata['og:description']?.[0]), 'missing social title/description');
  if (expected.share) {
    check(metadata['og:title']?.[0] === `${expected.card.title} | AI Native Lexicon` && metadata['og:description']?.[0] === expected.card.coreIdea, 'single-card social content differs from canonical guide');
    risks.push('share canonical targets guide while og:url identifies the card; platform behavior unverified');
  }
  const description = metadata['og:description']?.[0] ?? '';
  if (expected.locale === 'en' && /\p{Script=Han}/u.test(description) || expected.locale === 'zh-CN' && description && !/\p{Script=Han}/u.test(description)) risks.push('social description language differs from route locale (heuristic; editorial review required)');
  return { failures, risks, resources, metadata, canonical: canonicals, coverage: coverages };
}

export function cssResources(source) {
  return [...source.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/g)].map((m) => m[1] ?? m[2] ?? m[3]);
}
export function inTarget(href, target) {
  const u = new URL(href), root = new URL(target);
  return ['http:', 'https:'].includes(u.protocol) && u.origin === root.origin && u.pathname.startsWith(root.pathname);
}
function mimeFor(url) {
  const path = new URL(url).pathname;
  if (path.endsWith('.css')) return /text\/css/i;
  if (/\.m?js$/.test(path)) return /(?:java|ecma)script/i;
  if (/\.png$/.test(path)) return /^image\/png/i;
  if (/\.webp$/.test(path)) return /^image\/webp/i;
  if (/\.svg$/.test(path)) return /^image\/svg\+xml/i;
  if (/\.woff2?$/.test(path)) return /font|woff|octet-stream/i;
  return /^(?!text\/html).+/i;
}
async function pool(items, concurrency, run) {
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(items.length, concurrency) }, async () => { while (index < items.length) await run(items[index++]); }));
}

export async function verifyOnline({ target, inventory, concurrency = 4, timeout = 15000, maxAssets = 1000, fetchImpl = fetch, onProgress = () => {} }) {
  const root = new URL(target);
  assert.ok(['http:', 'https:'].includes(root.protocol) && !root.username && !root.password && !root.search && !root.hash, 'Target must be a plain HTTP(S) base URL');
  if (!root.pathname.endsWith('/')) root.pathname += '/';
  target = root.href;
  assert.ok(Number.isInteger(concurrency) && concurrency >= 1 && concurrency <= 8);
  const report = { target, startedAt: new Date().toISOString(), automatedStatus: 'running', overallAcceptance: 'pending-human-verification', pages: [], assets: [], failures: [], risks: ['Fixed social image URLs may retain platform caches; HTTP success does not prove refresh.'], coverage: inventory.coverage, browser: { status: 'unverified' }, manual: manualChecks.map((id) => ({ id, status: 'unverified' })) };
  const candidates = new Set();
  const addAsset = (value, parent) => {
    if (!value || /^(data:|blob:|#)/.test(value)) return;
    try {
      const url = new URL(value, parent); url.hash = '';
      if (url.origin !== root.origin) { report.risks.push(`External asset not fetched: ${url.href}`); return; }
      if (!inTarget(url.href, target)) { report.failures.push({ url: url.href, message: 'asset outside deployment base', parent }); return; }
      if (candidates.size >= maxAssets && !candidates.has(url.href)) { report.failures.push({ url: url.href, message: 'asset traversal limit exceeded' }); return; }
      candidates.add(url.href);
    } catch { report.failures.push({ url: parent, message: `invalid asset URL: ${value}` }); }
  };
  const request = async (url, html = false) => {
    const result = { url, checkedAt: new Date().toISOString(), redirects: [] };
    try {
      let current = url, response;
      assert.ok(inTarget(current, target), `URL outside target: ${current}`);
      for (let hop = 0; hop <= 5; hop++) {
        response = await fetchImpl(current, { redirect: 'manual', signal: AbortSignal.timeout(timeout) });
        result.status = response.status; result.finalUrl = current;
        result.headers = Object.fromEntries(['content-type', 'cache-control', 'etag', 'last-modified', 'age'].map((name) => [name, response.headers.get(name)]));
        if (![301, 302, 303, 307, 308].includes(response.status)) break;
        const location = response.headers.get('location');
        assert.ok(location, 'Redirect has no Location');
        const next = new URL(location, current).href;
        result.redirects.push({ from: current, to: next, status: response.status });
        await response.body?.cancel();
        assert.ok(inTarget(next, target), `Redirect outside target: ${next}`);
        assert.ok(hop < 5, 'Too many redirects'); current = next;
      }
      assert.equal(response.status, 200, `HTTP ${response.status}`);
      const type = response.headers.get('content-type') ?? '';
      assert.ok((html ? /text\/html/i : mimeFor(url)).test(type), `Unexpected MIME ${type}`);
      const bytes = new Uint8Array(await response.arrayBuffer()); result.bytes = bytes.length;
      assert.ok(bytes.length, 'Empty response');
      const source = new TextDecoder().decode(bytes);
      if (!html) assert.ok(!/^\s*(<!doctype html|<html)/i.test(source), 'HTML body masquerades as asset');
      if (new URL(url).pathname.endsWith('.png')) {
        assert.deepEqual([...bytes.slice(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], 'Invalid PNG signature');
        const view = new DataView(bytes.buffer); result.dimensions = [view.getUint32(16), view.getUint32(20)];
        if (/\/brand\/social\/(default|.*-landscape)\.png$/.test(new URL(url).pathname)) assert.deepEqual(result.dimensions, [1200, 630], 'Wrong social image dimensions');
      }
      result.passed = true; return { result, source };
    } catch (error) { result.passed = false; result.error = error.message; report.failures.push({ url, message: error.message }); return { result }; }
  };
  await pool(inventory.pages, concurrency, async (expected) => {
    const url = new URL(expected.path, target).href;
    const { result, source } = await request(url, true);
    if (source !== undefined) {
      const observed = inspectHtml(source, expected, target);
      Object.assign(result, { metadata: observed.metadata, coverage: observed.coverage, failures: observed.failures, risks: observed.risks });
      result.passed = observed.failures.length === 0;
      report.failures.push(...observed.failures.map((message) => ({ url, message })));
      for (const value of observed.resources) addAsset(value, result.finalUrl);
    }
    report.pages.push(result); onProgress(report.pages.length, inventory.pages.length);
  });
  const checked = new Set();
  while ([...candidates].some((url) => !checked.has(url))) {
    await pool([...candidates].filter((url) => !checked.has(url)), concurrency, async (url) => {
      checked.add(url); const { result, source } = await request(url);
      report.assets.push(result);
      if (source !== undefined && /text\/css/i.test(result.headers['content-type'] ?? '')) for (const value of cssResources(source)) addAsset(value, result.finalUrl);
    });
  }
  report.pages.sort((a, b) => a.url.localeCompare(b.url)); report.assets.sort((a, b) => a.url.localeCompare(b.url));
  report.risks = [...new Set(report.risks)];
  report.finishedAt = new Date().toISOString(); report.automatedStatus = report.failures.length ? 'failed' : 'passed';
  return report;
}

export function markdownReport(report) {
  const pageRisks = new Map();
  for (const page of report.pages) for (const risk of page.risks ?? []) {
    if (!pageRisks.has(risk)) pageRisks.set(risk, new Set());
    pageRisks.get(risk).add(page.url);
  }
  const riskSummary = [...pageRisks].map(([risk, urls]) =>
    `### ${risk}\n\nAffected pages: ${urls.size}\n\n${[...urls].sort().map((url) => `- ${url}`).join('\n')}`
  ).join('\n\n') || 'None observed in the checked pages.';
  return `# Online verification\n\nTarget: ${report.target}\n\nSource: ${report.source?.commit ?? 'unknown'}; dirty: ${report.source?.dirty ?? 'unknown'}. Deployed revision is not proven by source checkout.\n\nHTTP/HTML: **${report.automatedStatus}**; browser smoke: **${report.browser.status}**; overall acceptance: **${report.overallAcceptance}**.\n\nPages: ${report.pages.length}; discovered assets: ${report.assets.length}; failures: ${report.failures.length}.\n\n## Translation inventory\n\n| Collection | Records | Core translated | Reviewed/current units | Missing | Draft | Stale |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: |\n${Object.entries(report.coverage?.collections ?? {}).map(([kind, c]) => `| ${kind} | ${c.records} | ${c.coreTranslated} | ${c.translated}/${c.total} | ${c.missing} | ${c.draft} | ${c.stale} |`).join('\n')}\n\nSkill Maps use shared English canonical and retained Chinese prose projections; per-map coverage and annotations are in report.json.\n\n## Failures\n\n${report.failures.map((f) => `- ${f.url}: ${f.message}`).join('\n') || 'None in the stated automated scope.'}\n\n## Page risks\n\n${riskSummary}\n\n## Manual acceptance\n\n${report.manual.map((m) => `- ${m.id}: ${m.status}`).join('\n')}\n\nSee the manual checklist. No automated result proves a screen-reader session, actual 400% browser zoom or social platform cache refresh.\n\n## Limits\n\n${report.risks.map((r) => `- ${r}`).join('\n')}\n- Page risks above are observations, not failed checks or completed platform acceptance; raw metadata remains in report.json.\n- CSS URL references and observed HTML assets are checked; this is not an exhaustive JavaScript dependency crawler.\n- JSON includes timestamps, headers, redirects and per-record coverage.\n`;
}

async function main() {
  const args = process.argv.slice(2), target = args[0];
  assert.ok(target && !target.startsWith('--'), 'Usage: npm run verify:online -- https://host/base/ [--browser]');
  assert.ok(args.slice(1).every((arg) => arg === '--browser'), 'Unknown option');
  const output = resolve(process.env.ONLINE_EVIDENCE ?? 'work/online-verification');
  await mkdir(output, { recursive: true });
  const source = { commit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), dirty: Boolean(execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim()) };
  let report;
  try {
    const inventory = createInventory(await readCatalog());
    report = await verifyOnline({ target, inventory, onProgress: (done, total) => { if (done % 25 === 0 || done === total) console.log(`HTTP pages ${done}/${total}`); } });
    report.source = source;
    if (args.includes('--browser')) {
      const { browserSmoke } = await import('./verify-online-browser.mjs');
      report.browser = await browserSmoke({ target: report.target, output });
    }
  } catch (error) {
    report ??= { target, source, automatedStatus: 'failed', overallAcceptance: 'pending-human-verification', pages: [], assets: [], coverage: {}, failures: [], risks: [], browser: { status: 'unverified' }, manual: manualChecks.map((id) => ({ id, status: 'unverified' })) };
    report.failures.push({ url: target, message: error.stack }); report.automatedStatus = 'failed';
  } finally {
    await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    await writeFile(join(output, 'report.md'), markdownReport(report));
    console.log(`Evidence: ${output}; HTTP ${report.automatedStatus}; browser ${report.browser.status}; manual acceptance pending`);
  }
  if (report.automatedStatus !== 'passed' || args.includes('--browser') && report.browser.status !== 'passed') process.exitCode = 1;
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) await main();
