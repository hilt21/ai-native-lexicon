import { pathWithBase } from './catalog';
import type { SearchKind } from './field-search';

export const resourceIcons: Record<SearchKind, { file: string; label: string }> = {
  concept: { file: 'concept', label: 'Concept' },
  primitive: { file: 'primitive', label: 'Primitive' },
  'speaking-guide': { file: 'speaking-guide', label: 'Speaking Guide' },
  'skill-map': { file: 'skill-map', label: 'Skill Map' },
  'map-node': { file: 'map-node', label: 'Map Node' },
  'task-journey': { file: 'task-journey', label: 'Task Journey' },
};

export function resourceKindForRoute(path: string): SearchKind | undefined {
  if (path.startsWith('/concepts/')) return 'concept';
  if (path.startsWith('/primitives/')) return 'primitive';
  if (path === '/speaking-card/') return 'speaking-guide';
  if (/^\/skill-maps\/[^/]+\/nodes\//.test(path)) return 'map-node';
  if (/^\/skill-maps\/[^/]+\/journeys\//.test(path)) return 'task-journey';
  if (path.startsWith('/skill-maps/')) return 'skill-map';
}

export const cardId = (number: number) => `card-${String(number).padStart(2, '0')}`;
export const cardImagePath = (number: number, format: 'landscape' | 'portrait') => pathWithBase(`/brand/social/${cardId(number)}-${format}.png`);
export const cardSharePath = (number: number) => pathWithBase(`/share/speaking-card/${cardId(number)}/`);
