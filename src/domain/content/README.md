# Content input boundary

This is the L2-02 preparation boundary. Production collections, validators, routes, and portable schemas still use their existing contracts. L2-03 through L2-05 migrate each type separately. Temporary schema overlap is intentional; the canonical-data tests check field compatibility and the existing category/layer vocabulary during this transition.

`conceptInputSchema`, `primitiveInputSchema`, and `speakingCardInputSchema` remain separate contracts. Speaking Cards are the current stored format for speaking guides, a kind of application resource. No common resource payload or Skill Map schema is introduced here.

Concept and Primitive `added` values must be real ISO calendar date strings (`YYYY-MM-DD`). These input contracts produce strings, never JavaScript `Date` objects. Later runtime adapters may convert them where needed. `z.toJSONSchema(schema)` exports each contract with its default rejection of unrepresentable types; the tests write these exports only to a temporary directory.

`readConceptInputs(directory)`, `readPrimitiveInputs(directory)`, and `readSpeakingCardInputs(directory)` accept a filesystem path or file URL. Without an argument they use the corresponding canonical directory. They return `{ files, records, errors }`:

- `files` lists direct `.yaml`/`.yml` filenames in lexical order.
- Each valid record contains `{ slug, file, data }`; the filename stem remains its slug. Speaking Card records sort by their unique `data.number`, preserving gaps and existing anchors.
- `errors` contains file and field diagnostics. Nested YAML is reported but never parsed as a direct record. Non-YAML files are ignored.

Consumers must reject a directory result with any errors before publishing or applying its records. Valid records remain in the result to support diagnosis; this is not approval of a partial catalog. Filesystem failures to enumerate a directory propagate to the caller. Cross-record relationship validation remains with the existing validators until the subsequent migration tickets.
