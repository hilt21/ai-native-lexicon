# Agent guidance

This repository is a data-first lexicon. Treat `src/data/concepts/*.yaml` as the canonical source and every rendered surface as a projection.

## Invariants

- Keep the runtime thin: do not add a database, client framework, or generator unless the existing content collection cannot satisfy a demonstrated requirement.
- Never duplicate concept records into Markdown pages or handwritten indexes.
- Preserve stable filename slugs; they are public identifiers and relationship targets.
- Add fields first to `src/content.config.ts`, then mirror them in `schemas/concept.schema.json`, validation, tests, and documentation.
- All `related` slugs must resolve. Do not remove a concept without updating inbound relationships.
- Do not claim that a person or organization coined a term without a direct source.
- Keep changes surgical and follow the established visual and content style.

## Required verification

For concept-only changes, run `npm run check` and `npm test`. For code, configuration, dependency, or styling changes, also run `npm run build`.

## Architecture direction

Concept Graph, Timeline, and additional machine-readable formats should read from the existing `concepts` collection. Prefer a new projection over a new source of truth.
