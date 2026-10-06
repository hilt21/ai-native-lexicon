# L2-06 verification

Issue: #12. Parent: `e5dd4d33a875b405e2717413f6bfff0ed20d529f` (L2-05).

## Requirement evidence

| Requirement | Executed verification |
| --- | --- |
| One owner for fields and discovery | Three input contracts and shared direct-directory readers retained. Raw `readYamlDirectory`, old script validators and three separate generators removed; callers now use domain catalog/reference functions. Date projection adapters remain in use. |
| Deterministic portable generation | The catalog-contract test generates all three schemas twice into a temporary directory and compares exact bytes to committed files. |
| Read-only drift detection | The same test checks pristine files, corrupts each schema in turn, requires nonzero exit and its filename, verifies the corrupted bytes remain, restores and rechecks successfully. |
| Drift integrated into check/CI | `npm run check` begins with `schema:check`; CI runs this command. The integration regression corrupts `primitive.schema.json`, observes check failure, confirms no repair, restores it and observes check success. |
| Field parity and negative relationships | Existing Concept/Primitive/Speaking Guide runtime–CLI–Ajv samples pass. New catalog fixtures reject missing/self Concept links, missing Primitive/definition targets, missing definition backlinks, bad Card targets, duplicate references, unknown fields, legacy tags and broken YAML. |
| Public Node boundary without Astro | An independent `node --input-type=module` process imports `readCatalog`/`validateCatalog`, reads all three collections, validates successfully and observes string input dates. |
| No content or rendering change | Formal data remains unchanged. All 336 production artifacts match the pre-migration build, apart from `dataset.json.generated_at`; normalized dataset JSON and all 152 HTML files match. |

## Commands and results

Executed on 2026-10-06 using Node 24.19.0 and the unchanged lockfile in an isolated checkout:

- `npm run check`: 0 errors, warnings or hints; 84 Concepts, 42 Primitives, 20 Cards.
- `npm test`: 51 passed.
- `npm run build`: 152 pages plus Pagefind; production base `/ai-native-lexicon` with owner/repository `hilt21/ai-native-lexicon` and content branch `master`.
- `npm run test:extension`: existing 8 integration tests passed.
- `node --test --test-name-pattern='repository check fails on schema drift' tests/data-extension.integration.mjs`: new integration test passed, verifying the ninth scenario separately after its addition.

The catalog and schema-command seams were developed red before green. The public catalog function validates relationships of already parsed reader results and retains reader errors; raw objects must pass the input contracts first. No partial catalog may be published when errors exist.

Taxonomy still uses existing vocabularies until L2-07/L2-08. No UI changes, Skill Map schema, database or L3/L4 ingestion are included. Delivery is a stacked PR over L2-05; merge remains pending in the agreed workflow.
