import { z } from 'zod';
import { codepointText, isoDate, slugReferences, sourceUri } from './rules.mjs';

export const conceptInputSchema = z.object({
  term: codepointText(2),
  zh: codepointText(1),
  category: z.enum([
    'Context', 'Agent Architecture', 'Harness', 'Governance', 'Execution', 'Knowledge',
    'UX', 'Organization', 'Instruction', 'Memory', 'State', 'Goal', 'Reasoning',
    'Capability', 'Feedback', 'Verification', 'Failure Handling', 'Multi-Agent',
  ]),
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
