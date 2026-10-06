# Domain docs

This repository uses a single-context layout.

## Before exploring

Read root `GLOSSARY.md`, if present, and relevant ADRs in `docs/adr/`.

If these files do not exist, proceed silently. Do not propose creating
them solely because they are absent. Domain-modeling workflows create
them when terms or decisions are resolved.

## Layout

- `GLOSSARY.md`: shared project terminology.
- `docs/adr/NNNN-short-title.md`: architecture decision records.

These documents describe project terminology and decisions.
Concepts, Primitives, and Speaking Cards remain canonical in their
existing YAML collections; do not duplicate their records here.

## Vocabulary

Use glossary terms in issues, proposals, hypotheses, and test names.
If a needed term is missing, reconsider invented terminology or record
the gap for domain modeling.

## ADR conflicts

Explicitly identify any proposal that contradicts an existing ADR,
and explain why the decision should be reconsidered.
