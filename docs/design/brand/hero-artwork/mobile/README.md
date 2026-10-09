# 手机端主视觉排版与素材

2026-10-10。本轮修正“文字左对齐、人物以小尺寸居中”产生的视觉分离。手机人物位于 CTA 之后，沿文字左边界排列，宽度填满可用列，最高 480 CSS px；桌面维持上一轮尺寸与位置。沿用 Light v2 和 Dark v3 的身份、形态与明暗处理。

## 网页素材

- Light：[480 px](../../../../../public/brand/hero-mobile/rider-light-480.webp) / [960 px](../../../../../public/brand/hero-mobile/rider-light-960.webp)。
- Dark：[480 px](../../../../../public/brand/hero-mobile/rider-dark-480.webp) / [960 px](../../../../../public/brand/hero-mobile/rider-dark-960.webp)。
- [来源和文件摘要](../../../../../public/brand/hero-mobile/assets.json)。

由现有 SVG 母稿渲染为透明 WebP，提供最高 480 CSS px 的 DPR 1/2 展示；完整保留画幅、姿态、颜色与北极星。没有再次生图、重绘或裁切。运行 `node docs/design/brand/hero-artwork/mobile/build.mjs` 可复现，使用项目已有 Sharp。

`HeroArtwork` 在原有 50rem 单栏断点下选择手机素材，桌面继续选择原 340/680 px 图片；使用原生主题及 CSS `image-set`，不加主题或布局脚本。实际页面证据见 [手机端对齐记录](../../../../audits/hero-mobile-alignment.md)。
