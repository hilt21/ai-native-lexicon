import { pathWithBase } from './catalog';
import type { SearchKind } from './field-search';

export const resourceIcons: Record<SearchKind, string> = {
  concept: 'concept',
  primitive: 'primitive',
  'speaking-guide': 'speaking-guide',
  'skill-map': 'skill-map',
  'map-node': 'map-node',
  'task-journey': 'task-journey',
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
