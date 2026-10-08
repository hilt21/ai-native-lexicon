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
Knowledge and Application Resource records remain canonical in their
own YAML collections; translation overlays remain separate display assets.
Keep definitions and resource content in those records; use the glossary
for shared vocabulary and ADRs for decisions.

## Vocabulary

Use glossary terms in issues, proposals, hypotheses, and test names.
If a needed term is missing, reconsider invented terminology or record
the gap for domain modeling.

## ADR conflicts

Explicitly identify any proposal that contradicts an existing ADR,
and explain why the decision should be reconsidered.
