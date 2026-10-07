import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { fixture, mapInput, nodeInput } from './skill-map-fixture.mjs';
import { readSkillMaps } from '../src/domain/content/read-skill-maps.mjs';
import { skillMapInputSchema, skillMapNodeInputSchema, skillMapJourneyInputSchema } from '../src/domain/content/skill-map-input.mjs';
import { normalizeSkillMaps } from '../src/domain/content/skill-map-export.mjs';
import { createDatasetVersion } from '../src/lib/dataset-version.mjs';

const journey = { title: 'Work', summary: 'Guidance.', when_to_use: ['Do work.'], outputs: ['Result.'], variants: [{ id: 'standard', title: 'Standard', steps: [{ title: 'Read', why: 'Understand.', nodes: ['explain'], outputs: ['Context.'] }] }] };
test('language dictionaries agree between portable and runtime contracts', async () => {
  const ajv = new Ajv({ strict: false }); addFormats(ajv);
  for (const [name, schema, record] of [['skill-map', skillMapInputSchema, { ...mapInput, schema_version: '1.1.0' }], ['skill-map-node', skillMapNodeInputSchema, nodeInput], ['skill-map-journey', skillMapJourneyInputSchema, journey]]) {
    const portable = ajv.compile(JSON.parse(await readFile(new URL(`../schemas/${name}.schema.json`, import.meta.url), 'utf8')));
    for (const [metadata, accepted] of [[{}, true], [{ summary: 'zh-Hans' }, true], [{ summary: 'en-US' }, true], [{ summary: 'pt-BR' }, true], [{ summary: 'eng-Latn-419' }, true], [{ summary: 'EN' }, false], [{ summary: 'zh_hans' }, false], [{ summary: 'zh-hans' }, false], [{ summary: '' }, false], [{ summary: 'en\n' }, false], [{ summary: 'en\r\n' }, false], [{ 'summary\n': 'en' }, false], [{ '*': 'en' }, false], [{ '../summary': 'en' }, false], [[], false], ['en', false]]) {
      const value = { ...record, text_languages: metadata };
      assert.equal(schema.safeParse(value).success, accepted, `${name}: ${JSON.stringify(metadata)}`);
      assert.equal(portable(value), accepted, `${name}: ${JSON.stringify(portable.errors)}`);
    }
  }
  assert.equal(skillMapInputSchema.safeParse({ ...mapInput, text_languages: {} }).success, false);
});

test('shared reader rejects invalid prose targets and edition mixtures with record/path diagnostics', async (t) => {
  for (const path of ['type', 'source_refs.0.path', 'when_to_use.9', 'missing', 'mechanism.0', 'text_languages.summary']) {
    const result = await readSkillMaps(await fixture(t, { example: { map: { ...mapInput, schema_version: '1.1.0' }, nodes: { explain: { ...nodeInput, text_languages: { [path]: 'en' } } } } }));
    assert.match(result.errors.join('\n'), /example\/nodes\/explain.yaml/);
    assert.ok(result.errors.some((error) => error.includes(path)), path);
  }
  const old = await readSkillMaps(await fixture(t, { example: { map: mapInput, nodes: { explain: { ...nodeInput, text_languages: { summary: 'en' } } } } }));
  assert.match(old.errors.join('\n'), /1\.1\.0/);
  const mixed = await readSkillMaps(await fixture(t, { example: { map: { ...mapInput, schema_version: '1.1.0', text_languages: { 'taxonomy.types.0.label': 'en' } }, nodes: { explain: { ...nodeInput, text_languages: { summary: 'zh-Hans' } } }, journeys: { work: { ...journey, text_languages: { 'variants.0.steps.0.why': 'en', 'variants.0.steps.0.outputs.0': 'en' } } } } }));
  assert.deepEqual(mixed.errors, []);
});

test('export preserves optional metadata and normalizes its keys without losing digest semantics', async (t) => {
  const { records, errors } = await readSkillMaps(await fixture(t)); assert.deepEqual(errors, []);
  const original = records.map(({ id, data }) => ({ id, ...data }));
  assert.equal(Object.hasOwn(normalizeSkillMaps(original)[0], 'text_languages'), false);
  const maps = structuredClone(original); maps[0].schema_version = '1.1.0'; maps[0].text_languages = { summary: 'en', scope: 'en' };
  assert.deepEqual(Object.keys(normalizeSkillMaps(maps)[0].text_languages), ['scope', 'summary']);
  const version = (skill_maps) => createDatasetVersion({ concepts: [], primitives: [], speaking_cards: [], skill_maps, taxonomy: { categories: [], layers: [] } });
  const reordered = structuredClone(maps); reordered[0].text_languages = { scope: 'en', summary: 'en' };
  assert.equal(version(maps), version(reordered)); reordered[0].text_languages.summary = 'zh-Hans'; assert.notEqual(version(maps), version(reordered));
});

test('unordered tag normalization moves annotations with their strings and preserves paired digest', async (t) => {
  const { records } = await readSkillMaps(await fixture(t));
  const maps = records.map(({ id, data }) => ({ id, ...data, schema_version: '1.1.0' }));
  maps[0].nodes[0].tags = ['中文', 'Alpha'];
  maps[0].nodes[0].text_languages = { 'tags.0': 'zh-Hans', 'tags.1': 'en' };
  const normalized = normalizeSkillMaps(maps)[0].nodes[0];
  assert.deepEqual(normalized.tags, ['Alpha', '中文']);
  assert.deepEqual(normalized.text_languages, { 'tags.0': 'en', 'tags.1': 'zh-Hans' });
  const reordered = structuredClone(maps); reordered[0].nodes[0].tags.reverse(); reordered[0].nodes[0].text_languages = { 'tags.0': 'en', 'tags.1': 'zh-Hans' };
  const digest = (skill_maps) => createDatasetVersion({ concepts: [], primitives: [], speaking_cards: [], skill_maps, taxonomy: { categories: [], layers: [] } });
  assert.equal(digest(maps), digest(reordered));
});
