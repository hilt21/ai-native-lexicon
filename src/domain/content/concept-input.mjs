import { z } from 'zod';
import { isoDate, slug } from './rules.mjs';

// Migration input contract. Production still uses src/content.config.ts until L2-03.
export const conceptInputSchema = z.object({
  term: z.string().min(2),
  zh: z.string().min(1),
  category: z.enum([
    'Context', 'Agent Architecture', 'Harness', 'Governance', 'Execution', 'Knowledge',
    'UX', 'Organization', 'Instruction', 'Memory', 'State', 'Goal', 'Reasoning',
    'Capability', 'Feedback', 'Verification', 'Failure Handling', 'Multi-Agent',
  ]),
  status: z.enum(['foundational', 'emerging', 'evolving', 'contested']),
  summary: z.string().min(40).max(240),
  definition: z.string().min(80),
  why_it_matters: z.string().min(60),
  when_to_use: z.string().min(40),
  anti_pattern: z.string().min(30),
  related: z.array(slug).min(2).max(6),
  primitives: z.array(slug),
  sources: z.array(z.object({ title: z.string(), url: z.url() }).strict()).default([]),
  added: isoDate,
}).strict();
