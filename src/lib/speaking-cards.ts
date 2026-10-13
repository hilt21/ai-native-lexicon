import { getCollection } from 'astro:content';
import type { z } from 'zod';
import type { speakingCardInputSchema } from '../domain/content/speaking-card-input.mjs';
import { resolveCatalog } from '../domain/content/localize-catalog.mjs';
import type { Locale } from './locale';
import type { TranslationState } from './localized-catalog';

export type SpeakingCardData = z.output<typeof speakingCardInputSchema> & Partial<TranslationState>;

export async function getSpeakingCards(locale: Locale = 'en'): Promise<SpeakingCardData[]> {
  const entries = await getCollection('speakingCards');
  if (locale === 'zh-CN') {
    const translations = (await getCollection('translations')).filter((r) => r.data.kind === 'speaking-guide');
    return resolveCatalog({ speakingCards: entries }, translations, locale).speakingCards.map((r: { data: SpeakingCardData } & TranslationState) => ({ ...r.data, units: r.units, coverage: r.coverage, coreTranslated: r.coreTranslated })).sort((a: SpeakingCardData, b: SpeakingCardData) => a.number - b.number);
  }
  return entries.map((entry) => entry.data).sort((a, b) => a.number - b.number);
}
