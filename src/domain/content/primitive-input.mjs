import { z } from 'zod';
import { isoDate, slug, text } from './rules.mjs';

// Production still uses primitiveSchema until L2-04.
export const primitiveInputSchema = z.object({
  term: text,
  zh: text,
  layer: z.enum([
    'Purpose & Governance', 'Structure & Representation', 'Dynamics & Control',
    'Cognition & Action', 'Runtime & Trust',
  ]),
  summary: text,
  definitions: z.array(z.union([
    z.object({ concept: slug }).strict(),
    z.object({ name: text, text }).strict(),
  ])).min(1),
  scope: text,
  usage: text,
  composition: z.object({ pattern: text, example: text }).strict(),
  considerations: z.array(text).min(1),
  distinctions: text,
  ownership: z.object({ kind: z.enum(['llm', 'executor', 'hybrid']), rationale: text }).strict(),
  priority: z.object({ level: z.enum(['P0', 'P1', 'P2']), scope: text, rationale: text }).strict(),
  related: z.array(slug),
  sources: z.array(z.object({
    title: text,
    section: text,
    basis: z.enum(['report-synthesis', 'editorial-synthesis']),
    verification: z.enum(['unverified', 'verified']),
    url: z.url().regex(/^https?:\/\//, 'Use an HTTP(S) source URL').optional(),
  }).strict()).min(1),
  added: isoDate,
}).strict();
