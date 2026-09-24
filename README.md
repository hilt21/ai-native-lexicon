# AI Native Lexicon

> A field guide to the language of systems that can reason and act.

[**Explore the live lexicon ↗**](https://hilt21.github.io/ai-native-lexicon/) · [Browse the source](https://github.com/hilt21/ai-native-lexicon) · [Open the dataset](https://hilt21.github.io/ai-native-lexicon/dataset.json)

AI-native software brings together context, tools, permissions, memory, state, and feedback. This open lexicon gives those ideas stable, inspectable working definitions, shows how they connect, and gives teams a shared path from explanation to design conversation.

**84 concepts · 18 categories · 42 primitives · 20 Speaking Cards**

## One vocabulary, three ways to use it

- **Concepts** explain an idea: its boundary, why it matters, when to use it, and what can go wrong.
- **Primitives** make reusable design elements visible, with scope, composition examples, trade-offs, ownership, and priority.
- **Speaking Cards** turn selected ideas into material for teaching, discussion, and practice.

These are separate content types connected by explicit references. A definition stays with its Concept; a Primitive may refer to that definition or add a distinct meaning; a Speaking Card links to both without copying either.

## Follow an idea

Start with [Harness](https://hilt21.github.io/ai-native-lexicon/concepts/harness/), open the [Harness primitive](https://hilt21.github.io/ai-native-lexicon/primitives/harness/), then use [Agent Harness · Card 04](https://hilt21.github.io/ai-native-lexicon/speaking-card/#card-04) to explain and discuss the design. The same pattern works across concepts, primitives, and cards: follow a term to the building blocks it uses, then to material that helps communicate it.

## Explore the collection

- [Browse concepts](https://hilt21.github.io/ai-native-lexicon/concepts/) by name or explore the [categories](https://hilt21.github.io/ai-native-lexicon/categories/).
- Use [search](https://hilt21.github.io/ai-native-lexicon/search/) to find concepts and primitives.
- Browse the [primitive directory](https://hilt21.github.io/ai-native-lexicon/primitives/) or open the [Speaking Cards](https://hilt21.github.io/ai-native-lexicon/speaking-card/).
- Inspect [`dataset.json`](https://hilt21.github.io/ai-native-lexicon/dataset.json) for the machine-readable concept and primitive records, or [`llms.txt`](https://hilt21.github.io/ai-native-lexicon/llms.txt) for a compact page index.

## A working vocabulary, not a fixed canon

Entries are editorial working definitions, not claims of universal agreement. Concepts show maturity; primitive entries identify their synthesis basis and whether sources have been independently verified. Relationship and schema checks keep references inspectable as the collection grows.

The canonical content lives in three places: concept YAML in `src/data/concepts/`, primitive YAML in `src/data/primitives/`, and Speaking Card JSON in `src/data/speaking-cards.json`. The static site, search, cross-links, and machine-readable exports are generated from these records.

## Contribute

Help make the vocabulary more useful: clarify a term's boundary, add a well-supported relationship, improve an example, or propose a missing concept. Start with the [contribution guide](./CONTRIBUTING.md); primitive entries have a separate [content guide](./docs/primitives.md).

## Run locally

Requires Node.js 22.12 or newer. The GitHub Actions workflow uses Node.js 24.

```sh
npm ci
npm run dev
```

The site opens at `http://localhost:4321/`. Before submitting a change, run the checks used by CI:

```sh
npm run check
npm test
npm run build
```

`npm run check` checks the Astro project and validates concept, primitive, and Speaking Card references. `npm test` runs data-integrity and UI-regression tests. `npm run build` validates Speaking Card references and builds the static site.

## GitHub Pages

The [Pages workflow](./.github/workflows/pages.yml) validates, tests, builds, and deploys the site on successful pushes to `main` or `master`; pull requests run the checks without deploying. The deployment derives its URL and repository subpath from the GitHub environment.

## License

Source code is available under the MIT License. Lexicon content and dataset records are available under [CC BY 4.0](./LICENSE-CONTENT.md).
