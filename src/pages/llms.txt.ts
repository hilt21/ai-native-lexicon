import { getConcepts, getPrimitives } from '../lib/catalog';

export const prerender = true;

export async function GET({ site }: { site: URL | undefined }) {
  const [concepts, primitives] = await Promise.all([getConcepts(), getPrimitives()]);
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
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
