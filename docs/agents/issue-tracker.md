# Issue tracker: GitHub

Issues and specs live in GitHub Issues for `hilt21/ai-native-lexicon`.
Use the `gh` CLI from this repository. Verify the target repository
against `git remote -v` before writing.

## Conventions

- Create: `gh issue create --title "..." --body-file <file>`
- Read: `gh issue view <number> --comments`
- List: `gh issue list --state open --json number,title,body,labels`
- Comment: `gh issue comment <number> --body-file <file>`
- Add labels: `gh issue edit <number> --add-label "..."`
- Remove labels: `gh issue edit <number> --remove-label "..."`
- Close: `gh issue close <number> --comment "..."`

For multiline content, save the exact text to a temporary file and
pass it with `--body-file`.

## Pull requests as a triage surface

**PRs as a request surface: no.**

GitHub issues and PRs share a number space. When the resource type
is unclear, resolve it before acting.

## Skill instructions

When a skill says "publish to the issue tracker", create a GitHub issue.
When it says "fetch the relevant ticket", read the issue and its comments.

This configuration identifies the tracker; it does not independently
authorize external writes. Follow the current task's authorization.
