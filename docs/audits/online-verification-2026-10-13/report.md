# Online verification

Target: https://hilt21.github.io/ai-native-lexicon/

Source: baee378ff4cef1988d598ab9ff47fba1c917635f; dirty: true. Deployed revision is not proven by source checkout.

HTTP/HTML: **passed**; browser smoke: **unavailable**; overall acceptance: **pending-human-verification**.

Pages: 334; discovered assets: 51; failures: 0.

## Translation inventory

| Collection | Records | Core translated | Reviewed/current units | Missing | Draft | Stale |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| concepts | 84 | 2 | 16/426 | 410 | 0 | 0 |
| primitives | 42 | 1 | 2/486 | 484 | 0 | 0 |
| categories | 18 | 18 | 54/54 | 0 | 0 | 0 |
| layers | 5 | 5 | 5/5 | 0 | 0 | 0 |

Skill Maps retain original-language editions; annotation inventory is in report.json. These are outside the translation overlay and have no certified English completeness score.

## Failures

None in the stated automated scope.

## Manual acceptance

- screen-reader: unverified
- browser-400-percent: unverified
- real-device-selects: unverified
- linkedin-preview: unverified
- x-preview: unverified
- social-cache-refresh: unverified

See the manual checklist. No automated result proves a screen-reader session, actual 400% browser zoom or social platform cache refresh.

## Limits

- Fixed social image URLs may retain platform caches; HTTP success does not prove refresh.
- Per-page metadata language observations are in report.json.
- CSS URL references and observed HTML assets are checked; this is not an exhaustive JavaScript dependency crawler.
- JSON includes timestamps, headers, redirects and per-record coverage.
