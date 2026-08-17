import { getConcepts } from '../lib/catalog';

export const prerender = true;

export async function GET({ site }: { site: URL | undefined }) {
  const concepts = await getConcepts();
  const origin = site?.toString().replace(/\/$/, '') ?? '';
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const lines = [
    '# AI Native Lexicon',
    '',
    '> An open lexicon of concepts, patterns and mental models shaping AI-native software engineering.',
    '',
    `Dataset: ${origin}${base}/dataset.json`,
    '',
    '## Concepts',
    '',
    ...concepts.map((concept) => `- [${concept.data.term}](${origin}${base}/concepts/${concept.id}/): ${concept.data.summary}`),
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
