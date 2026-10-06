# L2-05 verification

Issue: #11. Parent: `4f1b40705625432f8a98b90e056d9e2f9b85f03c` (L2-04).

The shared Speaking Card input contract now owns field validation for Astro, the CLI reader and generated portable schema. References may be empty, but duplicates and unsupported slugs are rejected. Existing file names, numbers, anchors, sorting and components are preserved.

## Automated evidence

Verified on 2026-10-06 with Node 24.19.0 in an isolated, lockfile-consistent checkout:

- `npm run check`: zero errors, warnings or hints; 84 Concepts, 42 Primitives, 20 Speaking Cards validated.
- `npm test`: 48 passed. Contract samples run against runtime, CLI and Ajv/portable schema; malformed YAML and duplicate numbers are rejected.
- `npm run build`: 152 pages and Pagefind produced under the production `/ai-native-lexicon` base.
- `npm run test:extension`: 8 passed. A new direct `.yml` card appears automatically, retains existing anchors and produces backlinks on both referenced detail pages. Invalid number/notes fail. Parallel projects cannot contaminate each other's content cache.
- Compared all 336 production artifacts to the pre-migration build: byte-identical except `dataset.json.generated_at`, whose normalized JSON is identical. The formal YAML records are unchanged.

The build comparison uses `GITHUB_ACTIONS=true`, `GITHUB_REPOSITORY=hilt21/ai-native-lexicon`, `GITHUB_REPOSITORY_OWNER=hilt21`, `BASE_PATH=/ai-native-lexicon`, `CONTENT_BRANCH=master`. Setting Astro `cacheDir` to the project's `.astro/cache` isolates fixtures sharing installed dependencies; this fixes an observed cross-project cache contamination during verification.

## Real browser evidence

Chrome loaded a separate production-base build with only `l2-browser-guide.yml` added (number 27, title `L2 Browser Guide`, referencing Concept `context` and Primitive `context`). The fixture is not part of canonical data.

| Viewport | Notes interaction | Associated navigation | document scroll width |
| --- | --- | --- | --- |
| 1440 × 960 | Native disclosure clicked, `details.open=true` | Concept Context opens `/ai-native-lexicon/concepts/context/`; backlink targets `#card-27` | 1425, no horizontal overflow |
| 390 × 844, mobile/touch | Native disclosure clicked, `details.open=true` | Primitive Context opens `/ai-native-lexicon/primitives/context/`; backlink targets `#card-27` | 390, no horizontal overflow |

Both viewports retain cards 01–20 and display the added card 27. Screenshots: [desktop](../../output/playwright/l2-05/desktop.png), [mobile](../../output/playwright/l2-05/mobile.png).

## Scope

This completes Speaking Guide contract migration. It does not introduce Skill Map payloads or L3/L4 ingestion. Delivery is a stacked PR over L2-04, with merge left pending under the current agreed workflow.
