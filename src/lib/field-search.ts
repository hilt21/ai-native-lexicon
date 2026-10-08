export const searchKinds = [
  { value: 'concept', label: 'Concept' },
  { value: 'primitive', label: 'Primitive' },
  { value: 'speaking-guide', label: 'Speaking Guide' },
  { value: 'skill-map', label: 'Skill Map' },
  { value: 'map-node', label: 'Map Node' },
  { value: 'task-journey', label: 'Task Journey' },
] as const;

export type SearchKind = (typeof searchKinds)[number]['value'];
export interface SearchField { label: string; value: string; context?: boolean; lang?: string }
export interface SearchRecord { identity: string; type: SearchKind; title: string; fields: SearchField[] }

export function validSearchKind(value: string) {
  return searchKinds.some((kind) => kind.value === value) ? value : '';
}

function normalized(value: string) { return value.toLowerCase().trim(); }
function compare(a: string, b: string) { return a < b ? -1 : a > b ? 1 : 0; }

/** One match per canonical identity, with the exact record fields that explain it. */
export function matchRecords(records: SearchRecord[], query: string, type: string) {
  const text = normalized(query);
  const words = text.split(/\s+/).filter(Boolean);
  const seen = new Set<string>();
  const results = [];
  for (const record of records) {
    if (seen.has(record.identity)) continue;
    seen.add(record.identity);
    if (type && record.type !== type) continue;
    const fields = record.fields.filter((field) => words.some((word) => normalized(field.value).includes(word)));
    if (!words.every((word) => fields.some((field) => normalized(field.value).includes(word)))) continue;
    const title = normalized(record.title);
    const rank = text && title === text ? 0 : text && title.startsWith(text) ? 1 : 2;
    const body = fields.find((field) => field.context);
    let excerpt = '';
    if (body) {
      const offset = Math.min(...words.map((word) => body.value.toLowerCase().indexOf(word)).filter((index) => index >= 0));
      const start = Math.max(0, offset - 45);
      const end = Math.min(body.value.length, offset + 115);
      excerpt = `${start ? '…' : ''}${body.value.slice(start, end)}${end < body.value.length ? '…' : ''}`;
    }
    results.push({ record, rank, label: [...new Set(fields.map((field) => field.label))].join(', '), excerpt, language: body?.lang });
  }
  return results.sort((a, b) => a.rank - b.rank || compare(normalized(a.record.title), normalized(b.record.title)) || compare(a.record.identity, b.record.identity));
}
