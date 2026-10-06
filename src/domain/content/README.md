# Content input boundary

Concepts now use this boundary in Astro, CLI validation and their generated portable schema. Primitive and Speaking Card production contracts remain on the L2-02 bridges until L2-04 and L2-05. Their temporary overlap is intentional; canonical-data tests check field compatibility during the transition.

`conceptInputSchema`, `primitiveInputSchema`, and `speakingCardInputSchema` remain separate contracts. Speaking Cards are the current stored format for speaking guides, a kind of application resource. No common resource payload or Skill Map schema is introduced here.

Concept and Primitive input `added` values must be real ISO calendar date strings (`YYYY-MM-DD`). Input contracts produce strings. The Concept Astro adapter converts its validated date to a UTC `Date` for existing pages and exports. Its loader retains glob discovery and watching while using the CLI's YAML parser, so quoted and unquoted dates follow the same input rules. Each load reparses Concept records because glob's YAML digest does not track extracted contract changes; the other collections retain their existing cache behavior.

Concept `sources` defaults to `[]`. Unknown fields, duplicate relationship references and invalid filename slugs are rejected. Text limits count Unicode code points; source URIs use the same standard URI validator as portable-schema tests. These choices close actual differences between JavaScript string/URL behavior and JSON Schema acceptance without changing existing canonical values.

`npm run schema:concept` generates the Concept portable schema from the input contract using `io: 'input'`. This keeps omitted defaults optional. The generator retains Zod's default rejection of unrepresentable types, and tests exercise the written schema with [Ajv's format validation](https://ajv.js.org/guide/formats.html). Primitive and Speaking Card exports in preparation tests remain temporary.

`readConceptInputs(directory)`, `readPrimitiveInputs(directory)`, and `readSpeakingCardInputs(directory)` accept a filesystem path or file URL. Without an argument they use the corresponding canonical directory. They return `{ files, records, errors }`:

- `files` lists direct `.yaml`/`.yml` filenames in lexical order.
- Each valid record contains `{ slug, file, data }`; the filename stem remains its slug. Speaking Card records sort by their unique `data.number`, preserving gaps and existing anchors.
- `errors` contains file and field diagnostics. Nested YAML is reported but never parsed as a direct record. Non-YAML files are ignored.

Consumers must reject a directory result with any errors before publishing or applying its records. Valid records remain in the result to support diagnosis; this is not approval of a partial catalog. Filesystem failures to enumerate a directory propagate to the caller. `validateConceptDirectory` uses the shared reader, then validates concept targets, self-links and duplicate terms. The existing primitive validator continues to check primitive targets and required defining-concept backlinks.
