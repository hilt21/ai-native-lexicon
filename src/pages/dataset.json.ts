import { getConcepts, getPrimitives } from '../lib/catalog';

export const prerender = true;

export async function GET() {
  const [concepts, primitives] = await Promise.all([getConcepts(), getPrimitives()]);
  return new Response(
    JSON.stringify(
      {
        name: 'AI Native Lexicon',
        description: 'An open lexicon of concepts, patterns and mental models shaping AI-native software engineering.',
        version: '0.2.0',
        license: 'CC BY 4.0',
        generated_at: new Date().toISOString(),
        concepts: concepts.map(({ id, data }) => ({ slug: id, ...data })),
        primitives: primitives.map(({ id, data }) => ({ slug: id, ...data })),
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
}
