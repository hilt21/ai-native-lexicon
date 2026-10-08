import { z } from 'zod';
import { isoDate, slug } from './rules.mjs';

const text = z.string().regex(/\S/, 'Use non-blank translation text');
const unitFields = {
  path: z.string().min(1),
  translation: z.union([text, z.array(text).min(1)]),
  source_fingerprint: z.string().regex(/^sha256:[a-f0-9]{64}$/, 'Use a sha256 fingerprint'),
};
export const translationUnitInputSchema = z.discriminatedUnion('review_status', [
  z.object({...unitFields, review_status:z.literal('draft'), reviewed_at:isoDate.optional()}).strict(),
  z.object({...unitFields, review_status:z.literal('reviewed'), reviewed_at:isoDate}).strict(),
]);

export const translationInputSchema = z.object({
  schema_version: z.literal('1.0.0'),
  locale: z.literal('zh-CN'),
  kind: z.enum(['concept', 'primitive', 'category', 'layer']),
  target_id: slug,
  units: z.array(translationUnitInputSchema).default([]),
}).strict().refine((overlay) => new Set(overlay.units.map((unit) => unit.path)).size === overlay.units.length,
  { message: 'Duplicate translation unit paths', path: ['units'] });
export const translationSchema = translationInputSchema;
export const translationIdentity = (data) => `${data.locale}/${data.kind}/${data.target_id}`;
