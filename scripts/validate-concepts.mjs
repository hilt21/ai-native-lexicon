import { fileURLToPath } from 'node:url';
import { validateConceptDirectory } from './concept-validation.mjs';
import { validatePrimitiveDirectory } from './primitive-validation.mjs';

const directory = fileURLToPath(new URL('../src/data/concepts/', import.meta.url));
const result = await validateConceptDirectory(directory);

const primitives = await validatePrimitiveDirectory(fileURLToPath(new URL('../src/data/primitives/', import.meta.url)), result.records);
result.errors.push(...primitives.errors);

if (result.errors.length > 0) {
  console.error(`Concept validation failed with ${result.errors.length} error(s):`);
  for (const error of result.errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const distribution = Object.entries(result.categoryCounts)
    .map(([category, count]) => `${category}: ${count}`)
    .join(', ');
  console.log(`Validated ${result.records.length} concepts and ${primitives.records.length} primitives (${distribution}).`);
}
