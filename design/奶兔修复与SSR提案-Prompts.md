# 奶兔耳朵修复与 SSR 立绘提案

2026-09-22。使用内置 `image_gen`，三次均提供参考图（`referenced_image_paths`）。修复图已接入应用；SSR 新立绘只用于方案对比，尚未替换正式双形态。下面路径以项目根目录为基准。

## 1. 日常形态局部编辑

输入：`public/art/bunny-a.png`。

输出：`public/art/bunny-a-repaired.png`。

准确提示词：

```text
Use case: precise-object-edit. Edit this exact portrait image of the cream plush strawberry bunny. Repair ONLY the bunny's anatomical left ear (on the viewer's RIGHT, the ear with the mint bow). Currently it has an impossible extra folded thick lobe above a separate long hanging pink ear. Make it ONE anatomically continuous floppy rabbit ear: one clear root on top right of the head, gently rising a little then smoothly bending outward/down, with one single rounded dangling tip and one continuous pink inner ear. No extra ear segment, no disconnected flap, no doubled tip. Keep the mint bow attached near the ear root. Keep the other upright ear exactly unchanged. Preserve the bunny's identity, eyes, mouth, fur, strawberry, feet, body pose, all flowers, background, lighting, colors, composition and 2:3 portrait framing. Minimal localized edit, same plush material detail. No text or border.
```

## 2. 魔法形态局部编辑

输入顺序：`public/art/bunny-b.png`；第一步输出的日常形态修复图。

输出：`public/art/bunny-b-repaired.png`。

准确提示词：

```text
Use case: precise-object-edit. Image 1 is the EDIT TARGET: the magical strawberry bunny with crown, translucent wings, cape and glowing strawberry. Image 2 is a supporting reference for the corrected ear anatomy. Edit ONLY the anatomical left ear (VIEWER RIGHT) in image 1: remove the impossible doubled thick upper lobe/flap, replace with ONE anatomically continuous floppy ear rooted on the top right of the head, gently arcing downward with ONE rounded hanging tip and continuous pink inner ear, just like the corrected single ear in image 2. Keep mint bow near root. Keep other ear, exact face and expression, crown, wings, cape, glowing strawberry, body, all background, lighting, colors, framing and 2:3 portrait composition of image 1 unchanged. Do not copy the nonmagical outfit or daytime scene from image 2. Minimal localized repair only. No text, no border.
```

## 3. 新 SSR 立绘方向：莓梦守护者

输入顺序：第一步输出的日常形态修复图；`public/art/bunny-b.png`。

输出：`public/art/bunny-ssr-concept.png`。

目标：用动态剪影、专属服装与道具、叙事场景拉开 SSR 和普通卡的区别。维持奶兔角色辨识度。这是一幅方向提案，尚未制作对应的第二形态。

准确提示词：

```text
Use case: stylized-concept. Create a NEW premium SSR collectible illustration variant of the SAME strawberry bunny, for a side-by-side comparison with the current simpler plush portrait cards. Reference 1 anchors character identity: cream plush rabbit, round brown eyes, pink cheeks, tiny mouth, mint bow on the single floppy ear at viewer right, one upright ear at viewer left. Reference 2 establishes strawberry magic, pink cape, small golden crown. Output ONE full-bleed 2:3 portrait illustration, NO card border, NO lettering, NO rarity icons. Art direction: an extraordinary 'Strawberry Dreamkeeper' storybook key visual with real narrative and unmistakable rare-card silhouette, not just extra sparkle over a standing plush portrait. The bunny is full-body but large enough to read at thumbnail size, gracefully FLOATING in a three-quarter dynamic diagonal pose above a luminous giant translucent strawberry-shaped glass garden, one paw extending a delicate star-tipped strawberry scepter, the other cradling a small glowing berry. Exactly two arms, two legs, two anatomically continuous ears; face fully visible and adorable. A richly crafted petal-layer ceremonial cape lined in warm ivory, fine gold seed embroidery and tiny dew-pearl closures sweeps in a beautiful broad arc behind it, a delicate strawberry-blossom tiara rather than a generic crown. Silhouette elegant and clean. Around the bunny, a few large arching strawberry blossoms and suspended crystal strawberries form a coherent magical greenhouse/celestial garden architecture; layered foreground petals, midground character, distant moonlit cloud garden with a subtle large circular halo. Warm strawberry pink and cream hero against deep twilight lavender/teal atmosphere, soft peach key light on face, precise golden rim light, controlled luminous highlights, sumptuous plush fur, translucent glass, pearl and satin details. Strong composed lighting and premium cinematic depth. Whimsical, kawaii, collectible, inviting, not dark or aggressive. Do not overcrowd with tiny particles. No extra companions, no collage, no text, no watermarks. This must clearly read as a special narrative illustration compared to a common card's static isolated sitting mascot.
```

对比页：运行应用后打开 http://localhost:5187/compare-ssr.html 。
