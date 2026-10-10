# 绒绒星球 · Fluffy Planet

`fluffy-planet-gacha` 是一款移动端优先的萌物抽卡与收藏体验。它包含单抽和十连、稀有度分层演出、3D 卡片、SSR 双形态、萌物图鉴，以及卡片收纳动画。

## 本地运行

需要 Node.js 和 npm。

```sh
npm ci
npm run dev
```

Vite 默认在 <http://localhost:5187/> 启动。生产构建和测试命令：

```sh
npm run build
npm test
```

## 技术栈

- React 19、Vite 7
- Three.js 卡片查看器与光栅材质
- 浏览器 `localStorage` 保存抽卡记录和图鉴

## 项目结构

- `src/`：应用、抽卡逻辑、卡面合成和交互动画
- `public/art/`：按角色、卡片组件、界面、PNG 原图和旧提案整理；先看 [`素材说明`](public/art/00-素材说明.md)
- `public/media/`：待机与抽卡视频
- `cards/`：Blender 角色工程和模型素材
- `design/`：设计素材来源、提示词和资源体积记录
- `tests/`：抽卡规则与收纳路径测试

两段视频目前为 900×1600；待机无音轨，抽卡视频保留 AAC。首屏资源清单和压缩对照见 [`design/首屏资源与无损压缩报告.md`](design/首屏资源与无损压缩报告.md)。

本项目是本地浏览器演示，不含账号、支付或服务端同步。卡片素材的复用来源和授权说明见 [`HOLO-CARD-LICENSE.txt`](HOLO-CARD-LICENSE.txt) 与 `public/fonts/OFL.txt`。
