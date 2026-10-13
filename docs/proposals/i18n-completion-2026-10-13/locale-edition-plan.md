# Skill Map locale-edition migration plan

Ready input: the complete English candidate and current accepted original Chinese edition. Runtime activation follows concrete English wording review. Until activation, proposals remain outside canonical ingestion and exports.

## Shared ownership

1. Preserve a byte-exact snapshot of the current map prose before replacing canonical prose with accepted English. Verify every map/node/journey identity, taxonomy ID, relation tuple, variant ID, step node reference, ordering and optional flag. Source snapshots and official descriptions retain original values.
2. Canonical English owns identities, topology and source references. A Chinese translation asset owns prose only, including taxonomy display labels and relation notes. Derive both reader projections and search from this shared boundary. Avoid two independently editable graph editions.
3. Key overlay owners by map ID and stable record ID; relation notes use `(from, type, to)`. For ordered variants, steps and vectors, bind a fingerprint to the complete owning structure so reordering cannot reattach wording silently. Only supported prose paths are writable.
4. Preserve original Chinese text with explicit migration provenance and current English-source fingerprints. Treat retention of previously accepted original prose separately from claiming new translation review. Record the original snapshot/hash and the migration acceptance basis; any newly edited Chinese text follows the draft/review process.
5. Keep canonical exports on English and omit locale-overlay state from canonical normalization. Switching canonical prose legitimately changes the content digest; later Chinese-only edits must leave canonical exports invariant. Stable public URLs and IDs remain unchanged.

## Resolver and publication

- English requests use accepted English canonical prose. Chinese requests use current accepted overlay text and fall back per field with its actual language. Use the same resolved records for map/node/journey pages, directory filtering, Search, Copy where applicable, metadata and language annotations.
- Replace the original-language edition notice only when its policy is superseded by this contract. Gate Chinese canonical/alternate/indexability on reviewed/current core prose for the particular page, with coverage shown independently from complete prose. Derive sitemap eligibility from the same metadata policy.
- Preserve requested locale through map links and valid fragments. Relation-note language belongs to the resolved note rather than a single map-wide scope tag.

## Minimum acceptance seams

| Seam | Required result |
| --- | --- |
| Catalog/schema | Reject topology/identity overrides, unknown prose paths, duplicate scoped owners, stale or misaligned vectors and repointed source snapshots |
| Shared resolver | English/original-Chinese parity after migration; draft and stale fallback; actual field language; no canonical mutation |
| Exports | Accepted English canonical digest changes once; Chinese-only edits leave canonical exports invariant |
| Production-subpath build | Every existing route/reference remains accessible; HTML language, metadata and sitemap agree with eligibility |
| Browser/Cloud Browser | English and Chinese overview/node/journey pages display the correct edition; directory/search use the same prose; language switch preserves valid destinations; save screenshots and errors for the tested revision |

No browser result from the current production edition validates this future migration. Retain screen-reader, actual 400% zoom and social-platform acceptance as separate online evidence.
