import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'zod';

export const categories = [
  'Context',
  'Agent Architecture',
  'Harness',
  'Governance',
  'Execution',
  'Knowledge',
  'UX',
  'Organization',
] as const;

export const conceptStatuses = ['foundational', 'emerging', 'evolving', 'contested'] as const;

export const conceptSchema = z.object({
  term: z.string().min(2),
  zh: z.string().min(1),
  category: z.enum(categories),
  status: z.enum(conceptStatuses),
  summary: z.string().min(40).max(240),
  definition: z.string().min(80),
  why_it_matters: z.string().min(60),
  when_to_use: z.string().min(40),
  anti_pattern: z.string().min(30),
  related: z.array(z.string()).min(2).max(6),
  tags: z.array(z.string()).min(2).max(8),
  sources: z
    .array(
      z.object({
        title: z.string(),
        url: z.url(),
      }),
    )
    .default([]),
  added: z.coerce.date(),
});

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/data/concepts' }),
  schema: conceptSchema,
});

const docs = defineCollection({ loader: docsLoader(), schema: docsSchema() });

export const collections = { concepts, docs };

export type Category = (typeof categories)[number];
