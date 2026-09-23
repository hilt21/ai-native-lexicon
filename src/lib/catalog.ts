import { getCollection, type CollectionEntry } from 'astro:content';
import type { Category } from '../content.config';

export const categoryMeta: Record<
  Category,
  { slug: string; code: string; description: string; question: string }
> = {
  Context: {
    slug: 'context',
    code: 'CTX',
    description: 'Design the information an AI system can use—and protect what must not be lost.',
    question: 'What should the system know now?',
  },
  'Agent Architecture': {
    slug: 'agent-architecture',
    code: 'ARC',
    description: 'Shape agents as systems with explicit loops, boundaries, roles, and control flow.',
    question: 'How is agency structured?',
  },
  Harness: {
    slug: 'harness',
    code: 'HAR',
    description: 'Build the deterministic support system around probabilistic model behavior.',
    question: 'What makes the model operational?',
  },
  Governance: {
    slug: 'governance',
    code: 'GOV',
    description: 'Turn trust, authority, oversight, and policy into enforceable boundaries.',
    question: 'Who may decide and intervene?',
  },
  Execution: {
    slug: 'execution',
    code: 'EXE',
    description: 'Make action, recovery, and side effects reliable in an uncertain world.',
    question: 'How does intent become safe action?',
  },
  Knowledge: {
    slug: 'knowledge',
    code: 'KNW',
    description: 'Preserve evidence, memory, freshness, and provenance across decisions.',
    question: 'What can the system justify?',
  },
  UX: {
    slug: 'ux',
    code: 'UX',
    description: 'Give people legible control over systems that can plan and act.',
    question: 'How do people steer agency?',
  },
  Organization: {
    slug: 'organization',
    code: 'ORG',
    description: 'Redesign delegation, accountability, and operations for agent participation.',
    question: 'What makes a team agent-ready?',
  },
  'Instruction': {
    slug: 'instruction',
    code: 'INS',
    description: 'Express requests, behavioral rules, and the priorities that guide an agent.',
    question: 'What should the agent follow?',
  },
  'Memory': {
    slug: 'memory',
    code: 'MEM',
    description: 'Retain, refine, and retire information across steps and tasks.',
    question: 'What should persist?',
  },
  'State': {
    slug: 'state',
    code: 'STA',
    description: 'Represent progress and preserve the outputs needed to continue work.',
    question: 'Where does the work stand?',
  },
  'Goal': {
    slug: 'goal',
    code: 'GOL',
    description: 'Define outcomes and divide responsibility into finishable units.',
    question: 'What counts as done?',
  },
  'Reasoning': {
    slug: 'reasoning',
    code: 'RSN',
    description: 'Choose steps, revise plans, and assess decisions as evidence changes.',
    question: 'What should happen next?',
  },
  'Capability': {
    slug: 'capability',
    code: 'CAP',
    description: 'Equip agents with tools, procedures, and interoperable connections.',
    question: 'What can the agent use?',
  },
  'Feedback': {
    slug: 'feedback',
    code: 'FDB',
    description: 'Observe outcomes and use external signals to improve the next action.',
    question: 'What did the world reveal?',
  },
  'Verification': {
    slug: 'verification',
    code: 'VER',
    description: 'Connect performance and completion claims to inspectable checks.',
    question: 'How do we know it worked?',
  },
  'Failure Handling': {
    slug: 'failure-handling',
    code: 'FAIL',
    description: 'Handle unsuccessful actions and restore useful progress after disruption.',
    question: 'How does work recover?',
  },
  'Multi-Agent': {
    slug: 'multi-agent',
    code: 'MULTI',
    description: 'Manage responsibility, shared information, and dependencies between agents.',
    question: 'How do agents work together?',
  },
};

export type Concept = CollectionEntry<'concepts'>;

export async function getConcepts() {
  return (await getCollection('concepts')).sort((a, b) => a.data.term.localeCompare(b.data.term));
}

export function getCategoryBySlug(slug: string) {
  return (Object.entries(categoryMeta) as [Category, (typeof categoryMeta)[Category]][]).find(
    ([, meta]) => meta.slug === slug,
  );
}

export function pathWithBase(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}` || '/';
}

export type Primitive = CollectionEntry<'primitives'>;

export async function getPrimitives() {
  return (await getCollection('primitives')).sort((a, b) => a.data.term.localeCompare(b.data.term));
}

export function getPrimitiveDefinitions(primitive: Primitive, conceptsById: Map<string, Concept>) {
  return primitive.data.definitions.map((definition) => {
    if ('concept' in definition) {
      const concept = conceptsById.get(definition.concept);
      if (!concept) throw new Error(`${primitive.id}: missing defining concept ${definition.concept}`);
      return { name: concept.data.term, text: concept.data.definition, concept: concept.id };
    }
    return { ...definition, concept: undefined };
  });
}
