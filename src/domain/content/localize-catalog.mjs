import { translationIdentity } from './translation-input.mjs';
import { translationUnits } from './translation-units.mjs';
import { validateTranslations } from './validate-translations.mjs';

export function resolveCatalog(catalog, overlays = catalog.translations ?? [], locale = 'en') {
  if (!['en','zh-CN'].includes(locale)) throw new Error(`Unsupported locale: ${locale}`);
  const errors = validateTranslations(overlays,catalog);
  if (errors.length) throw new Error(errors.join('\n'));
  const byIdentity = new Map(overlays.map((record) => {const data = record.data ?? record; return [translationIdentity(data),data];}));
  function resolve(kind,id,canonical) {
    const overlay = byIdentity.get(`zh-CN/${kind}/${id}`);
    const translations = new Map((overlay?.units ?? []).map((unit) => [unit.path,unit]));
    const units = Object.fromEntries(translationUnits(kind,id,canonical).map((descriptor) => {
      const candidate = translations.get(descriptor.path);
      const current = candidate?.source_fingerprint === descriptor.sourceFingerprint;
      const status = locale === 'en' ? 'canonical' : !candidate ? 'missing' : candidate.review_status === 'draft' ? 'draft' : !current ? 'stale' : 'reviewed';
      const translated = status === 'reviewed';
      return [descriptor.path,{path:descriptor.path,text:structuredClone(translated ? candidate.translation : descriptor.source),actualLang:translated ? 'zh-CN' : 'en',status,sourceFingerprint:descriptor.sourceFingerprint,fallback:locale !== 'en' && !translated}];
    }));
    const visible = Object.values(units).filter((unit) => !Array.isArray(unit.text) || unit.text.length > 0);
    const coverage = {translated:0,total:visible.length,missing:0,draft:0,stale:0};
    for (const unit of visible) {
      if (unit.status === 'reviewed') coverage.translated++;
      else if (unit.status in coverage) coverage[unit.status]++;
    }
    const data = structuredClone(canonical);
    if (kind === 'concept') {
      for (const path of ['summary','definition','why_it_matters','when_to_use','anti_pattern']) data[path] = units[path].text;
      data.examples = (canonical.examples ?? []).map((_,i) => ({context:units['examples.context'].text[i],example:units['examples.example'].text[i]}));
      data.distinguish_from = (canonical.distinguish_from ?? []).map((item,i) => ({target:item.target,distinction:units['distinguish_from.distinction'].text[i]}));
    } else if (kind === 'primitive') {
      for (const path of ['summary','scope','usage','distinctions','considerations']) data[path] = units[path].text;
      data.composition = {pattern:units['composition.pattern'].text,example:units['composition.example'].text};
      data.ownership.rationale = units['ownership.rationale'].text;
      data.priority.scope = units['priority.scope'].text;
      data.priority.rationale = units['priority.rationale'].text;
      let inlineIndex = 0;
      data.definitions = canonical.definitions.map((item) => 'concept' in item ? {...item} : {name:units['definitions.name'].text[inlineIndex],text:units['definitions.text'].text[inlineIndex++]});
    } else {
      data.label = units.label.text;
      if (kind === 'category') {data.description = units.description.text; data.question = units.question.text;}
    }
    const core = kind === 'concept' ? ['summary','definition'] : kind === 'primitive' ? ['summary','scope'] : Object.keys(units);
    return {id,canonical,data,units,coverage,coreTranslated:core.every((path) => units[path].status === 'reviewed')};
  }
  const concepts = (catalog.concepts ?? []).map((record) => resolve('concept',record.id ?? record.slug,record.data));
  const conceptById = new Map(concepts.map((record) => [record.id,record]));
  const primitives = (catalog.primitives ?? []).map((record) => {
    const result = resolve('primitive',record.id ?? record.slug,record.data);
    result.definitions = result.data.definitions.map((definition) => {
      if ('concept' in definition) {
        const concept = conceptById.get(definition.concept);
        if (!concept) throw new Error(`Missing referenced Concept: ${definition.concept}`);
        return {name:concept.data.term,text:concept.data.definition,concept:concept.id,nameLang:'en',textLang:concept.units.definition.actualLang,unit:concept.units.definition};
      }
      return {...definition,nameLang:result.units['definitions.name'].actualLang,textLang:result.units['definitions.text'].actualLang,unit:result.units['definitions.text']};
    });
    return result;
  });
  return {concepts,primitives,categories:(catalog.categories ?? []).map((record) => resolve('category',record.slug ?? record.id,record.data ?? record)),layers:(catalog.layers ?? []).map((record) => resolve('layer',record.anchor ?? record.id,record.data ?? record))};
}
