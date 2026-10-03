import { getCollection, type CollectionEntry } from 'astro:content';

export type SpeakingCardData = CollectionEntry<'speakingCards'>['data'];

export async function getSpeakingCards(): Promise<SpeakingCardData[]> {
  const entries = await getCollection('speakingCards');
  return entries.map((entry) => entry.data).sort((a, b) => a.number - b.number);
}
