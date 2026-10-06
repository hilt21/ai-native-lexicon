import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { conceptInputSchema } from '../src/domain/content/concept-input.mjs';

export function generateConceptSchema() {
  return {
    ...z.toJSONSchema(conceptInputSchema, { io: 'input' }),
    title: 'AI Native Lexicon concept',
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = process.argv[2] ?? new URL('../schemas/concept.schema.json', import.meta.url);
  await writeFile(output, `${JSON.stringify(generateConceptSchema(), null, 2)}\n`);
  console.log('Generated Concept portable schema.');
}
