import { z } from 'zod';
import { text as requiredText, slug, isoDate, slugReferences } from './rules.mjs';

const text = requiredText.regex(/\S/, 'Use non-blank text');
const texts = z.array(text).refine((v) => new Set(v).size === v.length, 'Duplicate values are not allowed').meta({ uniqueItems: true });
const path = text.regex(/^(?!\/)(?!.*\\)(?!.*(?:^|\/)\.\.?(?:\/|$))[^/]+(?:\/[^/]+)*$/, 'Use a relative source path without traversal');
const commit = z.string().regex(/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/);
const sourceFields = { id: slug, repository: z.url({ protocol: /^https?$/ }), root_path: path, version: text.optional(), observed_at: isoDate };
const source = z.union([
  z.object({ ...sourceFields, verification_status: z.literal('pending'), commit: commit.optional(), verified_at: isoDate.optional() }).strict(),
  z.object({ ...sourceFields, verification_status: z.literal('verified'), commit, verified_at: isoDate }).strict(),
]);
const classification = z.object({ id: slug, label: text, description: text }).strict();
const relationId = z.string().regex(/^[a-z][a-z0-9]*(?:[-_][a-z0-9]+)*$/);
const sourceRef = z.object({ source: slug, path }).strict();
const sourceRefs = z.array(sourceRef).refine((v) => new Set(v.map((r) => `${r.source}/${r.path}`)).size === v.length, 'Duplicate source references').meta({ uniqueItems: true });

export const skillMapInputSchema = z.object({
  schema_version: z.literal('1.0.0'), title: text, summary: text, scope: text, audience: texts.min(1), order: z.number().int().nonnegative().optional(),
  sources: z.array(source).min(1), current_sources: slugReferences.min(1),
  taxonomy: z.object({
    types: z.array(classification), layers: z.array(classification).default([]), clusters: z.array(classification).default([]),
    relation_types: z.array(z.object({ id: relationId, description: text, outgoing_label: text, incoming_label: text }).strict()),
  }).strict(),
}).strict();

const nodeFields = {
  title: text, summary: text, type: slug, layer: slug.optional(), primary_cluster: slug.optional(), secondary_clusters: slugReferences.default([]), tags: texts.default([]),
  inputs: texts.default([]), outputs: texts.default([]), handoffs: texts.default([]), source_refs: sourceRefs.default([]), official_description: text.optional(),
};
export const skillMapNodeInputSchema = z.union([
  z.object({ ...nodeFields, status: z.literal('active').default('active'), mechanism: text, when_to_use: texts.min(1), solves: texts.min(1), source_refs: sourceRefs.min(1) }).strict(),
  z.object({ ...nodeFields, status: z.literal('retired'), retirement_note: text, replaced_by: slug.optional(), mechanism: text.optional(), when_to_use: texts.default([]), solves: texts.default([]) }).strict(),
]);

const step = z.object({ title: text, why: text, nodes: slugReferences.min(1), optional: z.boolean().default(false), when: text.optional(), outputs: texts.default([]) }).strict();
const variants = z.array(z.object({ id: slug, title: text, when: text.optional(), steps: z.array(step).min(1) }).strict());
const journeyFields = { title: text, summary: text, order: z.number().int().nonnegative().optional(), inputs: texts.default([]), source_refs: sourceRefs.default([]) };
export const skillMapJourneyInputSchema = z.union([
  z.object({ ...journeyFields, status: z.literal('active').default('active'), when_to_use: texts.min(1), outputs: texts.min(1), variants: variants.min(1) }).strict(),
  z.object({ ...journeyFields, status: z.literal('retired'), retirement_note: text, when_to_use: texts.default([]), outputs: texts.default([]), variants: variants.default([]) }).strict(),
]);
export const skillMapRelationsInputSchema = z.object({ relations: z.array(z.object({ from: slug, to: slug, type: relationId, note: text.optional(), source_refs: sourceRefs.default([]) }).strict()) }).strict();

export const skillMapSchema = skillMapInputSchema.extend({
  nodes: z.array(z.union([skillMapNodeInputSchema.options[0].extend({ id: slug }), skillMapNodeInputSchema.options[1].extend({ id: slug })])),
  journeys: z.array(z.union([skillMapJourneyInputSchema.options[0].extend({ id: slug }), skillMapJourneyInputSchema.options[1].extend({ id: slug })])),
  relations: skillMapRelationsInputSchema.shape.relations,
});
