import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { primitiveInputSchema } from '../src/domain/content/primitive-input.mjs';

export function generatePrimitiveSchema() {
  return {
    ...z.toJSONSchema(primitiveInputSchema, { io: 'input' }),
    title: 'AI Native Lexicon primitive',
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = process.argv[2] ?? new URL('../schemas/primitive.schema.json', import.meta.url);
  await writeFile(output, `${JSON.stringify(generatePrimitiveSchema(), null, 2)}\n`);
  console.log('Generated Primitive portable schema.');
}
