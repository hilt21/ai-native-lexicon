import { readConceptInputs, readPrimitiveInputs } from '../src/domain/content/read-content.mjs';
import { validateSpeakingCardReferences } from './speaking-card-validation.mjs';
import { readSpeakingCards } from './read-speaking-cards.mjs';

const cards = await readSpeakingCards();

const [concepts, primitives] = await Promise.all([readConceptInputs(), readPrimitiveInputs()]);
const errors = [
  ...concepts.errors,
  ...primitives.errors,
  ...validateSpeakingCardReferences(cards, concepts.records.map(({ slug }) => slug), primitives.records.map(({ slug }) => slug)),
];

if (errors.length > 0) {
  console.error(`Speaking card reference validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const conceptReferences = cards.reduce((count, card) => count + card.concepts.length, 0);
  const primitiveReferences = cards.reduce((count, card) => count + card.primitives.length, 0);
  console.log(`Validated ${cards.length} speaking cards (${conceptReferences} concept references, ${primitiveReferences} primitive references).`);
}
