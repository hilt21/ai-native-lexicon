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

Concept `aliases` is optional and defaults to `[]`. Use independently edited English alternative names; aliases are trimmed, nonblank and unique ignoring case, and must differ from the record's `term` and `zh` ignoring case. Alias syntax and exact uniqueness are represented in the portable schema; normalized uniqueness and sibling-name comparisons require the shared Node/CLI/Astro input boundary. Always use `readCatalog` followed by `validateCatalog` before publishing portable-schema inputs. Adding an alias changes the canonical content digest and exports it in `dataset.json`.

Concept `examples` and `distinguish_from` are optional ordered arrays, defaulting to `[]`. Each example is a strict `{ context, example }` object with nonblank English prose; examples are editorial illustrations, not fact certification. Each distinction is a strict `{ target, distinction }` object with an existing Concept slug and nonblank English prose. Targets cannot be self references or repeated (even with different prose). Portable JSON Schema checks shapes, slug syntax and nonblank strings; target existence, self comparison and target uniqueness require `readCatalog` plus `validateCatalog`. Preserve editorial order in exports and the content digest. Detail pages resolve target titles, related summaries and referenced Primitive definitions from canonical records. Copy definition copies the displayed body, with an individually named action for each Primitive definition; A–Z neighbors use canonical English titles then slugs within the same type.

Before changing canonical knowledge, obtain explicit Editorial Acceptance for the concrete proposal, separately from structural validation or evidence verification; see [ADR-0002](docs/adr/0002-editorial-acceptance-and-evidence.md). Source reviews must state support and limits; retain unverified material honestly. The [Issue 38 bounded pilot](docs/audits/issue-38-evidence-review.md) records one accepted change, not standing approval for future content.

To add a category, create one direct `.yaml` or `.yml` record in `src/data/taxonomy/categories/` with `name`, `slug`, `code`, `description`, `question` and a unique positive integer `order`. The name is the existing Concept reference value; the slug is its public URL. Keep both stable. Records display by `order`, which is not a public identity. Run `npm run schema:generate`, then the full verification suite and `npm run test:extension`; derived JSON schemas are generated, never hand-edited. A configured category may have zero members: its route remains available and shows zero. Adding its first Concept requires only a new Concept YAML record. Unknown category names and duplicate names/slugs/orders are rejected. Reuse existing concept slugs when updating or reclassifying entries. Restart a running dev server after taxonomy changes so its loaded input contracts refresh.

## Primitive entries

Follow [the primitive content guide](./docs/primitives.md). Use `definitions: [{ concept: existing-slug }]` when a definition is already canonical in a concept. Add inline definitions only for new meanings. Referenced concepts must include the primitive in their `primitives` array. `related` on a primitive points to other primitives, not concepts; reverse concept links are derived automatically.

Primitive inputs reject unknown fields, blank text and duplicate `related` references. Definitions, considerations and sources must be nonempty; ownership, priority and source status use the existing vocabularies. Source URLs must be absolute HTTP(S) URIs with a hostname or explicit IP address, a port from 0 through 65535 when supplied, encoded spaces and valid percent escapes. Numeric IPv4 hosts use four decimal octets; IPv6 hosts use brackets. `added` must be a real `YYYY-MM-DD` calendar date. Field rules live in `src/domain/content/primitive-input.mjs`; the Astro adapter retains UTC Date values and trimmed text for existing projections.

To add a Primitive layer, create one direct `.yaml` or `.yml` record in `src/data/taxonomy/layers/` with `name`, `anchor` and a unique positive integer `order`. The name is the existing Primitive reference value; the explicit `layer-*` anchor is a public target and stays stable independently of the display name. Run `npm run schema:generate` and the full checks plus `npm run test:extension`. Empty configured layers are valid and display zero members. Add a member through Primitive YAML using the configured name. Duplicate names/anchors/orders, bad anchors, unconfigured layers and Primitive filename slugs colliding with layer anchors or generated heading IDs are rejected. Layer anchors must also stay distinct from other layers’ generated heading IDs. Priority and ownership vocabularies are unchanged.

## Editorial test

A reviewer should be able to answer yes to each question:

1. Does this name a distinct and reusable idea?
2. Does the definition say what is inside and outside the concept?
3. Does the entry help someone make or critique a design decision?
4. Is the maturity label honest about consensus?
5. Do the relationships form useful paths through the lexicon?

## Brand and interface changes

