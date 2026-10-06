import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { speakingCardInputSchema } from '../src/domain/content/speaking-card-input.mjs';

export function generateSpeakingCardSchema() {
  return {
    ...z.toJSONSchema(speakingCardInputSchema, { io: 'input' }),
    title: 'AI Native Lexicon speaking card',
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = process.argv[2] ?? new URL('../schemas/speaking-card.schema.json', import.meta.url);
  await writeFile(output, `${JSON.stringify(generateSpeakingCardSchema(), null, 2)}\n`);
  console.log('Generated Speaking Card portable schema.');
}
