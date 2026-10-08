import assert from 'node:assert/strict';
import test from 'node:test';
import { cp, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { stringify } from 'yaml';
import { readCatalog, validateCatalog } from '../src/domain/content/catalog.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'lexicon-translations-'));
  t.after(() => rm(root, {recursive:true, force:true}));
  await cp(new URL('../src/data/', import.meta.url), root, {recursive:true});
  await rm(join(root,'translations'), {recursive:true, force:true});
  return root;
}

test('catalog discovers independent translation assets and rejects dangling targets', async (t) => {
  const root = await fixture(t);
  const absent = await readCatalog(root);
  assert.deepEqual(absent.translations, []);
  await mkdir(join(root, 'translations'));
  await writeFile(join(root,'translations/zh-context.yaml'), stringify({schema_version:'1.0.0',locale:'zh-CN',kind:'concept',target_id:'unknown-concept',units:[]}));
  assert.match(validateCatalog(await readCatalog(root)).errors.join('\n'), /translation.*target.*unknown-concept/);
});

test('reviewed current units localize immutable records and referenced definitions', async () => {
  const { translationUnits } = await import('../src/domain/content/translation-units.mjs');
  const { resolveCatalog } = await import('../src/domain/content/localize-catalog.mjs');
  const catalog = await readCatalog();
  const before = structuredClone(catalog);
  const concept = catalog.concepts.find(({slug}) => slug === 'context');
  const units = translationUnits('concept', 'context', concept.data);
  const overlays = [{schema_version:'1.0.0',locale:'zh-CN',kind:'concept',target_id:'context',units:
    ['summary','definition'].map((path) => ({path,translation:path === 'summary' ? '上下文摘要' : '当前上下文定义',source_fingerprint:units.find((unit) => unit.path === path).sourceFingerprint,review_status:'reviewed',reviewed_at:'2026-10-08'}))}];
  const result = resolveCatalog(catalog, overlays, 'zh-CN');
  const localized = result.concepts.find(({id}) => id === 'context');
  assert.equal(localized.data.definition, '当前上下文定义');
  assert.equal(localized.coreTranslated, true);
  assert.equal(localized.units.definition.actualLang, 'zh-CN');
  assert.equal(localized.units.why_it_matters.actualLang, 'en');
  const primitive = result.primitives.find(({id}) => id === 'context');
  assert.equal(primitive.definitions[0].text, '当前上下文定义');
  assert.equal(primitive.definitions[0].textLang, 'zh-CN');
  assert.deepEqual(primitive.data.definitions[0], {concept:'context'});
  assert.deepEqual(catalog, before);
  assert.equal(resolveCatalog(catalog, overlays,'en').concepts.find(({id})=>id==='context').data.definition, concept.data.definition);
});

async function writeOverlay(root, overlay, filename = 'context.yaml') {
  await mkdir(join(root,'translations'),{recursive:true});
  await writeFile(join(root,'translations',filename), stringify(overlay));
}
async function reviewed(catalog, kind, id, path, translation) {
  const { translationUnits } = await import('../src/domain/content/translation-units.mjs');
  const collections = {concept:'concepts',primitive:'primitives',category:'categories',layer:'layers'};
  const record = catalog[collections[kind]].find((record) => (record.slug ?? record.anchor ?? record.id) === id);
  const descriptor = translationUnits(kind,id,record.data ?? record).find((unit) => unit.path === path);
  return {schema_version:'1.0.0',locale:'zh-CN',kind,target_id:id,units:[{path,translation,source_fingerprint:descriptor.sourceFingerprint,review_status:'reviewed',reviewed_at:'2026-10-08'}]};
}

