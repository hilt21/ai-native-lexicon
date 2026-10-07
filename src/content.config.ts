import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { categories, conceptStatuses } from './domain/content/concept-input.mjs';
import { conceptSchema } from './lib/concept-schema.mjs';
import { yamlContentLoader } from './lib/yaml-content-loader.mjs';
import { speakingCardSchema } from './lib/speaking-card-schema.mjs';
import { primitiveSchema } from './lib/primitive-schema.mjs';
import { skillMapLoader } from './lib/skill-map-loader.mjs';
import { skillMapSchema } from './domain/content/skill-map-input.mjs';

export { categories, conceptStatuses, conceptSchema };

const primitives = defineCollection({
  loader: yamlContentLoader('primitives'),
  schema: primitiveSchema,
});

const concepts = defineCollection({
  loader: yamlContentLoader('concepts'),
  schema: conceptSchema,
});

const docs = defineCollection({ loader: docsLoader(), schema: docsSchema() });

const speakingCards = defineCollection({
  loader: yamlContentLoader('speaking-cards'),
  schema: speakingCardSchema,
});

const skillMaps = defineCollection({ loader: skillMapLoader(), schema: skillMapSchema });
export const collections = { concepts, primitives, speakingCards, skillMaps, docs };

export type Category = (typeof categories)[number];
