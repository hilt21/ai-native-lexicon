import { z } from 'zod';

export const text = z.string().trim().min(1);
export const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const isoDate = z.iso.date();
