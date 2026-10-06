import { getConcepts, getPrimitives, pathWithBase } from '../lib/catalog';
import { getSpeakingCards } from '../lib/speaking-cards';

export const prerender = true;

export async function GET({ site }: { site: URL | undefined }) {
  const [concepts, primitives, speakingCards] = await Promise.all([getConcepts(), getPrimitives(), getSpeakingCards()]);
  const origin = site?.toString().replace(/\/$/, '') ?? '';
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const lines = [
    '# AI Native Lexicon',
    '',
    '> An open lexicon of concepts, patterns and mental models shaping AI-native software engineering.',
    '',
    `Dataset: ${origin}${base}/dataset.json`,
    '',
    '## Primitives',
    '',
    ...primitives.map((primitive) => `- [${primitive.data.term}](${origin}${base}/primitives/#${primitive.id}): ${primitive.data.summary}`),
    '',
    '## Concepts',
    '',
    ...concepts.map((concept) => `- [${concept.data.term}](${origin}${base}/concepts/${concept.id}/): ${concept.data.summary}`),
    '',
    '## Speaking Guides',
    '',
    ...speakingCards.map((card) => `- [${card.title}](${origin}${pathWithBase(`/speaking-card/#card-${String(card.number).padStart(2, '0')}`)}): ${card.coreIdea}`),
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
