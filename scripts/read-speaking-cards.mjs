import { readdir, readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { speakingCardSchema } from '../src/lib/speaking-card-schema.mjs';

export async function readSpeakingCards(directory = new URL('../src/data/speaking-cards/', import.meta.url)) {
  const files = (await readdir(directory)).filter((file) => /\.ya?ml$/.test(file)).sort();
  const cards = [];
  const numbers = new Set();
  for (const file of files) {
    let card;
    try {
      card = speakingCardSchema.parse(parse(await readFile(new URL(file, directory), 'utf8')));
    } catch (error) {
      throw new Error(`${file}: ${error.message}`, { cause: error });
    }
    if (numbers.has(card.number)) throw new Error(`${file}: duplicate speaking card number ${card.number}`);
    numbers.add(card.number);
    cards.push(card);
  }
  return cards.sort((a, b) => a.number - b.number);
}
