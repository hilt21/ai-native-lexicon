# Online verification

Target: https://hilt21.github.io/ai-native-lexicon/

Source: 5189a6fdc50d793e3e90c29a50fdbb0677a4741a; dirty: false. Deployed revision is not proven by source checkout.

HTTP/HTML: **passed**; browser smoke: **unverified**; overall acceptance: **pending-human-verification**.

Pages: 574; discovered assets: 53; failures: 0.

## Translation inventory

| Collection | Records | Core translated | Reviewed/current units | Missing | Draft | Stale |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| concepts | 84 | 84 | 426/426 | 0 | 0 | 0 |
| primitives | 42 | 42 | 486/486 | 0 | 0 | 0 |
| categories | 18 | 18 | 54/54 | 0 | 0 | 0 |
| layers | 5 | 5 | 5/5 | 0 | 0 | 0 |
| speakingCards | 20 | 20 | 140/140 | 0 | 0 | 0 |

Skill Maps use shared English canonical and retained Chinese prose projections; per-map coverage and annotations are in report.json.

## Failures

None in the stated automated scope.

## Page risks

### share canonical targets guide while og:url identifies the card; platform behavior unverified

Affected pages: 20

- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-01/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-02/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-03/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-04/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-05/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-06/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-07/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-08/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-09/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-10/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-11/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-12/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-13/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-14/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-15/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-16/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-17/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-18/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-19/
- https://hilt21.github.io/ai-native-lexicon/share/speaking-card/card-20/

### social description language differs from route locale (heuristic; editorial review required)

Affected pages: 1

- https://hilt21.github.io/ai-native-lexicon/zh-cn/

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
- External asset not fetched: https://static.cloudflareinsights.com/beacon.min.js
- Page risks above are observations, not failed checks or completed platform acceptance; raw metadata remains in report.json.
- CSS URL references and observed HTML assets are checked; this is not an exhaustive JavaScript dependency crawler.
- JSON includes timestamps, headers, redirects and per-record coverage.
