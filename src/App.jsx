import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import {
  Volume2,
  VolumeX,
  BookOpen,
  Gift,
  Info,
  Heart,
  History,
} from "lucide-react";
import Home from "./components/Home";
import IdleScene from "./components/IdleScene";
import Collection from "./components/Collection";
import Reveal from "./components/Reveal";
import Effects from "./components/Effects";
import Modal from "./components/Modal";
import { readState, drawCards, STORAGE_KEY } from "./game";
import { CARD_MAP } from "./data";
import { sound } from "./audio";
import { mediaUrl, loadViewer } from "./preload";
const CardViewer = lazy(loadViewer);
const DEFAULT_VIDEO = {
  url: "/media/summon.mp4",
  name: "绒绒星球 · 抽卡演出",
  builtin: true,
};
export default function App() {
  const [state, setState] = useState(() => readState(localStorage));
  const [page, setPage] = useState("home"),
    [modal, setModal] = useState(null),
    [view, setView] = useState(null),
    [soundOn, setSoundOn] = useState(false),
    [phase, setPhase] = useState(() =>
      state.pending.length ? "results" : null,
    ),
    [notice, setNotice] = useState("");
  const lock = useRef(false);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      setNotice("浏览器存储空间不足，本次收藏暂时无法保存。");
    }
  }, [state]);
  const draw = (count) => {
    if (lock.current || phase || state.pending.length) return;
    lock.current = true;
    sound("draw", soundOn);
    try {
      const next = drawCards(state, count);
      setState(next);
      setPhase("cinematic");
    } finally {
      lock.current = false;
    }
  };
  const finish = () => {
    setState((s) => ({ ...s, pending: [] }));
    setPhase(null);
  };
  return (
    <div className={`app page-${page} ${phase ? "is-drawing" : ""}`}>
      {page === "home" ? (
        <IdleScene active={!phase && !view && !modal} />
      ) : (
        <div className="world-art" aria-hidden="true" />
      )}
      {page === "home" && !view && !phase && <Effects />}
      <header className="site-header" inert={phase ? true : undefined}>
        <button
          className="brand"
          aria-label="绒绒星球首页"
          onClick={() => setPage("home")}
        >
          <img className="brand-logo" src="/art/fluffy-planet-logo-v3.webp" alt="绒绒星球" />
          <span>
            <strong>绒绒星球</strong>
            <small>FLUFFY PLANET</small>
          </span>

        </button>
        <nav aria-label="主导航">
          <button
            className={page === "home" ? "selected" : ""}
            onClick={() => setPage("home")}
          >
            <Gift size={19} />
            扭蛋小屋
          </button>
          <button
            className={page === "collection" ? "selected" : ""}
            onClick={() => setPage("collection")}
          >
            <BookOpen size={19} />
            萌物图鉴
            {Object.keys(state.collection).length > 0 && (
              <span className="nav-count">
                {Object.keys(state.collection).length}
              </span>
            )}
          </button>
        </nav>
        <div className="header-tools">
          <button
            className="icon-button history-button"
            onClick={() => setModal("history")}
            aria-label="相遇记录"
          >
            <History size={19} />
          </button>
          <button
            className="icon-button sound-button"
            aria-label={soundOn ? "关闭音效" : "开启音效"}
            aria-pressed={soundOn}
            onClick={() => {
              setSoundOn(!soundOn);
              sound("click", !soundOn);
            }}
          >
            {soundOn ? <Volume2 size={21} /> : <VolumeX size={21} />}
          </button>
        </div>
      </header>
      {page === "home" ? (
        <Home
          state={state}
          onDraw={draw}
          onView={setView}
          onRules={() => setModal("rules")}
          onCollection={() => setPage("collection")}
          busy={!!phase}
        />
      ) : (
        <Collection
          state={state}
          onView={setView}
          onHome={() => setPage("home")}
        />
      )}
      <footer className="app-footer" inert={phase ? true : undefined}>
        <span>FLUFFY PLANET · VOL. 01</span>
        <button onClick={() => setModal("rules")}>
          玩法与概率 <Info size={12} />
        </button>
        <span>免费试玩 · 无需付费</span>
      </footer>
      {phase && (
        <Reveal
          items={state.pending}
          phase={phase}
          setPhase={setPhase}
          onFinish={finish}
          onView={setView}
          soundOn={soundOn}
          video={{ ...DEFAULT_VIDEO, url: mediaUrl(DEFAULT_VIDEO.url) }}
          viewerOpen={!!view}
        />
      )}
      <Suspense
        fallback={<div className="viewer-loading">小可爱正在赶来…</div>}
      >
        {view && (
          <CardViewer
            key={view.id}
            card={view}
            owned={state.collection[view.id] || 0}
            onClose={() => setView(null)}
          />
        )}
      </Suspense>
      {modal === "rules" && (
        <Modal
          title="玩法与概率"
          onClose={() => setModal(null)}
          className="rules-modal"
        >
          <span className="modal-symbol">
            <Info />
          </span>
          <h2>快乐的小规则</h2>
          <p>免费、无限次的萌物抽卡体验。</p>
          <div className="probability-table">
            <div>
              <span className="rarity-tag SSR">SSR</span>
              <b>5%</b>
              <span>2 位 · 双形态变身</span>
            </div>
            <div>
              <span className="rarity-tag SR">SR</span>
              <b>20%</b>
              <span>4 位 · 全息闪卡</span>
            </div>
            <div>
              <span className="rarity-tag R">R</span>
              <b>75%</b>
              <span>6 位 · 萌物卡</span>
            </div>
          </div>
          <ul>
            <li>同稀有度内，每位萌友等概率出现。</li>
            <li>
              连续 29 抽没有 SSR，第 30 抽必得
              SSR；抽到后重新计数。单抽与十连共享保底。
            </li>
            <li>
              每次十连至少一张 SR 或 SSR。前 9 张均为 R 时，第 10 张若仍为
              R，会提升为 SR。
            </li>
            <li>
              SSR
              有两张专门绘制的完整卡面。倾斜卡片，日常形态就会变身；拖动可继续翻转查看卡背。
            </li>
            <li>
              以上为基础概率；保底会提高实际获得比例。重复卡累计数量，收藏仅保存在当前浏览器。
            </li>
          </ul>
          <button className="primary-button" onClick={() => setModal(null)}>
            知道啦，去遇见小可爱
          </button>
        </Modal>
      )}
      {modal === "history" && (
        <Modal
          title="相遇记录"
          onClose={() => setModal(null)}
          className="history-modal"
        >
          <h2>每一次相遇</h2>
          <p>最近 100 次，都会被好好记住。</p>
          {state.history.length ? (
            <div className="history-list">
              {state.history.map((item) => (
                <div key={item.serial}>
                  <span className="history-number">#{item.serial}</span>
                  <span className={`rarity-tag ${CARD_MAP[item.id].rarity}`}>
                    {CARD_MAP[item.id].rarity}
                  </span>
                  <strong>{CARD_MAP[item.id].name}</strong>
                  <small>{item.isNew ? "初次见面" : "又见面啦"}</small>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">
              <Heart size={38} />
              <p>还没有记录，去抽一份快乐吧。</p>
            </div>
          )}
        </Modal>
      )}
      {notice && (
        <div className="notice" role="status">
          {notice}
          <button onClick={() => setNotice("")}>知道了</button>
        </div>
      )}
    </div>
  );
}
