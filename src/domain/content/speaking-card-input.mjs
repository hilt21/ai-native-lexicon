import { z } from 'zod';
import { slugReferences, text as requiredText } from './rules.mjs';

const text = requiredText.regex(/\S/, 'Use non-blank text');

// Speaking Cards are the existing input format for speaking guides.
export const speakingCardInputSchema = z.object({
  number: z.number().int().positive(),
  title: text,
  concepts: slugReferences,
  primitives: slugReferences,
  coreIdea: text,
  keyLines: z.array(text).min(1),
  realCase: z.array(text).min(1),
  discussionQuestion: text,
  endingLabel: text,
  ending: text,
}).strict();
