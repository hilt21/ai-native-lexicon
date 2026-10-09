# 编辑式主视觉 v2 交付

2026-10-09。依据项目所有者“使用生图技能生成符合品牌视觉语言的矢量稿”的指令，采用 **内置 image_gen 生图工具 + VTracer 0.6.15 双色路径描摹**。这是一套生成式重制的主视觉素材，保留原角色、构图和品牌语言；不宣称取得了原始设计矢量文件，也不宣称与原稿像素完全一致。

## 可直接使用的素材

| 用途 | 文件 | 交付 |
| --- | --- | --- |
| Light 矢量母稿 | [rider-light.svg](../../../../../public/brand/hero-v2/rider-light.svg) | 185 条原生路径，1111 × 1416 viewBox，无内嵌位图 |
| Dark 矢量母稿 | [rider-dark.svg](../../../../../public/brand/hero-v2/rider-dark.svg) | 179 条原生路径，相同 viewBox，无内嵌位图 |
| Light 网页图片 | [340 px](../../../../../public/brand/hero-v2/rider-light-340.webp) / [680 px](../../../../../public/brand/hero-v2/rider-light-680.webp) | 透明 WebP，约 38 / 88 KiB |
| Dark 网页图片 | [340 px](../../../../../public/brand/hero-v2/rider-dark-340.webp) / [680 px](../../../../../public/brand/hero-v2/rider-dark-680.webp) | 透明 WebP，约 46 / 108 KiB |
| 来源、参数、尺寸和摘要 | [assets.json](../../../../../public/brand/hero-v2/assets.json) | 独立 v2 索引，不覆盖原 v1 素材与来源记录 |

SVG 为可编辑的真实路径稿；共同外轮廓采用原生矢量 mask，不含 `<image>`、Base64 位图、脚本、外部资源或字体依赖。SVG 母稿约 398/479 KiB，网页默认宜消费已渲染的 WebP；矢量保留用于后续排版和编辑。

680 × 867 WebP 支持 340 CSS px 的 2× 展示；330 px 主视觉与 240 px 移动尺寸也已核对。当前本地最小首页实验消费这套 WebP；默认 OG 和卡片图片继续消费 v1 素材。

## 视觉处理

- Light 用墨黑 `#171916` 和纸色 `#F3F0E6`；Dark 用深色 `#151713` 与暖白 `#EEF0E7`，披风、衣装和靴子具有浅色实体，而非只靠细白轮廓。
- 面部、眼睛和独角兽采用正常的浅色面部与深色细节，未使用整图 CSS 反相。保持少年短发、左向满弓、双手持弓/弦、箭袋、前伸靴子、披风及右向独角兽的构图关系。
- 箭尖复用现有北极星的路径，酸绿 `#C8FF3D`、0° 方向与白色内镂空保持原规范。两版使用同一固有坐标锚点 `[331, 368]`；可见星形在桌面目标尺寸约为 16-20 px，移动尺寸随整体缩小。
- Dark 生图母稿的外围与 Light 有轻微差异，最终矢量稿统一采用 Light 的共同 mask，固定构图边界。生成式重制仍存在线条/细节差异，因此 v1 原稿、原像素提取稿和本版本分别保留。

## 生成记录与最终提示词

- Light 编辑目标：[既有主视觉](../../../../../public/brand/rider-mascot.png)；风格依据：[图版 01](../../v1/01-brand-identity.jpg)。最终提示词见 [generation-prompt.txt](generation-prompt.txt)，生成母稿见 [generated-master.png](generated-master.png)，1111 × 1416。
- Dark 编辑目标为上述 Light 母稿。最终提示词见 [dark-generation-prompt.txt](dark-generation-prompt.txt)，生成母稿见 [generated-dark-master.png](generated-dark-master.png)，1111 × 1415。
- 路径提取以 alpha ≥ 128 确定轮廓，以平均通道值 128 区分两种实体色，使用 spline 描摹并移除小噪点；参数及所有文件摘要记录于索引。原生 SVG mask 固定两主题边界，北极星为既有矢量组合。

## 预览与验证

- [实际尺寸预览](preview.html)：两主题 330 px SVG、340 px / 2× WebP、240 px 移动尺寸。
- [Light 340 px](preview-light-340.png) / [Dark 340 px](preview-dark-340.png)；[Chromium 实际预览截图](browser-preview.png)。
- 细节对照：[Light 面部](detail-light-face.png)、[Dark 面部](detail-dark-face.png)、[Light 双手](detail-light-hands.png)、[Dark 双手](detail-dark-hands.png)、[Light 独角兽](detail-light-unicorn.png)、[Dark 独角兽](detail-dark-unicorn.png)。
- [图像校验](verification.json)：240/330/340/680 px 实际渲染、有色形态与透明外部、无内嵌位图/脚本/外链；两主题在各尺寸的 alpha 轮廓摘要完全相同。
- [浏览器校验](browser-verification.json)：Chromium 实际解码 6 项 SVG/WebP 预览，显示宽度符合标注。

已对照角色、满弓、双手、面部、披风、独角兽、品牌色和星形进行本次视觉检查。网页首屏构图、Light/Dark/Auto 切换、LCP/CLS 和全站回归属于后续接入验收，未以素材预览宣称已完成页面优化。
