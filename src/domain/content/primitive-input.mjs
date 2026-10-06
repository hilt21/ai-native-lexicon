import { z } from 'zod';
import { isoDate, slug, slugReferences, sourceUri, text as requiredText } from './rules.mjs';

const text = requiredText.regex(/\S/, 'Use non-blank text');
const octet = '(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])';
const ipv4 = `${octet}(?:\\.${octet}){3}`;
// HTTP clients interpret numeric host endings as IPv4; use explicit dotted decimals.
const hostname = '(?!(?:[a-zA-Z0-9_-]+\\.)*(?:[0-9]+|0[xX][0-9a-fA-F]*)\\.?(?=[:/?#]|$))[a-zA-Z0-9_-]+(?:\\.[a-zA-Z0-9_-]+)*\\.?';
const host = `(?:\\[[0-9a-fA-F:.]+\\]|${ipv4}|${hostname})`;
const port = '(?:0*(?:[0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?';
const httpSourceUrl = sourceUri.regex(
  new RegExp(`^https?:\\/\\/(?:[^/?#@\\s]+@)?${host}(?::${port})?(?:[/?#]|$)`),
  'Use an HTTP(S) source URL with a valid host and port',
).meta({ format: 'uri' });

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
  related: slugReferences,
  sources: z.array(z.object({
    title: text,
    section: text,
    basis: z.enum(['report-synthesis', 'editorial-synthesis']),
    verification: z.enum(['unverified', 'verified']),
    url: httpSourceUrl.optional(),
  }).strict()).min(1),
  added: isoDate,
}).strict();

export const primitiveLayers = primitiveInputSchema.shape.layer.options;
