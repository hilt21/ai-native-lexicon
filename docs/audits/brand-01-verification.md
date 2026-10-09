# BRAND-01 品牌视觉升级验收

对应 [Spec #44](https://github.com/hilt21/ai-native-lexicon/issues/44)、[素材 #45](https://github.com/hilt21/ai-native-lexicon/issues/45) 和 [网站 #46](https://github.com/hilt21/ai-native-lexicon/issues/46)。2026-10-09 在本地分支 `codex/brand-visual-upgrade` 验证；产品基线为 `7eb432d`，素材完成点为 `9df3acc`，网站实现为 `06d4834`、`0a19e5e`，验收修正为 `248bb6b`、`965f1f3`。使用锁定依赖、Node 24.19.0 和 Playwright full Chromium。

这是本地实现及工程验收记录。Issue 保持开放，代码尚未推送、创建 PR 或部署。首次用户任务测试、真实社交平台预览及传播效果属于上线后观察。

## 交付

- 10 项基础素材及主题/尺寸派生版本，原稿、来源摘要、裁切边界、参考像素与独立预览见 [素材交付](../design/brand/asset-delivery.md)。主视觉保留原稿像素，显示宽度不超过 245 CSS px；描摹 SVG 不宣称为原始设计源文件。
- 原生 Header 字标及 favicon、首页主视觉与四个任务入口、目录/详情/六类搜索图标。读者链接继续使用 locale/base，规范数据集链接保持根路径。
- 默认 1200 × 630 图片；每个有效 Speaking Guide 自动产生 1200 × 630、1080 × 1350 图片及英文静态分享页。文本来自验证后的原始记录，分享页与聚合页提供两种下载和原 `#card-XX` 回访入口。
- Task Journey 的步骤、条件、可选标记和同一步节点组，以及 Overview 的分组与真实关系文字。地图数据、顺序和语言规则保持原契约。

## 运行结果

| 检查 | 结果 |
| --- | --- |
| `npm run check` | 0 errors、0 warnings、0 hints；schema/catalog 通过 |
| `npm test` | 91 项通过，包括素材溯源、真实图像渲染和图片生成诊断 |
| `npm run build` | 575 个 Astro 页面；当前 20 个 Guide 的 40 张 PNG，加默认图片；Pagefind 开启 |
| `npm run test:browser -- --reuse-build` | 302 项通过、0 失败；生产 `/ai-native-lexicon`；重用上述构建，最终报告提交点为 `248bb6b` |
| `npm run test:extension` | 13 项通过；真实 Guide 源文件生命周期与稳定/变化哈希通过 |
| `PLAYWRIGHT_CHANNEL=chromium npm run test:l2 -- --browser` | 10 个阶段全部通过；390/1440 px 浏览器、两主题与语言投影通过；隔离清理确认正式 YAML/source 未改变 |

当前计数来自本次构建与报告，仅说明这次验收。正式内容输入和规范导出实现相对基线没有修改；新的品牌产物由已有 catalog 派生。完整本地日志位于 `work/brand/`，浏览器报告为 `work/brand/upgrade/manifest.json`，L2 报告为 `work/brand/l2/browser-report.json`，实施前 274 项检查的基线报告为 `work/brand/baseline/manifest.json`。

## 验收证据

| Spec 范围 | 证据 |
| --- | --- |
| P0 品牌入口、首页、素材、默认预览 | 实际 16/32/64 px 符号、24 px 图标与 120 px 起字标；390 × 844 / 1440 × 900 首屏按钮及说明边界；双主题图片真实解码；四任务入口 href/键盘到达；默认 OG/Twitter HTTPS 地址、实际 PNG 尺寸 |
| P1 资源身份、搜索 | 原有摘要/Copy/导航保留；六类结果的图标真实加载与文字标签；沿用查询、过滤、匹配说明、清空和 BFCache/reload 断言 |
| P1 图片、单卡及索引 | 全部当前 Guide 在两个画幅完整排版；固定字体与溢出诊断；特殊字符和稳定/变化哈希；无 JS 请求逐卡校对标题/观点/元数据/下载；非法编号 404；noindex/canonical/sitemap/Pagefind 排除 |
| P1 自动投影 | 真实源 YAML 的新增、重复构建、标题/观点修改、删除；核对分享 HTML、两张 PNG、下载入口、manifest、哈希和孤立产物清理；运行结果见上表 |
| 地图与公共契约 | 既有两张地图与混合语言 fixture、计数/关系/退役/语言/顺序检查；双主题计算对比度、键盘及 reduced motion；320 px 首页回流 |

## 首屏截图

下列截图来自同一生产构建的 Astro preview，等待字体及有限动画完成后在页面顶部采集；完整页面和其它变更页面截图位于 `work/brand/upgrade/`。

| 界面/主题 | 390 × 844 | 1440 × 900 |
| --- | --- | --- |
| English / light | [手机](brand-01/home-en-light-390.png) | [桌面](brand-01/home-en-light-1440.png) |
| English / dark | [手机](brand-01/home-en-dark-390.png) | [桌面](brand-01/home-en-dark-1440.png) |
| 中文 / light | [手机](brand-01/home-zh-light-390.png) | [桌面](brand-01/home-zh-light-1440.png) |
| 中文 / dark | [手机](brand-01/home-zh-dark-390.png) | [桌面](brand-01/home-zh-dark-1440.png) |

## 复核与限制

### Standards

Standards 复核曾发现测试服务器把 SVG 返回为二进制，以及新截图没有等待动画/重置焦点滚动；已修正 MIME、实际解码断言、等待和回顶，并以本次截图及 302 项通过结果替换旧证据。旧绿色结果不能作为品牌呈现证明。

### Spec

Spec 复核曾发现缺少真实源文件新增/修改/删除的分享投影验收；已扩展既有隔离 fixture，并实跑通过。隔离测试副本也补入品牌原稿，以支持与正式工作区相同的源摘要校验。

最终复核：Standards 0 项未解决发现；Spec 0 项未解决发现；公共检查全部通过。

屏幕阅读器实测、实际 400% zoom、真实社交平台抓取/缓存效果仍为 **unverified**；320 px 回流和本地图片响应不替代这些观察。没有新增点击跟踪、内容改写或未经审查的翻译。
