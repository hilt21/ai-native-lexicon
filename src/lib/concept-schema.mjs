import { conceptInputSchema } from '../domain/content/concept-input.mjs';

// Existing pages and exports receive Date values until their projection migration.
export const conceptSchema = conceptInputSchema.transform((data) => ({
  ...data,
  added: new Date(`${data.added}T00:00:00.000Z`),
}));
