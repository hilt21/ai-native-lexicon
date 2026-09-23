import { readdir, readFile } from 'node:fs/promises';
import { readYamlDirectory } from './concept-validation.mjs';

// Astro validates field shapes; this check validates relationships across collections.
export function validatePrimitiveReferences(concepts, primitives) {
  const errors = [];
  const conceptsBySlug = new Map(concepts.map((concept) => [concept.slug, concept]));
  const conceptSlugs = new Set(conceptsBySlug.keys());
  const primitiveSlugs = new Set(primitives.map(({ slug }) => slug));
  const terms = new Set();

  function checkLinks(slug, field, links, targets, disallowSelf = false) {
    if (!Array.isArray(links) || links.some((link) => typeof link !== 'string')) {
      errors.push(`${slug}: ${field} must be an array of slugs`);
      return;
    }
    if (new Set(links).size !== links.length) errors.push(`${slug}: duplicate ${field} reference`);
    for (const link of links) {
      if (!targets.has(link)) errors.push(`${slug}: ${field} target "${link}" does not exist`);
      if (disallowSelf && link === slug) errors.push(`${slug}: ${field} cannot reference itself`);
    }
  }

  for (const { slug, data } of concepts) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      errors.push(`${slug}: entry must be a YAML object`);
      continue;
    }
    if ('tags' in data) errors.push(`${slug}: legacy tags must be replaced by primitives`);
    checkLinks(slug, 'primitives', data?.primitives, primitiveSlugs);
  }
  for (const { slug, data } of primitives) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push(`${slug}: filename must be a kebab-case slug`);
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      errors.push(`${slug}: entry must be a YAML object`);
      continue;
    }
    const term = String(data.term ?? '').trim().toLowerCase();
    if (terms.has(term)) errors.push(`${slug}: duplicate primitive term "${data.term}"`);
    terms.add(term);
    checkLinks(slug, 'related', data.related, primitiveSlugs, true);
    if (!Array.isArray(data.definitions) || data.definitions.length === 0) {
      errors.push(`${slug}: definitions must not be empty`);
      continue;
    }
    const references = data.definitions.filter((definition) => definition && typeof definition === 'object' && 'concept' in definition).map((definition) => definition.concept);
    checkLinks(slug, 'definitions', references, conceptSlugs);
    for (const reference of references) {
      const concept = conceptsBySlug.get(reference);
      if (concept && (!Array.isArray(concept.data?.primitives) || !concept.data.primitives.includes(slug))) {
        errors.push(`${slug}: defining concept "${reference}" must link back to this primitive`);
      }
    }
  }
  return errors;
}

export async function validatePrimitiveDirectory(directory, concepts) {
  const { files, records, errors } = await readYamlDirectory(directory);
  errors.push(...validatePrimitiveReferences(concepts, records));
  return { files, records, errors };
}
