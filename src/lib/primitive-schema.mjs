import { z } from 'zod';

/** @type {const} */
export const primitiveLayers = [
  'Purpose & Governance',
  'Structure & Representation',
  'Dynamics & Control',
  'Cognition & Action',
  'Runtime & Trust',
];

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const text = z.string().trim().min(1);

export const primitiveSchema = z.object({
  term: text,
  zh: text,
  layer: z.enum(primitiveLayers),
  summary: text,
  // Referenced definitions remain canonical in the concepts collection.
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
    url: z.url().refine((value) => /^https?:\/\//.test(value), 'Use an HTTP(S) source URL').optional(),
  }).strict()).min(1),
  added: z.coerce.date(),
}).strict();
