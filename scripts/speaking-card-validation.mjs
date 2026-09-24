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
