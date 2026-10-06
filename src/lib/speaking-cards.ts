import { getCollection } from 'astro:content';
import type { z } from 'zod';
import type { speakingCardInputSchema } from '../domain/content/speaking-card-input.mjs';

export type SpeakingCardData = z.output<typeof speakingCardInputSchema>;

export async function getSpeakingCards(): Promise<SpeakingCardData[]> {
  const entries = await getCollection('speakingCards');
  return entries.map((entry) => entry.data).sort((a, b) => a.number - b.number);
}
