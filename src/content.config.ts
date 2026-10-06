import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { categories, conceptStatuses } from './domain/content/concept-input.mjs';
import { conceptSchema } from './lib/concept-schema.mjs';
import { conceptLoader } from './lib/concept-loader.mjs';
import { speakingCardSchema } from './lib/speaking-card-schema.mjs';
import { primitiveSchema } from './lib/primitive-schema.mjs';

export { categories, conceptStatuses, conceptSchema };

const primitives = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/data/primitives' }),
  schema: primitiveSchema,
});

const concepts = defineCollection({
  loader: conceptLoader(),
  schema: conceptSchema,
});

const docs = defineCollection({ loader: docsLoader(), schema: docsSchema() });

const speakingCards = defineCollection({
  loader: glob({ pattern: '*.{yaml,yml}', base: './src/data/speaking-cards' }),
  schema: speakingCardSchema,
});

export const collections = { concepts, primitives, speakingCards, docs };

export type Category = (typeof categories)[number];
