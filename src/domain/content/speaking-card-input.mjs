import { z } from 'zod';
import { slug, text } from './rules.mjs';

// Speaking Cards are the existing input format for speaking guides.
export const speakingCardInputSchema = z.object({
  number: z.number().int().positive(),
  title: text,
  concepts: z.array(slug),
  primitives: z.array(slug),
  coreIdea: text,
  keyLines: z.array(text).min(1),
  realCase: z.array(text).min(1),
  discussionQuestion: text,
  endingLabel: text,
  ending: text,
}).strict();
