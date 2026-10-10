# 首页方案 A：正式交付验证

2026-10-10。本记录对应 [Ticket #48](https://github.com/hilt21/ai-native-lexicon/issues/48) 与 [Spec #44 的已验收首页补充](https://github.com/hilt21/ai-native-lexicon/issues/44)。实施集成基线为 `1696e2d9347a998bc8bc25bacbc511815cbd8429`；产品行为直接复用用户已验收的实验提交。完整设计契约见 [首页规范](../design/brand/homepage-hero-artwork-plan.md)，实验时期的源码和页面证据见 [最小实验验收](hero-editorial-acceptance.md)。

## 交付范围

宽桌面 330px 主视觉、Light v2 / Dark v3、酸绿箭尖、手机 CTA 后左对齐且最大 480px、Logo/Search/原生主题语言图标同一行，以及两语言/全部宽度的底部版本信息一并交付。没有发现需要重做产品代码的验收差异；本次补充既有生产浏览器套件缺少的边界和主题/DPR断言。右侧 80% 放大、P2/P3、OG/卡片素材传播和内容/翻译修改不在范围内。

原始 BRAND-01 的 PR #47 与已关闭 #44/#45/#46 是上一轮交付；本轮由 #48 及其关联 PR 单独跟踪。本文的本地工程证据不代表远程 CI、合并或线上部署已经完成；这些状态以 #48 关联 PR 和仓库 Actions 的实际结果为准。

## 可复现验证

使用 Node 24.19.0、锁文件相同的隔离依赖拷贝和 full Chromium，串行执行：

```sh
npm run check
npm test
GITHUB_ACTIONS=true GITHUB_REPOSITORY=hilt21/ai-native-lexicon GITHUB_REPOSITORY_OWNER=hilt21 BASE_PATH=/ai-native-lexicon npm run build
WEB_EVIDENCE=work/hero-release/browser npm run test:browser -- --reuse-build
```

`check`：0 errors / warnings / hints；91 项单元测试通过；生产 `/ai-native-lexicon` 构建完成，575 Astro 页面、576 HTML，Pagefind 启用。

314 项 full Chromium 浏览器检查通过，0 失败；清单为本地 `work/hero-release/browser/manifest.json`。与历史实验相比，本次新增的持久验收覆盖包括：

- 两语言 × Light/Dark：800px Hero 单栏、480px 人物、CTA 后左对齐，页头仍显示文字选择器；1200px 人物 310px、位移为零、不压迫文字。
- 两语言 × DPR 1/2：新浏览器上下文实际请求手机 480/960px 资源；原生 Auto 随系统 Light→Dark 更新，桌面改用 340/680px Light v2 / Dark v3，Auto 状态重载保持；检查实际资源响应的尺寸及 alpha。
- 既有 320/360/390/799px 页头目标尺寸和焦点、双主题双语言首页 CTA/任务入口、底部版本位置、搜索/菜单/locale、reduced-motion 与严格 BFCache/reload 继续由同一套件验证。

首屏对照可复用 [已验收 Light 360px](hero-editorial-acceptance/home-light-360.png) / [Dark 390px](hero-editorial-acceptance/home-dark-390.png)：本票没有再次改写其产品渲染源码。

依赖环境修正：首次使用顶层 `node_modules` 软链接时，已有套件将该链接原样复制到合成 fixture，导致 Astro 的 Icon 编译元数据路径位于 fixture 根目录之外；300 项检查已通过后，fixture 构建失败。改用相同锁文件/依赖版本的实体隔离拷贝后完整重跑，没有修改产品或降低断言。失败尝试保留在本地 `work/hero-release/browser-symlink-attempt/manifest.json`。

屏幕阅读器、实际 400% 缩放、真机原生选择菜单、真实用户 INP 与上线后的品牌效果未在本轮验证；窄屏重排和本地浏览器结果不替代这些证据。