test('public catalog rejects identity, review, path and value-shape violations', async (t) => {
  const root = await fixture(t), catalog = await readCatalog(root);
  const baseline = await reviewed(catalog,'concept','context','definition','中文定义');
  const cases = [
    [{...baseline,locale:'fr'},/locale/],
    [{...baseline,kind:'speaking-card'},/kind/],
    [{...baseline,schema_version:'2.0.0'},/schema_version/],
    [{...baseline,unknown:true},/Unrecognized key/],
    [{...baseline,units:[{...baseline.units[0],translation:'   '}]},/non-blank/],
    [{...baseline,units:[{...baseline.units[0],source_fingerprint:'sha256:bad'}]},/fingerprint/],
    [{...baseline,units:[{...baseline.units[0],reviewed_at:'2026-02-30'}]},/reviewed_at/],
    [{...baseline,units:[{...baseline.units[0],reviewed_at:undefined}]},/reviewed_at/],
    [{...baseline,units:[baseline.units[0],baseline.units[0]]},/Duplicate translation unit/],
    [{...baseline,units:[{...baseline.units[0],path:'term'}]},/unknown translation path/],
    [{...baseline,units:[{...baseline.units[0],path:'examples.0.context'}]},/unknown translation path/],
    [{...baseline,units:[{...baseline.units[0],path:'sources.0.title'}]},/unknown translation path/],
    [{...baseline,units:[{...baseline.units[0],translation:['不能替代标量']}]},/scalar/],
    [await reviewed(catalog,'concept','context','examples.context','不能替代数组'),/vector/],
    [await reviewed(catalog,'primitive','context','definitions.name',['禁止填入引用分支']),/vector length/],
  ];
  for (const [overlay, expected] of cases) {
    await writeOverlay(root,overlay);
    assert.match(validateCatalog(await readCatalog(root)).errors.join('\n'), expected, JSON.stringify(overlay));
  }
  await writeOverlay(root,baseline);
  await writeOverlay(root,baseline,'duplicate.yml');
  assert.match(validateCatalog(await readCatalog(root)).errors.join('\n'),/duplicate translation identity/);
});

test('the Astro asset loader shares the catalog verdict and never publishes partial invalid assets', async (t) => {
  const { translationsLoader } = await import('../src/lib/translations-loader.mjs');
  const root = await fixture(t), catalog = await readCatalog(root);
  const overlay = await reviewed(catalog,'concept','context','definition','加载器定义');
  await writeOverlay(root,overlay);
  const records = new Map();
  const context = {store:{clear:()=>records.clear(),set:(record)=>records.set(record.id,record)},parseData:async ({data})=>data,generateDigest:JSON.stringify};
  await translationsLoader(root).load(context);
  assert.equal(records.get('zh-CN/concept/context').data.units[0].translation,'加载器定义');
  await writeOverlay(root,{...overlay,target_id:'missing'});
  const errors = validateCatalog(await readCatalog(root)).errors;
  await assert.rejects(translationsLoader(root).load(context),(error)=> errors.every((diagnostic)=>error.message.includes(diagnostic)));
  assert.equal(records.get('zh-CN/concept/context').data.units[0].translation,'加载器定义');
});

test('portable overlay schema preserves the reviewed-date requirement', async () => {
  const { readFile } = await import('node:fs/promises');
  const { default: Ajv } = await import('ajv/dist/2020.js');
  const { default: addFormats } = await import('ajv-formats');
  const ajv = new Ajv({strict:false}); addFormats(ajv);
  const validate = ajv.compile(JSON.parse(await readFile(new URL('../schemas/translation.schema.json',import.meta.url),'utf8')));
  const baseline = {schema_version:'1.0.0',locale:'zh-CN',kind:'concept',target_id:'context',units:[{path:'definition',translation:'中文',source_fingerprint:'sha256:'+'a'.repeat(64),review_status:'reviewed'}]};
  assert.equal(validate(baseline),false);
  baseline.units[0].reviewed_at = '2026-10-08';
  assert.equal(validate(baseline),true);
  baseline.units[0].reviewed_at = '2026-02-30';
  assert.equal(validate(baseline),false);
});

