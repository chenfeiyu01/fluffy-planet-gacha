# 包边、SSR 字标与口袋设计

2026-09-22。使用内置 image_gen；未使用 CLI。三版包边是供选择的完整卡面概念图，尚未接入正式双形态卡面；SSR 字标与草莓口袋是具有 alpha 的 PNG，已用于应用。云朵口袋保留作备选。

## 草莓珠宝

输出：`public/art/design-v4/frame-berry.png`。
输入：现版奶兔魔法形态 public/art/bunny-b-repaired.png，作为角色与立绘参考。

准确提示词：

```text
Use case: compositing. Create ONE premium collectible card FRAME DESIGN concept around the exact strawberry bunny artwork in the reference. Preserve the entire bunny identity, ear anatomy, face, pose and background illustration inside the card, resize it proportionally to fit a generous inner window. 2:3 portrait canvas, straight-on flat product mockup, no perspective, full card visible with 4% breathing room on a warm light neutral background. Direction A: STRAWBERRY JEWELRY. An exquisitely crafted blush-pink translucent enamel and champagne-gold jewelry frame, slim gold vines, a few dimensional strawberry-blossom corner ornaments with opal centers, delicate strawberry-red faceted drops, mint leaf inlays. Richly designed but not crowded; at least 78% width devoted to the artwork; no massive opaque panel hiding the rabbit. Refined rounded-rectangle collectible silhouette. At bottom center, a VERY prominent custom three-dimensional gold 'SSR' wordmark, exactly S S R, spanning about 45% of card width, bold sculpted softly flared serif letterforms, pale opalescent face and dark rose-gold bevel providing crisp contrast. It must read as a treasured rare-card emblem even at phone size. Integrate the wordmark into a graceful jeweled setting, not generic typed text. One empty narrow smooth name cartouche just ABOVE the rarity emblem, no text in that cartouche. No other writing, no tiny captions, no stars row, no logos. Plush adorable character, luxury whimsical toy-collectible mood, controlled pearlescent highlights; no aggressive armor, no baroque clutter. This is one cohesive card mockup, not a sheet.
```

## 云朵绒绣

输出：`public/art/design-v4/frame-cloud.png`。
输入：现版奶兔魔法形态 public/art/bunny-b-repaired.png，作为角色与立绘参考。

准确提示词：

```text
Use case: compositing. Create ONE premium collectible card FRAME DESIGN concept around the exact strawberry bunny artwork in the reference. Keep the same bunny, face, anatomically correct two ears, pose and background illustration in the inner window, scale proportionally without distortion. 2:3 portrait canvas, straight-on flat product mockup, entire silhouette visible with 4% margins on a warm light neutral backdrop, no perspective. Direction B: CLOUD COUTURE. A refined soft sculpted scalloped cloud frame in warm ivory with very short velvety pile, blush satin piping and exquisitely sewn gold threads. Two small asymmetric bow knots and little pearlescent star charms attach at the edges, subtle pale mint and peach accents. Slightly irregular cloud-shaped outline while retaining a vertical 2:3 central card. This is elegant designer plush merchandise, tactile delicate embroidery and satin, not a childish thick puffy phone case. Keep at least 78% width for the bunny art, framing never covers its face or ears. At bottom center a LARGE custom 'SSR' wordmark, exactly S S R, spanning 45% of card width: dimensional padded ivory satin letters with crisp polished honey-gold bevel and dark cocoa outline, rounded confident sculpted lettering, on a small winged cloud setting. Highly readable at thumbnail size. One empty slim satin name ribbon just ABOVE the wordmark for later typesetting. No other text, no tiny writing, no ratings rows, no watermark. Softly lit premium cozy collectible, beautifully restrained details.
```

## 月光晶翼

输出：`public/art/design-v4/frame-crystal.png`。
输入：现版奶兔魔法形态 public/art/bunny-b-repaired.png，作为角色与立绘参考。

准确提示词：

```text
Use case: compositing. Design ONE beautiful premium SSR collectible card frame mockup using the reference as the exact inner illustration. Preserve strawberry bunny identity, face, correct ears, pose and scene, proportional scaling only. 2:3 portrait composition, straight-on flat product shot without perspective, full silhouette visible on warm light-neutral backdrop with 4% margin. Direction C: MOONLIGHT CRYSTAL WINGS. A distinctive subtly ASYMMETRICAL outer frame, narrow translucent opal-lilac crystal rails lined with polished champagne gold, one graceful crescent arc rising just beyond the upper-left corner and two tiny faceted crystal wing petals extending at the lower-right edge. A delicate celestial orbit curls along the border, with three well-placed pearl studs and one peach gemstone. Cute dreamy collector's jewel, not sci-fi armor or spiky weapons. Large clean inner art window at least 78% of card width, no decoration over bunny's face. At bottom center a highly prominent custom 'SSR' wordmark, exactly S S R, about 45% card width. Bold bespoke sculptural lettering with iridescent ivory faces, gold bevels and deep plum inset shadows, sweeping terminal flourishes integrated into a small crescent setting, very readable even small. One empty slim opalescent name cartouche just ABOVE the wordmark. No other writing, no microtext, no tiny captions or star ratings. More silhouette and material contrast than the other concepts; coherent, precious, whimsical and polished.
```

