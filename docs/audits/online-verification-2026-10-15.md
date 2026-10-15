# Issue #51：部署后只读核验，2026-10-15

结论：本次自动 HTTP/HTML 核验通过，574 个页面、53 个发现的同站资源，0 项失败。注册翻译单元均为 reviewed/current。整体线上验收仍为 `pending-human-verification`。本次没有运行本地浏览器套件、Cloud Browser、屏幕阅读器或社交平台会话。

## 目标与证据边界

- 目标：<https://hilt21.github.io/ai-native-lexicon/>。
- 主核验时间：2026-10-15 04:26:34–04:27:10 UTC，即北京时间 12:26:34–12:27:10。补充请求的逐项时间见 JSON。
- 执行：云端 Node HTTP 客户端，经环境代理，默认受限并发；只读取目标，没有部署、改变内容审核状态或发送通知。
- 预期源版本：`5189a6fdc50d793e3e90c29a50fdbb0677a4741a`，运行时工作树干净。
- GitHub [主分支流水线 38502196979](https://github.com/hilt21/ai-native-lexicon/actions/runs/38502196979) 的 verify 和 deploy 均成功，head 为该版本。它是部署来源证据；HTTP 响应不暴露 commit 标识，单靠工作区版本或 Last-Modified 无法独立证明每个 CDN 响应对应该 commit。实际响应符合该版本的 resolver 预期。
- [Issue #51](https://github.com/hilt21/ai-native-lexicon/issues/51) 本次读取仍为 open、ready-for-agent。本文不关闭人工验收事项。

可复现命令：

```sh
NODE_USE_ENV_PROXY=1 ONLINE_EVIDENCE=work/online-verification-2026-10-15 \
  npm run verify:online -- https://hilt21.github.io/ai-native-lexicon/
```

没有加 `--browser`。代理变量按当前网络需要使用。

## 本次自动验证的事实

| 范围 | 本次结果 | 证据与限制 |
| --- | --- | --- |
| 页面与资源路径 | 574 页、53 个同站资源，全部通过 HTTP、MIME、非空响应及适用的图片签名/尺寸检查 | 保留各请求时间、最终 URL、重定向、状态、缓存头和字节数。只覆盖清单与发现的 HTML/CSS 依赖，不声称爬取任意 JavaScript 动态依赖。 |
| 双语知识页面 | 每个 Concept/Primitive 的两种语言与 resolver 一致 | 比较覆盖计数、摘要、定义、注册字段文本及实际语言、canonical、robots 和 alternates。相同文本出现多次时，一般字段匹配不证明它位于唯一指定位置。 |
| Skill Maps | 共享英文 canonical 与中文 prose resolver 的清单覆盖所有节点和旅程 | 105 节点、14 旅程；不是早期仅抽查一节点/旅程的清单。中文覆盖和语言检查通过，英文 canonical 数据存在；这不是逐句人工语言质量审阅。 |
| 社交抓取输入 | OG/Twitter 必需字段及图片 URL 符合当前 publication contract，社交图为 1200×630 | 不执行页面 JavaScript 即可读取。20 张分享页逐卡比较原始标题、说明和图像路径；真实平台抓取/缓存未验证。 |
| Sitemap | index 与 sitemap-0 均 HTTP 200；554 个唯一 loc 与主清单中非分享页集合完全相同 | 20 张 noindex 分享页未进入 sitemap；保留独立集合比较结果。 |
| 机器导出 | dataset.json HTTP 200、可解析，schema 1.4.0 | 84 Concepts、42 Primitives、20 Speaking Cards、2 Maps；dataset_version 为 `sha256:0f4f1f2add094095efdb648a7d5a557e24f723772ff60c68c9dd5b03e8206618`。这不是部署 commit 标识。 |
| Cloudflare 片段抽查 | 英文首页、中文首页、card-01 分享页均含一个指定 module script，token 为 `304c1b9d27154f01a7ba117792b12e1f` | 仅证明服务端 HTML 含片段。外域 beacon 不在同站抓取范围；未验证执行、上报或后台统计。 |

当前共享 resolver 的注册翻译单元：

| 集合 | 记录或规模 | Reviewed/current | Missing / draft / stale |
| --- | --- | ---: | --- |
| Concepts | 84 | 426/426 | 0 / 0 / 0 |
| Primitives | 42 | 486/486 | 0 / 0 / 0 |
| Categories | 18 | 54/54 | 0 / 0 / 0 |
| Layers | 5 | 5/5 | 0 / 0 / 0 |
| Speaking Cards | 20 | 140/140 | 0 / 0 / 0 |
| Matt Pocock | 31 节点、7 旅程 | 794/794 | 0 / 0 / 0 |
| pstack | 74 节点、7 旅程 | 1194/1194 | 0 / 0 / 0 |

合计 3099/3099。这是注册单元的审核与时效状态。原始来源描述、技能名和字面标识可准确保留英文；数字不等于全部可见字符均为中文，也不证明翻译流畅度、底层知识事实正确性或辅助技术发音。

## 已有证据，本次没有重跑

- 主分支上述 verify/deploy 成功覆盖构建、测试、扩展回归、L2、完整 i18n publication 和生产子路径浏览器检查；这些是 CI 构建产物证据，不是本次生产站交互验收。
- [2026-10-13 Cloud Browser 记录](cloud-browser-2026-10-13.md) 是历史部署的操作证据。不能将历史键盘、剪贴板或搜索观察自动转给当前部署，更不能视为屏幕阅读器验收。
- [完整 i18n 发布记录](i18n-full-publication-2026-10-13.md) 说明 canonical 迁移和中文内容审核。其当时“部署后核验 pending”的边界由本报告补充 HTTP 证据，保留原文作为历史记录。

本次新增人工验收通过项：无。

## 已观察事实与代码可推断风险

| 优先级 | 事实 / 推断 | 影响与最小后续 |
| --- | --- | --- |
| 中 | **已观察**：中文首页的 description/og:description 是英文，og:locale 为 zh-CN。**代码依据**：HomePage 未传 description，继承全局英文默认值。 | 中文路由可能展示英文预览说明。后续单独补中文首页描述并核对静态 metadata；这不属于 Concept/Primitive 注册单元缺失。 |
| 中 | **已观察**：20 个 card 分享页 canonical 指向完整 Speaking Guide，og:url 指向具体卡片；与代码约定一致。**推断**：平台可能对分享身份进行归并。 | 用一个真实分享 URL 在 LinkedIn/X 对照主页预览，确认卡片身份与图文。当前没有平台失败证据。 |
| 中 | **代码事实**：社交图片沿用稳定 URL。**本次 HTTP 事实**：默认图响应 cache-control=max-age=600。**推断**：社交平台自己的缓存可能仍保留旧图，时长未知。 | CDN 缓存头不能证明平台刷新。在下一次真实图像更新时保留更新前后预览、图像 URL、部署时间及刷新动作。 |
| 待验证 | **代码事实**：窄屏首页原生 select 的 option 有明确主题前景/背景。**推断边界**：OS 原生弹窗可能有平台差异。 | 使用一台真实手机在两种主题打开两个选择器；样式声明或桌面计算色值不足以证明原生菜单可读。 |
| 待验证 | **范围事实**：本次未运行浏览器，不读取外域 beacon 或 Pagefind 动态网络。 | 没有证据将它们标为失效；也没有本次部署执行成功的证据。按需进行小范围 Cloud Browser smoke，单独记录网络请求与焦点。 |

## 最小人工补测

每项起始状态均为 **unverified**。记录测试者、北京时间、URL、部署来源、设备/OS、浏览器/辅助技术版本、步骤、预期/实际、截图或录屏。发生账号或能力限制时记录 blocked，不能记 passed。

1. **屏幕阅读器，一次会话**：NVDA+Firefox 或 VoiceOver+Safari。在首页用 landmark/skip link 到正文；读取主题和语言选择器；打开搜索、输入、关闭并确认焦点返回；Concept/Primitive Copy 成功与失败反馈均被宣布；抽查中文页面中原始英文术语的语言切换。逐项记录，不合并成笼统“无障碍通过”。
2. **实际 400%，一次桌面会话**：约 1280 CSS px 窗口，在浏览器菜单设置 400% 并拍下缩放 UI。访问首页、搜索、长 Primitive、一个 map node，在 Light/Dark 检查内容不丢失、控制可用、无不必要二维滚动、焦点可见及搜索可关闭。320 px 模拟、CSS zoom、DPR 均不替代它。
3. **真实手机，一次会话**：iOS/Safari 或 Android/Chrome，在 Light/Dark 打开首页主题/语言原生菜单，确认所有选项可读、当前值可识别、选择生效。发现平台差异后才扩展第二台设备。
4. **真实平台预览，两次平台检查**：LinkedIn Post Inspector 与 X composer 各检查主页和 `/share/speaking-card/card-01/`，保留标题、图片、卡片身份和抓取时间，不发布帖子。当前无图像更新实验，缓存刷新行继续 unverified，待下一次真实更新补证。

## 原始证据

- [自动生成摘要](online-verification-2026-10-15/report.md)。
- [完整逐请求、metadata 和逐单元 inventory，gzip JSON](online-verification-2026-10-15/report.json.gz)；[校验清单与 SHA-256](online-verification-2026-10-15/manifest.json)。
- [补充 HTTP、sitemap、dataset 与 analytics 片段观察](online-verification-2026-10-15/supplement.json)。

解压原始 JSON：

```sh
gzip -dc docs/audits/online-verification-2026-10-15/report.json.gz > /tmp/lexicon-online-report.json
```

本次为文档与证据补充，没有修改网站实现，也没有重复已通过的本地浏览器套件。#51 的自动核验已有当前生产站证据，整体人工验收继续保持开放。
