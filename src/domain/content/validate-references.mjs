import { categories as CATEGORIES } from './concept-input.mjs';

export function validateConceptReferences(records) {
  const errors = [];
  const slugs = new Set(records.map(({ slug }) => slug));
  const terms = new Map();

  for (const { slug, file, data } of records) {
    for (const related of data.related ?? []) {
      if (related === slug) errors.push(`${file}: concept cannot relate to itself`);
      if (!slugs.has(related)) errors.push(`${file}: related concept "${related}" does not exist`);
    }
    const normalizedTerm = data.term.trim().toLowerCase();
    if (terms.has(normalizedTerm)) errors.push(`${file}: duplicate term also found in ${terms.get(normalizedTerm)}`);
    terms.set(normalizedTerm, file);
  }

  const categoryCounts = Object.fromEntries(CATEGORIES.map((category) => [category, 0]));
  for (const { data } of records) if (data?.category in categoryCounts) categoryCounts[data.category] += 1;
  for (const [category, count] of Object.entries(categoryCounts)) {
    if (count === 0) errors.push(`category "${category}" has no concepts`);
  }

  return { errors, categoryCounts };
}

// Input contracts validate field shapes; this check validates relationships across collections.
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
    checkLinks(slug, 'primitives', data?.primitives, primitiveSlugs);
  }
  for (const { slug, data } of primitives) {
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

export function validateSpeakingCardReferences(cards, conceptSlugs, primitiveSlugs) {
  if (!Array.isArray(cards)) return ['speaking cards must be an array'];

  const targets = {
    concepts: new Set(conceptSlugs),
    primitives: new Set(primitiveSlugs),
  };
  const errors = [];

  for (const card of cards) {
    if (!card || typeof card !== 'object' || Array.isArray(card)) {
      errors.push('speaking card entry must be an object');
      continue;
    }

    const label = `Card ${String(card.number ?? '?').padStart(2, '0')} ${card.title ?? 'Untitled'}`;
    for (const field of ['concepts', 'primitives']) {
      const references = card[field];
      if (!Array.isArray(references) || references.some((slug) => typeof slug !== 'string' || slug.trim() === '')) {
        errors.push(`${label}: ${field} must be an array of non-empty slugs`);
        continue;
      }

      const seen = new Set();
      for (const slug of references) {
        if (seen.has(slug)) errors.push(`${label}: duplicate ${field.slice(0, -1)} reference "${slug}"`);
        seen.add(slug);
        if (!targets[field].has(slug)) errors.push(`${label}: ${field.slice(0, -1)} slug "${slug}" does not exist`);
      }
    }
  }

  return errors;
}
