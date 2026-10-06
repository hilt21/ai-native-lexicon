import { z } from 'zod';
import { fullFormats } from 'ajv-formats/dist/formats.js';

export const text = z.string().trim().min(1);
export const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const isoDate = z.iso.date();
const uriFormat = fullFormats.uri;
export const sourceUri = z.string()
  .refine((value) => typeof uriFormat === 'function' && uriFormat(value), 'Use an absolute URI')
  .meta({ format: 'uri' });
export const slugReferences = z.array(slug)
  .refine((values) => new Set(values).size === values.length, 'Duplicate references are not allowed')
  .meta({ uniqueItems: true });

/** @param {number} minimum @param {number} [maximum] */
export function codepointText(minimum, maximum) {
  return z.string().refine((value) => {
    const length = [...value].length;
    return length >= minimum && (maximum === undefined || length <= maximum);
  }, 'Text length is outside the permitted range').meta({
    minLength: minimum,
    ...(maximum === undefined ? {} : { maxLength: maximum }),
  });
}
