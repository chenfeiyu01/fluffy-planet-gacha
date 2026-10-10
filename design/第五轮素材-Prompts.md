# 第五轮素材准备（待用户抠图）

使用内置 image_gen。生成工具两次返回包含棋盘格的 RGB 图片，没有有效 Alpha；用户已明确表示自行抠图。未使用本地程序修改图片像素。

最终待处理文件保存在上级输出目录 `待抠图素材/`：SR-A-包边-待抠图.png、SSR-C-包边-待抠图.png、卡包-恢复挂饰-待抠图.png。

包边需抠除外背景和中央立绘窗口；卡包需抠除外背景和展示窗。保留原尺寸、位置、姓名铭牌及所有挂饰，导出 RGBA PNG。卡包已恢复左侧交叉绑带、蝴蝶结与小花，以及右侧草莓挂件。

## sr-frame

输入：/Users/chenfeiyu/Documents/Codex/2026-09-22/wo-xia/outputs/fluffy-planet/public/art/design-v4/frame-berry.png

```text
Use case: precise-object-edit. Convert this approved strawberry-jewelry card concept into a production TRANSPARENT PNG FRAME OVERLAY. Keep the same portrait 2:3 canvas, original exact frame positions, silhouette, thin pink enamel border, gold vine details, flower/berry corner ornaments, blank nameplate, dimensions and lighting. REMOVE the bunny and ALL scene artwork inside the large inner picture window: make that entire picture opening genuinely transparent alpha, including between ornaments. Also remove the neutral background OUTSIDE the card, leaving genuinely transparent alpha exterior. Preserve the entire frame as a continuous connected object. Change the large bottom lettering from SSR to exactly 'SR', centered, matching the same pearl enamel and gold sculpted font. Empty name cartouche remains opaque and blank. No other text, no new art in the window, no checkerboard or black fill, no white picture backing. Preserve shape and framing exactly. This is an overlay to place on different character images, not a complete illustrated card.
```

## ssr-frame

输入：/Users/chenfeiyu/Documents/Codex/2026-09-22/wo-xia/outputs/fluffy-planet/public/art/design-v4/frame-crystal.png

```text
Use case: precise-object-edit. Turn this approved Moonlight Crystal Wings card into a production transparent PNG FRAME OVERLAY. Keep the exact 2:3 portrait canvas, original locations and sizes of all opal-lilac rails, upper-left crescent, lower-right crystal wings, asymmetrical silhouette, gold perimeter, white pearls, blank nameplate and the large sculptural SSR lettering on its deep purple base. REMOVE the bunny and the ENTIRE inside picture scene, replacing the inner picture window with genuinely TRANSPARENT alpha. Remove ALL neutral background OUTSIDE the irregular card outline, also genuinely transparent alpha; crescent and wing edges must be clean real cutouts. Keep all frame components connected to the main rails, no loose floating particles. Do not fill the window with black/white/checkerboard. Preserve frame positions and exact design, don't reimagine. No text except the existing 'SSR', nameplate stays blank. One isolated transparent frame, no backdrop or cast shadow outside edges.
```

## card-bag-closed

输入：/var/folders/ly/9nmzd0jn5hqc6nl366v04zd80000gn/T/codex-clipboard-0fc4ba15-dc7b-46fa-964d-85f71fc60e24.png

```text
Use case: precise-object-edit. Edit this supplied pink collectible-card display bag into a fresher younger boutique kawaii design, for a game animation sprite. Keep the recognizable structured rectangular CARD BAG silhouette, visible side gusset thickness, front clear card display window, one central pink grosgrain bow on the flap, one small strawberry charm on the right, soft strawberry-milk pink material, front-facing orthographic camera and square canvas. Simplify substantially: remove gold vine embroidery, gold rope scallops and repeated gold beads; remove the big embroidered strawberry and surrounding dense leaves on the flap; replace that entire flap decoration with ONE small simple white daisy applique centered above the bow. Replace ornate scalloped trim with simple warm ivory rounded piping and neat blush stitches. Reduce extra side bows and side embroidery to a clean little stitched side pocket. Thin rose-gold zipper/hardware only, not yellow-gold luxury hardware. Material should look like soft matte peachskin canvas/suede, not heavy velvet or old-fashioned tapestry. Keep large front display window with rounded corners, subtle clear vinyl reflection and a neat pink seam: its INTERIOR MUST be truly transparent alpha so a character card can be displayed beneath it, no strawberry patterned insert and no opaque white/black fill. Also make the exterior background genuinely transparent alpha. Bag stays CLOSED in this image. No text, no characters, no floor, no cast shadow background. Keep full bag and charm visible with generous 8% margins on all sides. This is one clean usable sprite; intentional delicate craft details, playful contemporary collectible merchandise, not a pouch or open basket.
```