test('source units survive unrelated metadata and formatting but expire with their English text', async (t) => {
  const { readFile } = await import('node:fs/promises');
  const { parse } = await import('yaml');
  const { resolveCatalog } = await import('../src/domain/content/localize-catalog.mjs');
  const { translationUnits } = await import('../src/domain/content/translation-units.mjs');
  const root = await fixture(t), original = await readCatalog(root);
  const overlay = await reviewed(original,'concept','context','definition','当前的译文');
  await writeOverlay(root,overlay);
  const file = join(root,'concepts/context.yaml'), source = parse(await readFile(file,'utf8'));
  await writeFile(file, '# Formatting and key ordering do not change source units\n'+stringify(Object.fromEntries(Object.entries({...source,added:'2026-10-07',sources:[{title:'Unrelated source title',url:'https://example.com/new'}]}).reverse())));
  let catalog = await readCatalog(root);
  assert.deepEqual(validateCatalog(catalog).errors,[]);
  assert.equal(resolveCatalog(catalog,catalog.translations,'zh-CN').concepts.find(({id})=>id==='context').units.definition.status,'reviewed');
  await writeFile(file,stringify({...source,definition:source.definition+' Changed source sentence.'}));
  catalog = await readCatalog(root);
  let unit = resolveCatalog(catalog,catalog.translations,'zh-CN').concepts.find(({id})=>id==='context').units.definition;
  assert.equal(unit.status,'stale');
  assert.equal(unit.text,source.definition+' Changed source sentence.');
  assert.equal(unit.actualLang,'en');
  const draft = structuredClone(overlay); draft.units[0].review_status='draft';
  unit = resolveCatalog(catalog,[draft],'zh-CN').concepts.find(({id})=>id==='context').units.definition;
  assert.equal(unit.status,'draft');
  assert.equal(unit.fallback,true);
  const primitive = original.primitives.find(({slug})=>slug==='context').data;
  const first = translationUnits('primitive','context',primitive);
  const changed = translationUnits('primitive','context',{...primitive,priority:{...primitive.priority,level:'P2'},ownership:{...primitive.ownership,kind:primitive.ownership.kind==='llm'?'hybrid':'llm'}});
  for (const path of ['priority.scope','priority.rationale','ownership.rationale']) assert.notEqual(first.find((unit)=>unit.path===path).sourceFingerprint,changed.find((unit)=>unit.path===path).sourceFingerprint,path);
  assert.equal(first.find((unit)=>unit.path==='summary').sourceFingerprint,changed.find((unit)=>unit.path==='summary').sourceFingerprint);
});

test('whole-owner example and distinction vectors expire on reorder or deletion without publishing removed text', async (t) => {
  const { readFile } = await import('node:fs/promises');
  const { parse } = await import('yaml');
  const { resolveCatalog } = await import('../src/domain/content/localize-catalog.mjs');
  const root = await fixture(t), file = join(root,'concepts/context.yaml');
  const source = parse(await readFile(file,'utf8'));
  const examples = [{context:'Shared context',example:'First current example'},{context:'Shared context',example:'Second current example'}];
  const distinctions = [{target:'context-window',distinction:'First current distinction'},{target:'context-engineering',distinction:'Second current distinction'}];
  await writeFile(file,stringify({...source,examples,distinguish_from:distinctions}));
  const original = await readCatalog(root);
  const overlay = await reviewed(original,'concept','context','examples.context',['旧情境一','旧情境二']);
  overlay.units.push(...(await reviewed(original,'concept','context','examples.example',['旧示例一','旧示例二'])).units,...(await reviewed(original,'concept','context','distinguish_from.distinction',['旧区别一','旧区别二'])).units);
  await writeOverlay(root,overlay);
  assert.equal(resolveCatalog(original,[overlay],'zh-CN').concepts.find(({id})=>id==='context').data.examples[0].example,'旧示例一');
  for (const next of [
    {examples:[...examples].reverse(),distinguish_from:[...distinctions].reverse()},
    {examples:examples.slice(1),distinguish_from:distinctions.slice(1)},
    {examples:[],distinguish_from:[]},
    {examples:[...examples,{context:'Inserted context',example:'Inserted example'}],distinguish_from:[{...distinctions[0],target:'harness'},distinctions[1]]},
  ]) {
    await writeFile(file,stringify({...source,...next}));
    const catalog = await readCatalog(root);
    assert.deepEqual(validateCatalog(catalog).errors,[]);
    const record = resolveCatalog(catalog,catalog.translations,'zh-CN').concepts.find(({id})=>id==='context');
    assert.deepEqual(record.data.examples,next.examples);
    assert.deepEqual(record.data.distinguish_from,next.distinguish_from);
    for (const path of ['examples.context','examples.example','distinguish_from.distinction']) assert.equal(record.units[path].status,'stale');
    assert.equal(record.coverage.total,next.examples.length ? 8 : 5);
    assert.ok(!JSON.stringify(record.data).includes('旧示例'));
  }
});