## SSR字标

输出：`public/art/design-v4/ssr-emblem.png`。
输入：无参考图，从文字生成。

准确提示词：

```text
Use case: logo-brand. Asset: transparent PNG game rarity emblem to overlay on a cute collectible card. Create ONE large custom sculptural 'SSR' wordmark, exactly the capital letters S S R, no other writing. Landscape 3:2 canvas. Front-on, centered and occupying 88% of width, with 8% clear margins and genuinely TRANSPARENT alpha background. Bespoke bold slightly flared serif letterforms, thick readable strokes, exquisite polished champagne-gold bevels, softly iridescent ivory-peach enamel faces, rich rose-brown inset shadows defining every letter. A tiny four-point jewel accent above the middle S and a very fine paired curved ribbon flourish beneath connect the letters as ONE collectible emblem. The three letters must dominate and be instantly readable at 80 pixels wide. Precious, soft magical, high-end kawaii trading-card game aesthetic, restrained ornament, no crown, no large wings, no surrounding badge plate, no backdrop, no fake checkerboard, no isolated particles, no diffuse outer glow, no huge soft cast shadow. Keep close crisp edges and a modest local contact shadow within the emblem. Render a usable cutout asset.
```

## 草莓刺绣口袋

输出：`public/art/design-v4/pocket-berry.png`。
输入：无参考图，从文字生成。

准确提示词：

```text
Use case: stylized-concept. Asset: production-ready game sprite, ONE exquisite open collectible-card pouch, isolated on a truly TRANSPARENT alpha background, no floor, no backdrop or fake checkerboard. Square canvas, orthographic mostly front-on with only slight top visibility to see opening, object centered occupying 90% width and 80% height. Design a plump little blush-pink velvet card purse with scalloped ivory satin edging, detailed tiny gold seed stitching, a tasteful central embroidered strawberry blossom and berry motif, a small mint satin bow attached to one side, and one opal strawberry charm at the right. Boutique plush craft quality, tactile fine velvet, softly rounded bottom, refined seams, beautiful warm soft highlights, no letters and no faces. IMPORTANT practical geometry: pouch is OPEN with a broad horizontal dark plum mouth; opening centered at x=50%, its front lip located around y=27% of canvas, wide enough for a stack of cards. The mouth must have a nearly horizontal FRONT rim across the central 60% of canvas so animated cards can slide behind it. No tall handles, no lid, no ears, no upright drawstrings blocking the opening. Front body extends from y=28% to y=84%, perfectly readable at 180px sprite size. No cards included. Only the pouch, fully visible, adorable and luxurious, not a flat vector icon. Transparent exterior, crisp cutout edges, no broad outer drop shadow.
```

## 云朵星星口袋

输出：`public/art/design-v4/pocket-cloud.png`。
输入：无参考图，从文字生成。

准确提示词：

```text
Use case: stylized-concept. Asset: game sprite, ONE designer collectible-card pouch, isolated on genuinely TRANSPARENT alpha background, no backdrop or fake checkerboard. Square canvas, orthographic mostly front-on with slight top visibility, centered full object, occupying 90% width and 80% height. Direction: an elegant ivory boucle plush cloud-shaped open pouch, warm pearly satin piping, small pale-lavender bow at one side, a softly smiling tiny embroidered golden star medallion at center and a fine crescent charm. Refined short-loop fabric texture, miniature double stitches, soft scalloped cloud bottom, cozy sophisticated premium plush merchandise. IMPORTANT geometry: a broad horizontal open dark lavender interior mouth, with front lip centered around y=27% canvas height, central 60% nearly horizontal to allow a card stack to slide behind it. Body extends y=28% to y=84%. No handles, lid, tall ears or drawstrings obstructing the mouth. No cards in image, no text, no extra objects. Keep decoration sparse and meaningful; clearly different silhouette/material from a pink leather purse. Beautiful soft studio light, gentle local shadows within object, crisp usable cutout, no large external cast shadow. Must look crafted and tactile at 180px sprite size.
```


