import { z } from 'zod';
import { categoryNames } from '../taxonomy/categories.mjs';
import { codepointText, isoDate, slugReferences, sourceUri } from './rules.mjs';

export const conceptInputSchema = z.object({
  term: codepointText(2),
  zh: codepointText(1),
  aliases: z.array(z.string().trim().min(1).regex(/\S/))
    .refine((values) => new Set(values.map((value) => value.toLowerCase())).size === values.length, 'Duplicate aliases are not allowed')
    .meta({ uniqueItems: true }).default([]),
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
}).strict().superRefine((data, context) => {
  const names = new Set([data.term, data.zh].map((value) => value.trim().toLowerCase()));
  for (const [index, alias] of data.aliases.entries()) {
    if (names.has(alias.toLowerCase())) context.addIssue({ code: 'custom', path: ['aliases', index], message: 'An alias must differ from its own term and zh' });
  }
});

export const categories = conceptInputSchema.shape.category.options;
export const conceptStatuses = conceptInputSchema.shape.status.options;
