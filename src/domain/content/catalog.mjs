import { readCategories, categoryRegistry } from '../taxonomy/categories.mjs';
import { readLayers, layerRegistry } from '../taxonomy/layers.mjs';
import { readTranslations } from './read-translations.mjs';
import { validateTranslations } from './validate-translations.mjs';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readConceptInputs, readPrimitiveInputs, readSpeakingCardInputs } from './read-content.mjs';
import { validateConceptReferences, validatePrimitiveReferences, validateSpeakingCardReferences } from './validate-references.mjs';
import { readSkillMaps } from './read-skill-maps.mjs';
import { validateSkillMapSources } from './validate-skill-map-references.mjs';

// This input boundary returns diagnostic records, not approval to publish a partial catalog.
export async function readCatalog(directory = new URL('../../data/', import.meta.url)) {
  const path = directory instanceof URL ? fileURLToPath(directory) : directory;
  const [concepts, primitives, speakingCards, skillMaps, translations] = await Promise.all([
    readConceptInputs(join(path, 'concepts')),
    readPrimitiveInputs(join(path, 'primitives')),
    readSpeakingCardInputs(join(path, 'speaking-cards')),
    readSkillMaps(join(path, 'skill-maps')),
    readTranslations(join(path, 'translations')),
  ]);
  // Legacy callers may omit taxonomy; an explicitly supplied registry owns its IDs.
  const hasTaxonomy = (directory) => {
    try { statSync(directory); return true; }
    catch (error) { if (error.code === 'ENOENT') return false; throw error; }
  };
  const categories = hasTaxonomy(join(path, 'taxonomy/categories')) ? readCategories(join(path, 'taxonomy/categories')) : {categories:categoryRegistry,errors:[]};
  const layers = hasTaxonomy(join(path, 'taxonomy/layers')) ? readLayers(join(path, 'taxonomy/layers')) : {layers:layerRegistry,errors:[]};
  return {
    categories: categories.categories,
    layers: layers.layers,
    translations: translations.records,
    concepts: concepts.records,
    primitives: primitives.records,
    speakingCards: speakingCards.records,
    skillMaps: skillMaps.records,
    errors: [
      ...translations.errors.map((error) => `translations/${error}`),
      ...categories.errors.map((error) => `taxonomy/categories/${error}`),
      ...layers.errors.map((error) => `taxonomy/layers/${error}`),
      ...concepts.errors.map((error) => `concepts/${error}`),
      ...primitives.errors.map((error) => `primitives/${error}`),
      ...speakingCards.errors.map((error) => `speaking-cards/${error}`),
      ...skillMaps.errors.map((error) => `skill-maps/${error}`),
    ],
  };
}

export function validateCatalog(catalog) {
  const concepts = validateConceptReferences(catalog.concepts);
  return {
    categoryCounts: concepts.categoryCounts,
    errors: [
      ...catalog.errors,
      ...validateTranslations(catalog.translations ?? [], catalog),
      ...validateSkillMapSources(catalog.skillMaps ?? []),
      ...concepts.errors,
      ...validatePrimitiveReferences(catalog.concepts, catalog.primitives),
      ...validateSpeakingCardReferences(catalog.speakingCards.map(({ data }) => data),
        catalog.concepts.map(({ slug }) => slug), catalog.primitives.map(({ slug }) => slug)),
    ],
  };
}

export async function validateConceptDirectory(directory) {
  const result = await readConceptInputs(directory);
  const references = validateConceptReferences(result.records);
  return { ...result, categoryCounts: references.categoryCounts, errors: [...result.errors, ...references.errors] };
}

export async function validatePrimitiveDirectory(directory, concepts) {
  const result = await readPrimitiveInputs(directory);
  return { ...result, errors: [...result.errors, ...validatePrimitiveReferences(concepts, result.records)] };
}
