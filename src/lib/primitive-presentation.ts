import { primitiveLayers } from './primitive-schema.mjs';

export type PrimitiveLayer = (typeof primitiveLayers)[number];

export const primitiveOwners = {
  llm: {
    label: 'LLM',
    description: 'Suited to probabilistic reasoning.',
  },
  executor: {
    label: 'Executor · 执行器',
    description: 'Prefer code, rules, databases, state machines, or tools.',
  },
  hybrid: {
    label: 'Hybrid · 混合',
    description:
      'LLMs may propose or explain; deterministic mechanisms constrain, preserve, or commit. Implementation ownership does not transfer human decision authority.',
  },
} as const;

export const primitivePriorities = {
  P0: {
    label: 'Core · 核心',
    description: 'Explicitly consider in most system designs. AI-specific entries state their narrower scope.',
  },
  P1: {
    label: 'Foundation · 基础',
    description: 'A strong default: model explicitly where applicable.',
  },
  P2: {
    label: 'Situational · 情境',
    description: 'Becomes important in complex, adaptive, AI, or high-risk systems.',
  },
} as const;

export function primitiveLayerId(layer: PrimitiveLayer) {
  const slug = layer.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `layer-${slug}`;
}