## sr-frame-alpha

输入：/Users/chenfeiyu/.codex/generated_images/01a0c83e-1346-7d91-9d65-2118ad8f03fa/exec-5c4cdecd-5f22-4169-af86-9197fbf51dbc.png

```text
Background removal / transparent cutout. This image contains a FAKE checkerboard. Erase ALL checkerboard pixels, both outside the card border AND inside its large central picture opening. Return an actual RGBA PNG with alpha=0 in these areas. Keep the pink/gold floral SR frame, SR letters and blank nameplate exactly unchanged. This must be a usable transparent overlay, not a picture of transparency. No replacement background, no checkerboard grid, no white or gray or black fill. Preserve the original dimensions and all colored details.
```

## ssr-frame-alpha

输入：/Users/chenfeiyu/.codex/generated_images/01a0c83e-1346-7d91-9d65-2118ad8f03fa/exec-6c8701cd-bf8c-4e6a-b581-49c6f414dbf5.png

```text
Background removal / transparent cutout. Erase ALL fake gray checkerboard from this image, including the large inside picture opening and every gap OUTSIDE the irregular moon-and-crystal-wing frame. Return a real transparent RGBA PNG alpha cutout. Keep the frame, large SSR letters, nameplate, crescent, crystals and pearls exactly unchanged, same positions and dimensions. No replacement background, no grid pattern, no black or white backing. Only the frame itself stays opaque; the center and outer spaces have actual zero alpha.
```

## card-bag-restored

输入：/Users/chenfeiyu/.codex/generated_images/01a0c83e-1346-7d91-9d65-2118ad8f03fa/exec-40ef09a2-e562-461c-917b-f36b2e7c121d.png；/var/folders/ly/9nmzd0jn5hqc6nl366v04zd80000gn/T/codex-clipboard-0fc4ba15-dc7b-46fa-964d-85f71fc60e24.png

```text
Edit image 1 using image 2 for the missing accessories. Keep image 1's modern clean pink bag, ivory flap piping and single small daisy on the flap. RESTORE image 2's decorative side details: the LEFT side criss-cross pink ribbon through eyelets, the left bow with little white flower, the small embroidered daisy at bottom left, the white flower at center of the large front bow, and the beautiful opalescent strawberry jewel charm with its pink bow and flower on the RIGHT. Keep these accessories fully visible and uncut. Do not restore ornate gold vines or dense flap embroidery. Keep the bag structure, camera, scale, clean modern pink material. Remove the fake checkerboard from image 1 everywhere: return a REAL TRANSPARENT RGBA PNG with zero alpha outside the bag AND inside the front card display window. No grid pattern, no white or gray backing. The clear window is an actual hole in the alpha channel for a card to appear beneath it. No text, no cards. All decorative components intact, generous margins.
```



## 最终透明素材（用户提供）

三张 PNG 已验证真实 Alpha，未经离线图像修改原样接入：
- codex-clipboard-0ec1dbfa-753d-42ad-a4f0-6489231ce906.png → public/art/originals/card-parts/sr-frame.png
- codex-clipboard-942ff339-f513-46b2-b181-63a7a62595e5.png → public/art/originals/card-parts/ssr-frame.png
- codex-clipboard-1feb7073-e3d5-4a0f-bfeb-407033b3c281.png → public/art/originals/card-parts/card-bag.png

## SSR 新卡背印刷图

内置 imagegen；输出 public/art/originals/card-parts/ssr-back-art.png。图案本身全幅，无需透明，由应用按实际卡片镜像轮廓裁切。

```text
Use case: stylized-concept. Create a print artwork for the BACK of a premium cute Moonlight Crystal Wings collectible card, 2:3 portrait full-bleed illustration. This is a texture, NOT a product mockup: fill every pixel to the four edges with opalescent lavender and pale champagne-gold, no transparent area, no checkerboard, no surrounding background, no perspective. Center a small cream plush five-point star mascot with a gentle smiling face, sitting on an opal crescent, surrounded by a delicate embossed circular constellation seal. Large luminous opal crescent motif near UPPER RIGHT and a graceful pair of iridescent lilac crystal wing feathers at LOWER LEFT, gold engraved flowing lines, pearl points and restrained tiny stars linking the motifs. These motifs harmonize with a moon-and-crystal frame; cute and precious, refined and not overcrowded. Edges can be cropped into an irregular crescent/wing silhouette. Warm pearlescent and soft lavender enamel, dimensional polished fine gold details. NO text, NO letters, NO numbers, NO badges, NO butterflies, NO card name. One coherent high-quality back print with visible material texture, soft clear lighting, no huge glow.
```
