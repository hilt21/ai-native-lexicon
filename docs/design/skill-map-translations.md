# Skill Map language projections

English canonical map records own identity, taxonomy IDs, graph structure, sources and public routes. Independent Chinese prose assets live under `src/data/skill-map-translations/`. Both reader editions share those structures; there is no second editable graph. This contract extends [ADR-0011](../adr/0011-canonical-prose-and-translation-assets.md) and supersedes the original-language-only publication policy in the historical audits.

## Input and preservation

The strict `skill-map-translation` portable schema describes one `(locale, map_id, kind, target_id)` owner. Locale is `zh-CN`; kind is `map`, `node`, `journey` or `relation`. Map/node/journey IDs are stable public IDs. Relation identity is JSON of `[from, type, to]`, independent of file order. Recursively discovered YAML files are independently editable. Duplicate owners, duplicate paths/keys, unknown fields/owners and non-prose paths are errors. No asset can supply identities, topology, source snapshots or reference arrays.

Each unit supplies a prose `path`, nonblank `translation`, explicit actual `language` (`en`, `zh-CN` or `zh-Hans`), `source_fingerprint` and `review_status`. Reviewed units require a real `reviewed_at` date. The map/node/journey paths are the maintained [language annotation paths](skill-map.md#text-language-annotations-map-input-110); relations support only `note`. Official descriptions remain exact source text; the retained Chinese assets can deliberately keep English proper names or official prose with `language: en`.

`skillMapTranslationUnits(mapId, owner)` derives SHA-256 fingerprints from canonical prose and the complete owner, excluding language annotations and map-owned node/journey/relation collections. A step, vector, identity, reference, sibling prose or ordering change invalidates the owner's units. Historical indexed paths within a registered prose family can remain after source removal; they are never written into a current projection unless a real current descriptor exists. Invented identity/source paths are always rejected. Syntactic historical validity does not certify translation provenance.

The initial migration retains all original Chinese prose and language annotations. `provenance.original_sha256` records the SHA-256 of the original parsed owner JSON; `retained_at` records the migration date. The full publication audit records the reviewed English wording, original Git revision and corrections. Retention preserves the previously accepted edition; it does not claim new upstream source verification.

## Resolution and publication

`readCatalog` reads `skillMapTranslations`; `validateCatalog` checks their owners and prose paths. The Astro translation loader uses this same boundary and watches the complete data root. Missing asset directories are empty only for `ENOENT`; other enumeration failures propagate. `resolveSkillMaps` clones canonical records, publishes only current reviewed Chinese units, and otherwise uses current canonical prose with its actual language. It returns owner units, coverage and core eligibility, plus relation-note language keyed by relation identity.

Map core eligibility requires reviewed/current title, summary and scope. Node/journey detail eligibility additionally requires its own reviewed/current title and summary. Map directories and structure pages use the map core; the all-map directory requires every displayed map core. Partial fields remain available with accurate language and coverage. Missing core causes Chinese noindex and English canonical; eligible Chinese pages have self-canonical and real `en`, `zh-CN`, `x-default` alternates. The sitemap consumes this same rendered policy.

`getSkillMaps(locale)` feeds overview, directory, node, journey and field search projections. All map links preserve deployment base, locale and stable IDs. Relation notes use their own resolved language. English requests and machine exports read canonical records directly. The one-time English canonical migration changes the dataset content digest; later Chinese-only edits leave canonical exports and their format version unchanged.

## Verification

Run the checks in [Contributing](../../CONTRIBUTING.md#validation). `tests/skill-map-translations.test.mjs` covers full retained-owner coverage, draft/stale fallback, reordered journey steps, source/topology rejection, duplicate filesystem owners and canonical normalization invariance. `npm run verify:i18n` is a release gate, separate from fixture tests: it rejects incomplete reviewed/current coverage and checks every inventoried built language page. The Pages workflow runs it before browser verification and deployment. `npm run verify:online -- <base>` checks served pages against the same current resolver, including every node and journey; HTTP success alone is insufficient.
