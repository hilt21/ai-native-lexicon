# Local development

Use this branch when the checkout and commands run on the developer's workstation.

1. Inspect the working tree and the relevant scripts/configuration. Select required checks from [Contributing](../../CONTRIBUTING.md#validation).
2. For browser-affecting changes, confirm that the configured Playwright browser launches and can reach the preview at the production subpath. An installed dependency alone does not establish browser availability. Use the existing browser suites and their evidence paths.
3. If browser launch, download or network access is blocked, read [cloud development](cloud-development.md#when-browser-verification-is-required) for the remote verification route. Retain the failed command and cause instead of repeatedly retrying an unchanged environment.

Completion: report the tested revision, required checks and their outcomes. For online-only acceptance, read the [online verification guide](../audits/online-verification-guide.md); a workstation result has no implied production coverage.
