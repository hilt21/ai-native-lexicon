import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { stringify } from 'yaml';
import { readCatalog, validateCatalog } from '../src/domain/content/catalog.mjs';
import { resolveCatalog } from '../src/domain/content/localize-catalog.mjs';
import { translationUnits } from '../src/domain/content/translation-units.mjs';
import { resolveSkillMaps, skillMapTranslationInputSchema, validateSkillMapTranslations, readSkillMapTranslations } from '../src/domain/content/skill-map-translations.mjs';
import { normalizeSkillMaps } from '../src/domain/content/skill-map-export.mjs';
const catalog = await readCatalog();
const maps = catalog.skillMaps.filter((m) => ['pstack', 'mattpocock'].includes(m.id));
const overlays = catalog.skillMapTranslations.filter((o) => maps.some((m) => m.id === o.data.map_id));

test('published English and retained Chinese maps cover every current prose owner without canonical mutation', () => {
  assert.deepEqual(validateCatalog(catalog).errors, []);
  const before = structuredClone(maps);
  const en = resolveSkillMaps(maps, overlays, 'en'), zh = resolveSkillMaps(maps, overlays, 'zh-CN');
  assert.equal(en.length, 2);
  for (const map of en) assert.ok(!/\p{Script=Han}/u.test(JSON.stringify(map.data)));
  let count = 0;
  for (const map of zh) for (const state of Object.values(map.localization.owners)) {
    assert.equal(state.coverage.translated, state.coverage.total);
    assert.equal(state.coreTranslated, true);
    count += state.coverage.total;
  }
  assert.equal(count, 1988);
  assert.deepEqual(maps, before);
  for (const map of zh) {
    const canonical = maps.find((m) => m.id === map.id);
    assert.deepEqual(map.data.sources, canonical.data.sources);
    assert.deepEqual(map.data.nodes.map((n) => n.id), canonical.data.nodes.map((n) => n.id));
    assert.deepEqual(map.data.relations.map(({ from, type, to }) => [from, type, to]), canonical.data.relations.map(({ from, type, to }) => [from, type, to]));
    for (const node of map.data.nodes) assert.equal(node.official_description, canonical.data.nodes.find((n) => n.id === node.id).official_description);
  }
});

test('draft and stale map prose uses current English with its actual language', () => {
  const map = maps[0], owner = overlays.find((o) => o.data.map_id === map.id && o.data.kind === 'map');
  for (const mode of ['draft', 'stale']) {
    const changed = structuredClone(overlays);
    const copy = changed.find((o) => o.id === owner.id);
    const u = copy.data.units.find((u) => u.path === 'summary');
    if (mode === 'draft') u.review_status = 'draft'; else u.source_fingerprint = `sha256:${'0'.repeat(64)}`;
    const result = resolveSkillMaps(maps, changed, 'zh-CN')[0];
    assert.equal(result.data.summary, map.data.summary);
    assert.equal(result.data.text_languages.summary, 'en');
    const state = result.localization.owners[`map/${map.id}`];
    assert.equal(state.units.summary.status, mode);
    assert.equal(state.coreTranslated, false);
  }
});

test('journey step reorder invalidates indexed prose rather than attaching translations to different nodes', () => {
  const changed = structuredClone(maps), map = changed.find((m) => m.data.journeys.some((j) => j.variants[0].steps.length > 1));
  const journey = map.data.journeys.find((j) => j.variants[0].steps.length > 1);
  journey.variants[0].steps.reverse();
  const zh = resolveSkillMaps(changed, overlays, 'zh-CN').find((m) => m.id === map.id);
  const state = zh.localization.owners[`journey/${journey.id}`];
  assert.ok(state.coverage.stale > 0);
  assert.equal(state.coverage.stale + state.coverage.missing, state.coverage.total);
  assert.deepEqual(zh.data.journeys.find((j) => j.id === journey.id).variants, journey.variants);
});

test('map overlay rejects identity/topology/source overrides, unknown owners/paths and duplicate owners', () => {
  const sample = structuredClone(overlays[0].data);
  for (const key of ['nodes', 'sources', 'taxonomy']) assert.equal(skillMapTranslationInputSchema.safeParse({ ...sample, [key]: [] }).success, false);
  assert.equal(skillMapTranslationInputSchema.safeParse({ ...sample, units: [...sample.units, sample.units[0]] }).success, false);
  for (const path of ['id', 'nodes.0.id', 'variants.0.steps.0.nodes.0', 'source_refs.0.source']) {
    const changed = structuredClone(overlays); changed[0].data.units[0].path = path;
    assert.match(validateSkillMapTranslations(changed, maps).join('\n'), /unsupported prose path/);
  }
  const changed = structuredClone(overlays); changed[0].data.target_id = 'unknown';
  assert.match(validateSkillMapTranslations(changed, maps).join('\n'), /unknown translation owner/);
  assert.match(validateSkillMapTranslations([...overlays, overlays[0]], maps).join('\n'), /duplicate translation owner/);
});

test('Chinese-only edits do not affect canonical machine normalization', () => {
  const baseline = normalizeSkillMaps(maps.map(({ id, data }) => ({ id, ...data })));
  const changed = structuredClone(overlays); changed[0].data.units[0].translation += '（展示修改）';
  resolveSkillMaps(maps, changed, 'zh-CN');
  assert.deepEqual(normalizeSkillMaps(maps.map(({ id, data }) => ({ id, ...data }))), baseline);
});

test('filesystem reader rejects duplicate scoped owners and duplicate YAML keys', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'map-translations-'));
  try {
    await writeFile(join(dir, 'one.yaml'), stringify(overlays[0].data));
    await writeFile(join(dir, 'two.yaml'), stringify(overlays[0].data));
    assert.match((await readSkillMapTranslations(dir)).errors.join('\n'), /duplicate translation identity/);
    await writeFile(join(dir, 'two.yaml'), 'schema_version: 1.0.0\nschema_version: 1.0.0\n');
    assert.match((await readSkillMapTranslations(dir)).errors.join('\n'), /cannot read or parse YAML/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('guide vector mutation falls back and preserves canonical identities/references', () => {
  const first = catalog.speakingCards.find((r) => r.data.number === 1);
  const input = { speakingCards: [structuredClone(first)] };
  const overlays = [{ schema_version: '1.0.0', locale: 'zh-CN', kind: 'speaking-guide', target_id: 'card-01', units: translationUnits('speaking-guide', 'card-01', first.data).map((d) => ({ path: d.path, translation: Array.isArray(d.source) ? d.source.map((_v, i) => `译文 ${i}`) : '已审查译文', source_fingerprint: d.sourceFingerprint, review_status: 'reviewed', reviewed_at: '2026-10-13' })) }];
  const current = resolveCatalog(input, overlays, 'zh-CN').speakingCards[0];
  assert.equal(current.coverage.translated, current.coverage.total);
  assert.deepEqual(current.data.concepts, first.data.concepts);
  assert.equal(current.data.number, first.data.number);
  input.speakingCards[0].data.keyLines.reverse();
  const guide = resolveCatalog(input, overlays, 'zh-CN').speakingCards[0];
  assert.equal(guide.units.keyLines.status, 'stale');
  assert.deepEqual(guide.data.keyLines, [...first.data.keyLines].reverse());
});
