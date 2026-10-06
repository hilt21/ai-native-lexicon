# L2-08 verification

Issue: #14. Parent: `ed5cc29eb118a7d05ef5f42339945b7c4af6a135` (merged L2-07; source tree identical to `826a8f25`).

## Requirement evidence

| Requirement | Executed result |
| --- | --- |
| Preserve existing public layer targets | Five YAML records retain the original names, order and exact `layer-purpose-governance`, `layer-structure-representation`, `layer-dynamics-control`, `layer-cognition-action`, `layer-runtime-trust` anchors. |
| Add only layer YAML | Integration adds a `.yml` layer with an explicit anchor different from a name-derived slug, generates schemas and runs check/test/build. Navigation and a section appear without source changes. |
| Empty layer then first member | Empty section displays `00 primitives`. Adding one Primitive YAML produces `01 primitives`, its own filename anchor/detail link, and a detail backlink to the configured layer anchor under `/ai-native-lexicon/`. |
| Reject invalid data | Reader tests reject duplicate name/anchor/order, bad anchors, blank names and unknown fields. The integration rejects unknown Primitive layers. |
| Keep navigation targets distinct | Layer validation checks the combined section/heading ID namespace. Catalog regressions reject Primitive filenames equal to a layer section or heading ID. Page and validators share the heading-ID rule. |
| Keep categories working | The complete category expansion integration still passes, including empty configuration, first member, ordered grids and dynamic counts. |

## Commands and results

Executed 2026-10-06 using Node 24.19.0 and the unchanged lockfile in the isolated checkout:

- `npm run schema:generate`: three schemas generated; committed schema bytes unchanged because the existing names and order were preserved.
- `npm run check`: 0 errors, warnings or hints; 84 Concepts, 42 Primitives, 20 Cards.
- `npm test`: 54 passed.
- `npm run build`: 152 pages plus Pagefind at the production base.
- `npm run test:extension`: 11 passed, including new layer expansion and category regression.
- All 336 production artifacts match the L2-07 baseline, except `dataset.json.generated_at`; all 152 HTML files are byte-identical.

The public reader and YAML-to-page seams were implemented red before green. Review found a valid new anchor could collide with an existing generated heading ID. A failing regression reproduced this; shared heading-ID ownership and namespace validation fixed it. Standards and Spec re-reviews report no remaining findings. The Spec reviewer independently ran the canonical check.

Category and layer configuration reuse one small direct-YAML reader. Existing Primitive ownership/priority rules and all formal content records are unchanged; no generic plugin registry, Skill Map schema, new UI styling or L3/L4 pipeline is introduced.

Delivery follows CI success, merge into `master`, then Issue closure before the next ticket. Fixtures remain isolated and are discarded.
