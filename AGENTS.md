# Agent guidance

This is a data-first lexicon. Concepts and Primitives are knowledge records; Speaking Guide and Skill Map are independently curated Application Resources. Pages, search, backlinks and machine exports are Content Projections. Keep their contracts separate and derive projections from validated canonical records; see [ADR-0006](docs/adr/0006-application-resources-and-projections.md).

## Always preserve

- Stable public identities: record filename slugs, category slugs, layer anchors, map-scoped node/journey IDs and Speaking Guide numbers/`#card-XX`. Update inbound references when removing a target; derive backlinks from the owning references.
- Deployment and locale paths: use `pathWithBase` for canonical root links, `localePath` for localized reader routes, and `mapLink` with the requested locale for Skill Maps. Local fragments are valid for same-page navigation.
- Independent judgments: Editorial Acceptance, Evidence Verification and translation review have separate meanings. Preserve source status and scope; obtain explicit acceptance of concrete knowledge or reviewed translation changes.

## Read before changing

- **Records or taxonomy:** [Contributing](CONTRIBUTING.md#entry-requirements) for editing and relationship rules; [content boundary](src/domain/content/README.md) for shared CLI/Astro inputs, validators and schema generation. Primitive-specific semantics are in [Primitive content](docs/primitives.md).
- **Translation, locale routes or publication metadata:** [overlay contract](docs/design/translation-overlay.md) and [ADR-0011](docs/adr/0011-canonical-prose-and-translation-assets.md). English Canonical and reviewed/current overlays share one resolver; exports retain canonical data.
- **Skill Map data, sources or UI:** [map contribution workflow](CONTRIBUTING.md#skill-maps) and [field/display contract](docs/design/skill-map.md). Each map owns its taxonomy, relations and source snapshots. For Matt Pocock inventory, distribution or invocation changes, also read [its source audit](docs/audits/skill-map-mp-01.md).
- **Layout, styling or interaction:** [editorial design system](docs/design/redesign-system.md), then the affected components. Reuse semantic tokens and native Starlight navigation, theme, focus, skip links and reduced-motion behavior.
- **Search or machine exports:** [export contract](docs/exports.md) for record/page scopes, deterministic normalization and deliberate export version changes.
- **Domain terms or architecture:** [domain guidance](docs/agents/domain.md), root [GLOSSARY.md](GLOSSARY.md) and relevant [ADRs](docs/adr/).
- **Tickets or specs:** [issue tracker](docs/agents/issue-tracker.md); for triage, use [label mapping](docs/agents/triage-labels.md). Tracker configuration does not authorize external writes.

## Completion

Follow [verification requirements](CONTRIBUTING.md#validation) for the affected branches, including rendered production-subpath evidence when required. Documentation-only changes require checking links, commands and consistency with current implementation. Derive counts and versions from data/configuration; historical audits are evidence of earlier runs.
