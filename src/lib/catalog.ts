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
