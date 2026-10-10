# Dark 主视觉：暗部融合实验

2026-10-09 第二轮本地实验，以首轮 `10727c2` 为基线。2026-10-10 用户已验收本 Dark 方案，尚未发布。保持角色姿态、画幅、轮廓和北极星，只调整 Dark 的局部明暗；Light 继续使用 v2。后续的尺寸、手机导出、页头及版本号位置以 [已验收首页规范](../../homepage-hero-artwork-plan.md) 为准。

## 处理与来源

直接编辑已有 [v2 Dark 路径稿](../../../../../public/brand/hero-v2/rider-dark.svg)，没有再次生图或重描角色。母稿包含可编辑原生 SVG 路径；新增内部矢量 mask 与渐变填色控制不同区域的明暗，没有内嵌位图或外部引用。

披风、衣装和靴子的浅色部分逐渐降至页面已有的 `#6C7165`、`#41473A` 和 `#383C34`；面部局部保留 `#E3E6DA`，双手与独角兽头使用 `#C7CABF`。深色沿用 `#151713`，酸绿北极星和内部白色镂空保持原稿。色值来自现有 Dark token；局部调色是本轮设计解释，不宣称品牌原图已有这些明暗分区。

局部渐变仅作用在原有浅色路径内部，形成过渡；外围不加光晕、阴影、框架、纹理或动效。最亮部分集中在可识别部位，大片披风与页面暗色背景相接。

## 交付与复现

- [Dark SVG](../../../../../public/brand/hero-v3/rider-dark.svg)：1111 × 1416，与 v2 使用相同姿态和外轮廓。
- [340 px WebP](../../../../../public/brand/hero-v3/rider-dark-340.webp) / [680 px WebP](../../../../../public/brand/hero-v3/rider-dark-680.webp)：透明背景，支持 1× / 2× 网页展示。
- [实际尺寸预览](preview-dark-340.png)。
- [来源、参数、摘要与轮廓校验](../../../../../public/brand/hero-v3/assets.json)。

在仓库根目录运行 `node docs/design/brand/hero-artwork/v3/build.mjs` 可由 v2 矢量稿重建本轮素材。该脚本使用已有 Sharp 依赖，核对 SVG 边界和 240/330/340/680 px 的实际渲染 alpha：与 v2 完全一致。生成不会修改 v2 或 Light 素材。

页面接入仍由 `HeroArtwork.astro` 使用原生主题状态和 CSS `image-set` 选择；没有新的主题控制器。实际首页对照与本轮验证见 [实验记录](../../../../audits/hero-dark-blend-experiment.md)。
