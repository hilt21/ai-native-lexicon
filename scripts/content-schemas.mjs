import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { conceptInputSchema } from '../src/domain/content/concept-input.mjs';
import { primitiveInputSchema } from '../src/domain/content/primitive-input.mjs';
import { speakingCardInputSchema } from '../src/domain/content/speaking-card-input.mjs';
import { skillMapInputSchema, skillMapNodeInputSchema, skillMapJourneyInputSchema, skillMapRelationsInputSchema } from '../src/domain/content/skill-map-input.mjs';

const contracts = {
  concept: { schema: conceptInputSchema, title: 'AI Native Lexicon concept' },
  primitive: { schema: primitiveInputSchema, title: 'AI Native Lexicon primitive' },
  'speaking-card': { schema: speakingCardInputSchema, title: 'AI Native Lexicon speaking card' },
  'skill-map': { schema: skillMapInputSchema, title: 'AI Native Lexicon skill map' },
  'skill-map-node': { schema: skillMapNodeInputSchema, title: 'Skill map node' },
  'skill-map-journey': { schema: skillMapJourneyInputSchema, title: 'Skill map task journey' },
  'skill-map-relations': { schema: skillMapRelationsInputSchema, title: 'Skill map relationships' },
};

function generated(name) {
  const { schema, title } = contracts[name];
  return `${JSON.stringify({ ...z.toJSONSchema(schema, { io: 'input' }), title }, null, 2)}\n`;
}

const [mode, argument, output] = process.argv.slice(2);
const defaultDirectory = fileURLToPath(new URL('../schemas/', import.meta.url));
if (mode === 'generate-one') {
  if (!Object.hasOwn(contracts, argument)) throw new Error(`Unknown content type: ${argument}`);
  const file = output ?? join(defaultDirectory, `${argument}.schema.json`);
  await writeFile(file, generated(argument));
  console.log(`Generated ${argument} portable schema.`);
} else if (mode === 'generate' || mode === 'check') {
  const directory = argument ?? defaultDirectory;
  let failures = 0;
  for (const name of Object.keys(contracts)) {
    const file = join(directory, `${name}.schema.json`);
    const expected = generated(name);
    if (mode === 'generate') {
      await writeFile(file, expected);
    } else {
      try {
        if (await readFile(file, 'utf8') !== expected) throw new Error('content differs from shared input contract');
      } catch (error) {
        failures += 1;
        console.error(`Schema drift: ${file}: ${error.message}. Run npm run schema:generate.`);
      }
    }
  }
  if (failures) process.exitCode = 1;
  else console.log(mode === 'check' ? 'All portable schemas match shared input contracts.' : 'Generated all portable schemas.');
} else {
  throw new Error('Use check [directory], generate [directory], or generate-one <content-type> [file].');
}
