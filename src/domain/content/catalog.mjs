import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readConceptInputs, readPrimitiveInputs, readSpeakingCardInputs } from './read-content.mjs';
import { validateConceptReferences, validatePrimitiveReferences, validateSpeakingCardReferences } from './validate-references.mjs';

// This input boundary returns diagnostic records, not approval to publish a partial catalog.
export async function readCatalog(directory = new URL('../../data/', import.meta.url)) {
  const path = directory instanceof URL ? fileURLToPath(directory) : directory;
  const [concepts, primitives, speakingCards] = await Promise.all([
    readConceptInputs(join(path, 'concepts')),
    readPrimitiveInputs(join(path, 'primitives')),
    readSpeakingCardInputs(join(path, 'speaking-cards')),
  ]);
  return {
    concepts: concepts.records,
    primitives: primitives.records,
    speakingCards: speakingCards.records,
    errors: [
      ...concepts.errors.map((error) => `concepts/${error}`),
      ...primitives.errors.map((error) => `primitives/${error}`),
      ...speakingCards.errors.map((error) => `speaking-cards/${error}`),
    ],
  };
}

export function validateCatalog(catalog) {
  const concepts = validateConceptReferences(catalog.concepts);
  return {
    categoryCounts: concepts.categoryCounts,
    errors: [
      ...catalog.errors,
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