test('inline vectors expire across reference branch changes and referenced text follows Concept resolution', async () => {
  const { resolveCatalog } = await import('../src/domain/content/localize-catalog.mjs');
  const catalog = await readCatalog();
  const primitive = catalog.primitives.find(({slug})=>slug==='context');
  const first = {name:'First inline name',text:'First inline definition'};
  const second = {name:'Second inline name',text:'Second inline definition'};
  primitive.data.definitions=[first,second];
  const overlay = await reviewed(catalog,'primitive','context','definitions.name',['旧名称一','旧名称二']);
  overlay.units.push(...(await reviewed(catalog,'primitive','context','definitions.text',['旧定义一','旧定义二'])).units);
  const concept = await reviewed(catalog,'concept','context','definition','引用概念当前定义');
  assert.equal(resolveCatalog(catalog,[overlay,concept],'zh-CN').primitives.find(({id})=>id==='context').definitions[0].text,'旧定义一');
  for (const definitions of [[{concept:'context'},second],[{concept:'context'}],[first],[{concept:'harness'},second],[second,first]]) {
    const changed = structuredClone(catalog); changed.primitives.find(({slug})=>slug==='context').data.definitions=definitions;
    const record = resolveCatalog(changed,[overlay,concept],'zh-CN').primitives.find(({id})=>id==='context');
    assert.equal(record.units['definitions.name'].status,'stale');
    assert.equal(record.units['definitions.text'].status,'stale');
    assert.ok(!JSON.stringify(record.data).includes('旧定义'));
    for (const [index,definition] of definitions.entries()) {
      assert.equal(record.definitions[index].text,'concept' in definition ? (definition.concept==='context'?'引用概念当前定义':changed.concepts.find(({slug})=>slug===definition.concept).data.definition) : definition.text);
      assert.equal(record.definitions[index].textLang,'concept' in definition && definition.concept==='context'?'zh-CN':'en');
    }
  }
  const referenced = structuredClone(catalog); referenced.primitives.find(({slug})=>slug==='context').data.definitions=[{concept:'context'},second];
  const newOverlay = await reviewed(referenced,'primitive','context','definitions.text',['当前内联译文']);
  referenced.primitives.find(({slug})=>slug==='context').data.definitions=[first,second];
  const restored = resolveCatalog(referenced,[newOverlay,concept],'zh-CN').primitives.find(({id})=>id==='context');
  assert.equal(restored.units['definitions.text'].status,'stale');
  assert.equal(restored.definitions[0].text,first.text);
});

test('taxonomy overlays use the caller registry public identities and retain canonical relationship names', async (t) => {
  const { readdir,readFile } = await import('node:fs/promises');
  const { parse } = await import('yaml');
  const { resolveCatalog } = await import('../src/domain/content/localize-catalog.mjs');
  const root = await fixture(t);
  const categoryFile = join(root,'taxonomy/categories',(await readdir(join(root,'taxonomy/categories')))[0]);
  const category = parse(await readFile(categoryFile,'utf8'));
  await writeFile(categoryFile,stringify({...category,slug:'fixture-category'}));
  const layerFile = join(root,'taxonomy/layers',(await readdir(join(root,'taxonomy/layers')))[0]);
  const layer = parse(await readFile(layerFile,'utf8'));
  await writeFile(layerFile,stringify({...layer,anchor:'layer-fixture'}));
  const catalog = await readCatalog(root);
  const overlays = [await reviewed(catalog,'category','fixture-category','label','分类显示标签'),await reviewed(catalog,'layer','layer-fixture','label','层显示标签')];
  await writeOverlay(root,overlays[0]); await writeOverlay(root,overlays[1],'layer.yaml');
  assert.deepEqual(validateCatalog(await readCatalog(root)).errors,[]);
  const result = resolveCatalog(catalog,overlays,'zh-CN');
  const localizedCategory = result.categories.find(({id})=>id==='fixture-category');
  assert.equal(localizedCategory.data.name,category.name);
  assert.equal(localizedCategory.data.label,'分类显示标签');
  assert.equal(result.layers.find(({id})=>id==='layer-fixture').data.name,layer.name);
  await writeOverlay(root,{...overlays[0],target_id:category.slug});
  assert.match(validateCatalog(await readCatalog(root)).errors.join('\n'),new RegExp(category.slug));
});

test('duplicate YAML keys and filesystem failures cannot become empty translation collections', async (t) => {
  const root = await fixture(t);
  await mkdir(join(root,'translations'));
  await writeFile(join(root,'translations/duplicate.yaml'),'schema_version: 1.0.0\nlocale: zh-CN\nlocale: zh-CN\nkind: concept\ntarget_id: context\nunits: []\n');
  assert.match(validateCatalog(await readCatalog(root)).errors.join('\n'),/unique|duplicate/i);
  await rm(join(root,'translations'),{recursive:true});
  await writeFile(join(root,'translations'),'not a directory');
  await assert.rejects(readCatalog(root),{code:'ENOTDIR'});
});
