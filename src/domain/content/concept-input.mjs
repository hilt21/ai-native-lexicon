import { z } from 'zod';
import { categoryNames } from '../taxonomy/categories.mjs';
import { codepointText, isoDate, slugReferences, sourceUri } from './rules.mjs';

export const conceptInputSchema = z.object({
  term: codepointText(2),
  zh: codepointText(1),
  category: z.enum(categoryNames),
  status: z.enum(['foundational', 'emerging', 'evolving', 'contested']),
  summary: codepointText(40, 240),
  definition: codepointText(80),
  why_it_matters: codepointText(60),
  when_to_use: codepointText(40),
  anti_pattern: codepointText(30),
  related: slugReferences.min(2).max(6),
  primitives: slugReferences,
  sources: z.array(z.object({ title: z.string(), url: sourceUri }).strict()).default([]),
  added: isoDate,
}).strict();

export const categories = conceptInputSchema.shape.category.options;
export const conceptStatuses = conceptInputSchema.shape.status.options;
