import { z } from 'zod';
import { text as requiredText } from '../content/rules.mjs';
import { readTaxonomy, taxonomyDirectory } from './read-taxonomy.mjs';

const text = requiredText.regex(/\S/, 'Use non-blank text');
export const layerInputSchema = z.object({
  name: text,
  anchor: z.string().regex(/^layer-[a-z0-9]+(?:-[a-z0-9]+)*$/),
  order: z.number().int().positive(),
}).strict();

/** @param {string} anchor */
export function layerHeadingId(anchor) {
  return `${anchor}-title`;
}

/** @param {string | URL} [directory] */
export function readLayers(directory = taxonomyDirectory('layers')) {
  const { records, errors } = readTaxonomy(directory, layerInputSchema, ['name', 'anchor', 'order']);
  const navigationIds = new Map();
  for (const layer of records) {
    for (const id of [layer.anchor, layerHeadingId(layer.anchor)]) {
      if (navigationIds.has(id)) errors.push(`${layer.name}: navigation ID "${id}" conflicts with layer "${navigationIds.get(id)}"`);
      navigationIds.set(id, layer.name);
    }
  }
  if (!records.length) errors.push('layers: configure at least one layer');
  return { layers: records, errors };
}

const result = readLayers();
if (result.errors.length) throw new Error(`Invalid layer configuration:\n${result.errors.join('\n')}`);
export const layerRegistry = result.layers;
export const layerNames = layerRegistry.map(({ name }) => name);

/** @param {string} name */
export function layerAnchor(name) {
  const layer = layerRegistry.find((entry) => entry.name === name);
  if (!layer) throw new Error(`Unknown primitive layer: ${name}`);
  return layer.anchor;
}
