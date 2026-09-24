import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { validateSpeakingCardReferences } from './speaking-card-validation.mjs';

const cardsPath = new URL('../src/data/speaking-cards.json', import.meta.url);
const cards = JSON.parse(await readFile(cardsPath, 'utf8'));

async function readSlugs(directory) {
  const files = await readdir(directory);
  return files.filter((file) => /\.ya?ml$/.test(file)).map((file) => file.replace(/\.ya?ml$/, ''));
}

const [conceptSlugs, primitiveSlugs] = await Promise.all([
  readSlugs(fileURLToPath(new URL('../src/data/concepts/', import.meta.url))),
  readSlugs(fileURLToPath(new URL('../src/data/primitives/', import.meta.url))),
]);
const errors = validateSpeakingCardReferences(cards, conceptSlugs, primitiveSlugs);

if (errors.length > 0) {
  console.error(`Speaking card reference validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const conceptReferences = cards.reduce((count, card) => count + card.concepts.length, 0);
  const primitiveReferences = cards.reduce((count, card) => count + card.primitives.length, 0);
  console.log(`Validated ${cards.length} speaking cards (${conceptReferences} concept references, ${primitiveReferences} primitive references).`);
}
