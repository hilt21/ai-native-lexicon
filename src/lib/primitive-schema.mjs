import { primitiveInputSchema } from '../domain/content/primitive-input.mjs';

export { primitiveLayers } from '../domain/content/primitive-input.mjs';

export const primitiveSchema = primitiveInputSchema.transform((data) => ({
  ...data,
  added: new Date(`${data.added}T00:00:00.000Z`),
}));
