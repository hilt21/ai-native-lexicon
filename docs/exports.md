# Machine-readable projections

`/dataset.json` and `/llms.txt` are generated from the canonical content collections. Concepts and Primitives remain separate top-level arrays. `speaking_cards` contains the complete concrete Speaking Card records, a stored format for Speaking Guides in the Application Resource domain category; it is not an opaque common-resource payload.

Speaking Guide identity is its positive `number`. Its canonical page target is `/speaking-card/#card-XX`, with a minimum of two digits and no renumbering. Concept/Primitive filename slugs and existing exported fields remain stable. Their `added` dates retain the existing UTC ISO datetime output. Guide references remain Concept/Primitive slugs; the export preserves original notes and empty relationships.

## Version fields

| Field | Meaning |
| --- | --- |
| `version` | Retained legacy edition metadata, currently `0.2.0`; existing consumers may continue reading it. |
| `schema_version` | Version of the dataset export shape, currently `1.1.0`, adding `skill_maps` while retaining previous arrays/fields and version/count metadata. Change deliberately when the export contract changes. |
| `dataset_version` | `sha256:` digest of normalized formal content and both taxonomy configurations. It identifies content, independently of export time or deployment location. |
| `generated_at` | UTC build timestamp. A new build may change it even when content is identical. |
| `counts` | Actual array lengths keyed by `concepts`, `primitives`, `speaking_cards`, `skill_maps`. |

The digest uses all validated record fields and category/layer metadata, sorts collection records by public identity, sorts object keys, and uses the export's JSON date/optional-field semantics. Relationship and note array order remains significant. Changing a definition, guide idea, relationship, category boundary, layer anchor or explicit order changes the digest. YAML formatting, file enumeration order, object key order, base/site and `generated_at` do not. No governance history or acceptance/verification records are invented.

`llms.txt` retains its Concept and Primitive sections and appends Speaking Guide title/core idea links with the deployment base and stable card anchor. The custom `/search/` reads the same collection and searches Guide titles, core ideas and referenced Concept/Primitive names (English/Chinese) and slugs.

After adding a valid Guide YAML, run `npm run check`, `npm test`, `npm run build` and `npm run test:extension`. No manual search/export index is maintained. Schema rule changes additionally require `npm run schema:generate`; `npm run schema:check` only detects drift. Skill Map knowledge mappings remain a future contract and are not exported in 1.1.0.

## Skill Map projections

`skill_maps` contains assembled map records with id, metadata, taxonomy, nodes, journeys and a single relationship table. Public identities use map/node/journey filename slugs. Input schema 1.0.0 is distinct from dataset export shape 1.1.0. Existing Concept/Primitive/Guide fields and date/identity semantics remain unchanged. Retired records remain exported; individual source references pin commits even after the current source changes.

Normalization sorts maps/nodes/journeys by ID, relations by `(from,type,to)`, sources by ID, source_refs by `(source,path)`, tags/secondary_clusters as sets. Taxonomy/current_sources/variants/steps and explanatory arrays preserve editorial order. Map content and taxonomy participate in dataset_version; generated_at, base/site and derived URLs do not. Changes to semantic step order change the digest, while file discovery or unordered relation order does not.

Search includes maps, nodes and journeys with their owner and marks retired entries. llms.txt adds map links and current source version/verification status; full records are available in dataset.json. No manual index, knowledge_refs or knowledge backlink projection is maintained.
