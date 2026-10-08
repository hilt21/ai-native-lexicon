import { getConcepts, getPrimitives } from '../lib/catalog';
import { getSpeakingCards } from '../lib/speaking-cards';
import { createDatasetVersion } from '../lib/dataset-version.mjs';
import { categoryRegistry } from '../domain/taxonomy/categories.mjs';
import { layerRegistry } from '../domain/taxonomy/layers.mjs';
import { getSkillMaps } from '../lib/skill-maps';
import { normalizeSkillMaps } from '../domain/content/skill-map-export.mjs';

export const prerender = true;

export async function GET() {
  const [concepts, primitives, speakingCards, maps] = await Promise.all([getConcepts(), getPrimitives(), getSpeakingCards(), getSkillMaps()]);
  const records = {
    concepts: concepts.map(({ id, data }) => ({ slug: id, ...data })),
    primitives: primitives.map(({ id, data }) => ({ slug: id, ...data })),
    speaking_cards: speakingCards,
    skill_maps: normalizeSkillMaps(maps.map(({ id, data }) => ({ id, ...data }))),
  };
  return new Response(
    JSON.stringify(
      {
        name: 'AI Native Lexicon',
        description: 'An open lexicon of concepts, patterns and mental models shaping AI-native software engineering.',
        version: '0.2.0',
        schema_version: '1.4.0',
        dataset_version: createDatasetVersion({ ...records, taxonomy: { categories: categoryRegistry, layers: layerRegistry } }),
        counts: { concepts: concepts.length, primitives: primitives.length, speaking_cards: speakingCards.length, skill_maps: maps.length },
        license: 'CC BY 4.0',
        generated_at: new Date().toISOString(),
        ...records,
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
}
