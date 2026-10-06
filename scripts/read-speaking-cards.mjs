import { readSpeakingCardInputs } from '../src/domain/content/read-content.mjs';

export async function readSpeakingCards(directory = new URL('../src/data/speaking-cards/', import.meta.url)) {
  const { records, errors } = await readSpeakingCardInputs(directory);
  if (errors.length) throw new Error(errors.join('\n'));
  return records.map(({ data }) => data);
}
