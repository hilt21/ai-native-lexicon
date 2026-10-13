# Cloud development

Use this branch for hosted agent workspaces, remote containers and CI. Capabilities belong to the current session; historical failures do not establish today's availability.

## Establish the execution route

1. Inspect the working tree, runtime, available tools and network policy. Check the repository's scripts and [required verification](../../CONTRIBUTING.md#validation). Confirm repository read/write access through an available CLI or connector; keep credentials out of commands and reports.
2. State where code executes and where verification will execute. A remote shell, Cloud Browser and GitHub Actions may have different filesystems, networks and credentials. Treat each as a separate capability.
3. Select the smallest checks that cover the change. A previously passing run applies only to its recorded revision and scope. Preserve existing evidence and rerun checks affected by new changes or required by the repository gates.

## When browser verification is required

1. Honor the user's selected browser. When Cloud Browser is requested, use that surface for interactive QA. Otherwise confirm that a compatible installed browser launches before relying on local Playwright; attempt installation only when network policy permits it.
2. Record a failed launch/download with its error. Retry only after a concrete condition changes. Continue available code checks and use remote CI for executable browser/build gates. Read the run and job conclusions for the relevant commit; a queued run is pending.
3. Give Cloud Browser a reachable preview URL tied to the candidate revision. A development server on the workspace's `localhost` is not automatically reachable there. Use an existing preview, or prepare an isolated preview when authorized. Publishing over production or merging requires the applicable authorization.
4. If only production is reachable, record its deployment revision as known or unknown and scope findings to that deployment. Existing production behavior cannot validate an undeployed patch. Read [online verification](../audits/online-verification-guide.md) for deployed paths, i18n, social metadata and manual acceptance.
5. Follow the browser's documented capabilities. A policy-blocked URL/action stays blocked; do not substitute another protocol or tool to bypass the restriction. For an unsupported browser zoom or screen-reader session, use the guide's separate manual checklist. A sign-in wall is a blocker until an authorized account flow is available.

## Evidence and completion

- Record target URL, source commit, deployed revision if known, timestamp/timezone, browser/environment, steps and expected/actual results. Save screenshots for visual claims and errors/reproduction steps for failures; separate site errors from extension/tool errors.
- Distinguish code checks, HTTP checks, browser interaction and human assistive-technology/platform sessions. A successful build or HTTP response establishes only that layer.
- Use `passed`, `failed`, `blocked` or `unverified` per check. Identify unavailable evidence and the next feasible verification route in the handoff. A missing capability never becomes a pass.
- Keep durable evidence and implementation in the repository/PR or CI artifacts. Link evidence to its commit and target; preserve dated audits as historical records.

For examples of these boundaries, consult the [Cloud Browser session](../audits/cloud-browser-2026-10-13.md) only when needed. Its tool limitations and CI outcomes are historical observations, not current environment defaults.
