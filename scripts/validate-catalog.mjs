import { readCatalog, validateCatalog } from '../src/domain/content/catalog.mjs';

const catalog = await readCatalog();
const { errors, categoryCounts } = validateCatalog(catalog);
if (errors.length) {
  console.error(`Catalog validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const distribution = Object.entries(categoryCounts).map(([category, count]) => `${category}: ${count}`).join(', ');
  console.log(`Validated ${catalog.concepts.length} concepts, ${catalog.primitives.length} primitives and ${catalog.speakingCards.length} speaking cards (${distribution}).`);
}
