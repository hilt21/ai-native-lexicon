# Contributing

Contributions should make the vocabulary more useful, precise, and inspectable. A good entry helps a practitioner name a system property, make a decision, or identify a failure mode.

## Before proposing a term

Check whether the idea is already represented under a different name. Prefer improving an existing boundary over adding a near-synonym. New terms should be used or useful beyond one product, company, or implementation.

## Entry requirements

Create one kebab-case YAML file in `src/data/concepts/`. Every entry must include:

- a concise English term and Chinese name;
- exactly one category name configured in `src/data/taxonomy/categories/`;
- a maturity status: `foundational`, `emerging`, `evolving`, or `contested`;
- an original working definition that states the concept's boundary;
- why it matters, when to use it, and a concrete anti-pattern;
- two to six unique, valid related-concept slugs;
- a `primitives` array of unique, valid primitive slugs (empty is allowed); do not use free-form `tags`;
- an `added` value containing a real ISO calendar date (`YYYY-MM-DD`);
- optional sources only when they directly support origin, usage, or a factual claim.

Do not fabricate a first use, author, or citation. The lexicon may define a useful working term without claiming who coined it.

Concept inputs reject unknown fields. Omitted `sources` becomes `[]`; each provided source needs a title and an absolute URI. Text length limits count Unicode code points, consistently with the portable schema. Source URIs must encode spaces and use valid percent escapes.

To add a category, create one direct `.yaml` or `.yml` record in `src/data/taxonomy/categories/` with `name`, `slug`, `code`, `description`, `question` and a unique positive integer `order`. The name is the existing Concept reference value; the slug is its public URL. Keep both stable. Records display by `order`, which is not a public identity. Run `npm run schema:generate`, then the full verification suite and `npm run test:extension`; derived JSON schemas are generated, never hand-edited. A configured category may have zero members: its route remains available and shows zero. Adding its first Concept requires only a new Concept YAML record. Unknown category names and duplicate names/slugs/orders are rejected. Reuse existing concept slugs when updating or reclassifying entries. Restart a running dev server after taxonomy changes so its loaded input contracts refresh.

## Primitive entries

Follow [the primitive content guide](./docs/primitives.md). Use `definitions: [{ concept: existing-slug }]` when a definition is already canonical in a concept. Add inline definitions only for new meanings. Referenced concepts must include the primitive in their `primitives` array. `related` on a primitive points to other primitives, not concepts; reverse concept links are derived automatically.

Primitive inputs reject unknown fields, blank text and duplicate `related` references. Definitions, considerations and sources must be nonempty; ownership, priority and source status use the existing vocabularies. Source URLs must be absolute HTTP(S) URIs with a hostname or explicit IP address, a port from 0 through 65535 when supplied, encoded spaces and valid percent escapes. Numeric IPv4 hosts use four decimal octets; IPv6 hosts use brackets. `added` must be a real `YYYY-MM-DD` calendar date. Field rules live in `src/domain/content/primitive-input.mjs`; the Astro adapter retains UTC Date values and trimmed text for existing projections.

## Editorial test

A reviewer should be able to answer yes to each question:

1. Does this name a distinct and reusable idea?
2. Does the definition say what is inside and outside the concept?
3. Does the entry help someone make or critique a design decision?
4. Is the maturity label honest about consensus?
5. Do the relationships form useful paths through the lexicon?

## Validation

Run all checks before opening a pull request:

```sh
npm run check
npm test
npm run build
```

`npm run check` first checks portable-schema drift without rewriting files, then applies the same Zod input contracts used by the website and verifies all catalog relationships. Pull requests run the complete pipeline without deploying.

After changing field rules, run `npm run schema:generate` to regenerate all three portable schemas (or a corresponding `schema:concept`, `schema:primitive`, `schema:speaking-card` command). `npm run schema:check` only compares committed schemas and exits nonzero with a filename when they drift. Tests compare the actual field decisions of the Astro adapter, CLI validator and JSON Schema validator. Concept and Primitive portable schemas are generated from their shared input contracts. Speaking Cards use the same shared input boundary; run `npm run schema:speaking-card` after changing their fields.

For data-expansion or edit-link changes, also run `npm run test:extension`. It adds one record of each type in an isolated copy, runs the full checks and build, and verifies rendered edit links without modifying canonical data.

GitHub edit links use the `master` content branch by default. Set `CONTENT_BRANCH` when the canonical files live on another branch; this applies to both concept pages and Starlight documentation links.

## Scope of changes

Keep pull requests focused. Do not mix a terminology proposal with unrelated styling, dependency, or architecture changes. When changing a definition, explain the practical ambiguity the change resolves.

Speaking Guides use `src/domain/content/speaking-card-input.mjs`. Keep their number and `#card-XX` anchors stable; references may be empty but cannot repeat. Add new notes in the existing `keyLines` and `realCase` arrays, and keep all text nonblank. Shared readers support direct `.yaml` and `.yml` records, preserve numeric ordering and reject duplicate numbers.

The public Node boundary is `readCatalog(directory?)` followed by `validateCatalog(catalog)` in `src/domain/content/catalog.mjs`; it has no Astro runtime dependency. A directory argument points to the data root containing `concepts/`, `primitives/` and `speaking-cards/`. Always reject any returned errors before publishing or applying records. See [the boundary documentation](src/domain/content/README.md) for input/output and directory rules.
