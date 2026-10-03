import { z } from 'zod';

const text = z.string().trim().min(1);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const speakingCardSchema = z.object({
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