For brand identity, colors, graphics, patterns, icons or branded applications, read the [brand visual language](docs/design/brand/visual-language.md) and the relevant source board. For website layout, styling or interaction, also read the [editorial design system](docs/design/redesign-system.md). Use actual project content in application examples and follow [Validation](#validation) for the affected implementation; brand-reference documentation alone does not establish rendered behavior.

## Validation

After data, schema, validation, route, component, configuration or styling changes, run:

```sh
npm run check
npm test
npm run build
```

`npm run check` first checks portable-schema drift without rewriting files, then applies the same Zod input contracts used by the website and verifies all catalog relationships. Pull requests run the complete pipeline without deploying.

After changing field rules or taxonomy, run `npm run schema:generate` to regenerate all registered portable schemas. The generator registry in `scripts/content-schemas.mjs` owns the schema inventory; individual generation commands are in `package.json`. `npm run schema:check` only compares committed schemas and exits nonzero with a filename when they drift. Tests compare the actual field decisions of the Astro adapter, CLI validator and JSON Schema validator; use the complete shared catalog boundary for checks beyond portable field shapes.

Additional checks depend on the affected contract; apply every matching row:

| Change | Required additional verification |
| --- | --- |
| Data, taxonomy, Skill Maps or edit links | `npm run test:extension`: isolated contract/projection regressions. |
| Collections, identities or projections | `npm run test:l2`: repeatable production-subpath expansion; include `-- --browser` for interaction/language projections and the CI scenario below. |
| Layout, styling, search, map interaction or language projections | `npm run test:browser`: production `/ai-native-lexicon` with Pagefind enabled. Inspect changed-page screenshots in both themes at narrow/wide widths; check keyboard focus, computed contrast and actual BFCache/reload restoration. |
| Translation input, schema, data or projections | Extension, L2 with `-- --browser`, and production browser suites; see [translation overlays](#translation-overlays). |

Run fixture suites serially. Source assertions alone do not establish rendered behavior. Record unavailable screen-reader or actual 400% zoom sessions as unverified; narrow reflow is a separate check. Derive counts and versions from current data/configuration, not audit totals.

Documentation-only edits require checking referenced paths, commands and implementation consistency; they do not require a site rebuild.

## Repeatable L2 expansion acceptance

Add records to the existing direct YAML collections. Concept and Primitive filename slugs, category slugs, layer anchors and Speaking Guide numbers are public identities: preserve them when editing. Update inbound references before removing a target. Relationship lists and backlinks are generated from canonical references, never maintained in a second index.

Speaking Guide and Skill Map are independently curated **Application Resources**, with separate implemented contracts and **Content Projections**. Speaking Cards are the current Guide projection; map pages query assembled map records. A new resource type still needs its own approved schema, readers, validation and projections; see [ADR-0006](docs/adr/0006-application-resources-and-projections.md).

For a new category or layer, add its YAML configuration first, then run `npm run schema:generate`. This generates portable enums from configuration; do not hand-edit JSON or duplicate vocabularies in page code. An empty category/layer can publish before members arrive. Add Concepts, Primitives and Guides using the shared contracts and meaningful references, then run the required checks above.

Run the combined production-subpath acceptance:

```sh
npm run test:l2
```

It builds a baseline, creates an empty category and layer, generates portable schemas, adds one Concept with aliases, examples and distinctions, one Primitive, one Speaking Guide and an independent Skill Map with a node, retired node and journey, and runs check/test/build. It also verifies translation overlays and translation-only export invariance as described below. It validates records through the public Node catalog and portable schemas, checks rendered projections, preserves every baseline HTML route/ID, and resolves internal navigation links. Invalid references, duplicate identities, unknown taxonomy and schema drift must fail. Source and existing records are compared byte-for-byte; temporary records are removed even on failure. Run it twice to confirm repeatability.

Local callers can omit the browser flag for catalog/build checks. CI includes the browser portion of the same expansion scenario:

```sh
npx playwright install chromium
npm run test:l2 -- --browser
```

This runs the same full scenario and adds real Chromium interaction at 1440px and 390px: title/idea, English/Chinese related-name and alias search, all six types, exact/prefix/other-field ranking, match explanations, retained records, real Pagefind queries, no results, clearing, guide notes, canonical examples/distinctions, real clipboard success/failure, associated navigation and horizontal overflow checks. Evidence is written to `output/playwright/l2-10/` as JSON reports and screenshots. The fixture uses the GitHub Pages `/ai-native-lexicon` base. Reports are execution evidence, not formal content; inspect screenshots when presentation changes. CI runs `test:l2 -- --browser`, the smaller extension regressions and the production browser suite before deployment. See [the L2 verification record](docs/audits/l2-10-verification.md) for actual runs.

If Chromium downloads are unavailable and Google Chrome is already installed, run `PLAYWRIGHT_CHANNEL=chrome npm run test:l2 -- --browser` instead. The same assertions run against the installed browser; the evidence report records its version.

L2 verifies structured YAML expansion. It does not ingest raw articles, generate proposals, approve knowledge changes or implement the planned L3/L4 governance workflow.

GitHub edit links use the `master` content branch by default. Set `CONTENT_BRANCH` when the canonical files live on another branch; this applies to both concept pages and Starlight documentation links.

## Skill Maps

Create `src/data/skill-maps/<map-id>/map.yaml`, `relations.yaml`, `nodes/` and `journeys/`. Map, node and journey filename slugs are stable identities. Modify independent YAML records rather than pages or indexes. Map-local taxonomy defines types, optional layers/clusters and relationship labels; empty collections/layers and principles without input/output are valid.

Use the [field/display contract](docs/design/skill-map.md). Map text must be nonblank without surrounding whitespace; inputs do not silently trim it. Strict input rules live in `src/domain/content/skill-map-input.mjs`; fixed directory assembly and internal reference checks are shared by the CLI and Astro. Follow [Validation](#validation) for schema generation and checks.

Relationships belong only in `relations.yaml`; handoffs are explanatory text. Journeys express guidance, reasons, conditions, optional steps and expected outputs, not execution or authority. Before accepting public content pin source commits and verify inventory/official descriptions, separately from editorial interpretations. Preserve applicable upstream license and copyright notices. New commits get new source IDs; preserve old snapshots still referenced by retired records. `current_sources` selects current snapshots. During update review use `validateSkillMapSnapshotChanges(previousRecords,currentRecords)` to detect repointed source IDs; a single schema parse cannot prove historical immutability. Pending sources are valid development inputs but rejected by publication checks.

Rename a title without renaming its ID. Retire removed entries with status/retirement_note and an optional confirmed active replaced_by. Adjust active journeys to remove retired recommendations; old detail routes and sources remain available. New maps appear automatically across pages, Search, JSON and LLM navigation. Concept/Primitive/Speaking Guide mapping remains a future contract: do not add knowledge_refs before its validation and projections are activated.

## Scope of changes

Keep pull requests focused. Do not mix a terminology proposal with unrelated styling, dependency, or architecture changes. When changing a definition, explain the practical ambiguity the change resolves.

Speaking Guides use `src/data/speaking-cards/*.{yaml,yml}` and `src/domain/content/speaking-card-input.mjs`. Keep their number and `#card-XX` anchors stable. `concepts` and `primitives` contain only unique existing slugs; empty arrays are valid when there is no direct relationship. Keep definitions in their knowledge records and derive card backlinks from these references. Add notes in the existing `keyLines` and `realCase` arrays, with nonblank text. Shared readers preserve numeric ordering and reject duplicate numbers.

The public Node boundary is `readCatalog(directory?)` followed by `validateCatalog(catalog)` in `src/domain/content/catalog.mjs`; it has no Astro runtime dependency. A directory argument points to the data root containing `concepts/`, `primitives/` and `speaking-cards/`. Always reject any returned errors before publishing or applying records. See [the boundary documentation](src/domain/content/README.md) for input/output and directory rules.

### Skill Map language editing

Use the [Text language annotations contract](docs/design/skill-map.md#text-language-annotations-map-input-110) for multilingual prose. Add hints only for maintained text; keep canonical strings, identities and source snapshots. Change the owning map edition to 1.1.0 when adding annotations and maintain indexed paths when lists move. CLI and Astro share path/edition validation. Follow [Validation](#validation); the browser suite writes a manifest/screenshots under ignored `work/` by default.

## Translation overlays

Maintain independent YAML assets under `src/data/translations/` using [the translation contract](docs/design/translation-overlay.md). Targets use Concept/Primitive slugs, category public slugs or layer public anchors. The only overlay locale is `zh-CN`; public page routes use `zh-cn` after the deployment base. UI dictionary changes belong in `src/lib/locale.ts`, separately from knowledge translations.

Start generated translations as `draft`. Obtain source fingerprints from `translationUnits` using canonical data returned by the shared `readCatalog` boundary. Confirm the exact translated prose and its source with the editor before setting `review_status: reviewed` and the actual review date. A fingerprint update requires renewed source/translation review; a stale unit remains valid historical input and displays current English. Translation review does not verify the underlying knowledge or its sources.

Follow [Validation](#validation). L2 includes an absent-overlay baseline, complete/partial/draft/stale overlays, invalid CLI/Astro boundaries, historical array/definition-branch mutations, localized HTML/Pagefind/browser checks, and translation-only canonical export equality. The production browser suite covers English and Chinese routes, 390/1440 widths, both themes, current/fallback Copy, native language selection with destination fragments, SEO, Chinese shells and actual BFCache/reload restoration. Use `WEB_EVIDENCE=/absolute/output/path` for the production browser suite and `L2_EVIDENCE=/absolute/output/path` for L2 to place evidence outside the repository.
