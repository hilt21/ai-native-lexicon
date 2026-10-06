# Contributing

Contributions should make the vocabulary more useful, precise, and inspectable. A good entry helps a practitioner name a system property, make a decision, or identify a failure mode.

## Before proposing a term

Check whether the idea is already represented under a different name. Prefer improving an existing boundary over adding a near-synonym. New terms should be used or useful beyond one product, company, or implementation.

## Entry requirements

Create one kebab-case YAML file in `src/data/concepts/`. Every entry must include:

- a concise English term and Chinese name;
- exactly one category supported by `src/domain/content/concept-input.mjs`;
- a maturity status: `foundational`, `emerging`, `evolving`, or `contested`;
- an original working definition that states the concept's boundary;
- why it matters, when to use it, and a concrete anti-pattern;
- two to six unique, valid related-concept slugs;
- a `primitives` array of unique, valid primitive slugs (empty is allowed); do not use free-form `tags`;
- an `added` value containing a real ISO calendar date (`YYYY-MM-DD`);
- optional sources only when they directly support origin, usage, or a factual claim.

Do not fabricate a first use, author, or citation. The lexicon may define a useful working term without claiming who coined it.

Concept inputs reject unknown fields. Omitted `sources` becomes `[]`; each provided source needs a title and an absolute URI. Text length limits count Unicode code points, consistently with the portable schema. Source URIs must encode spaces and use valid percent escapes.

When adding a category, update the category enum in `src/domain/content/concept-input.mjs` and the presentation metadata in `src/lib/catalog.ts`, then run `npm run schema:concept` and the full verification suite. Reuse existing concept slugs when updating or reclassifying entries.

## Primitive entries

Follow [the primitive content guide](./docs/primitives.md). Use `definitions: [{ concept: existing-slug }]` when a definition is already canonical in a concept. Add inline definitions only for new meanings. Referenced concepts must include the primitive in their `primitives` array. `related` on a primitive points to other primitives, not concepts; reverse concept links are derived automatically.

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

`npm run check` applies the same Zod schema used by the website and verifies cross-record relationships. Pull requests run the complete pipeline without deploying.

After changing Concept field rules, run `npm run schema:concept` to regenerate `schemas/concept.schema.json`. Tests compare the actual field decisions of the Astro adapter, CLI validator and JSON Schema validator. Primitive and Speaking Card contracts remain on their existing migration bridges.

For data-expansion or edit-link changes, also run `npm run test:extension`. It adds one record of each type in an isolated copy, runs the full checks and build, and verifies rendered edit links without modifying canonical data.

GitHub edit links use the `master` content branch by default. Set `CONTENT_BRANCH` when the canonical files live on another branch; this applies to both concept pages and Starlight documentation links.

## Scope of changes

Keep pull requests focused. Do not mix a terminology proposal with unrelated styling, dependency, or architecture changes. When changing a definition, explain the practical ambiguity the change resolves.
