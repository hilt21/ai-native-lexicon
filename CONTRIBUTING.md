# Contributing

Contributions should make the vocabulary more useful, precise, and inspectable. A good entry helps a practitioner name a system property, make a decision, or identify a failure mode.

## Before proposing a term

Check whether the idea is already represented under a different name. Prefer improving an existing boundary over adding a near-synonym. New terms should be used or useful beyond one product, company, or implementation.

## Entry requirements

Create one kebab-case YAML file in `src/data/concepts/`. Every entry must include:

- a concise English term and Chinese name;
- exactly one of the eight existing categories;
- a maturity status: `foundational`, `emerging`, `evolving`, or `contested`;
- an original working definition that states the concept's boundary;
- why it matters, when to use it, and a concrete anti-pattern;
- two to six valid related-concept slugs;
- optional sources only when they directly support origin, usage, or a factual claim.

Do not fabricate a first use, author, or citation. The lexicon may define a useful working term without claiming who coined it.

## Editorial test

A reviewer should be able to answer yes to each question:

1. Does this name a distinct and reusable idea?
2. Does the definition say what is inside and outside the concept?
3. Does the entry help someone make or critique a design decision?
4. Is the maturity label honest about consensus?
5. Do the relationships form useful paths through the lexicon?

## Validation

Run all checks before opening a pull request:

```sh
npm run check
npm test
npm run build
```

`npm run check` applies the same Zod schema used by the website and verifies cross-record relationships. Pull requests run the complete pipeline without deploying.

## Scope of changes

Keep pull requests focused. Do not mix a terminology proposal with unrelated styling, dependency, or architecture changes. When changing a definition, explain the practical ambiguity the change resolves.
