import React from "react";
import {
  Sparkles,
  Heart,
  ArrowUpRight,
  ChevronRight,
  Star,
  Info,
} from "lucide-react";
import { CARDS } from "../data";
import CardFace from "./CardFace";
export default function Home({
  state,
  onDraw,
  onView,
  onRules,
  onCollection,
  busy,
}) {
  return (
    <main
      className={`home ${busy ? "summoning" : ""}`}
      inert={busy ? true : undefined}
    >
      <section className="hero-copy">
        <h1>
          <span className="desktop-title">
            绒绒星球
            <br />
            <em>奇遇收藏</em>
          </span>
          <span className="mobile-title">
            绒绒星球
            <br />
            <em>奇遇收藏</em>
          </span>
        </h1>
        <p className="mobile-subtitle">FLUFFY PLANET · VOL. 01</p>
        <p className="intro">
          云朵里藏着一群小可爱，
          <br />
          下一位，会是谁呢？
          <Heart className="scribble-heart" size={30} />
        </p>
        <div className="today">
          <h3>
            <Star size={21} fill="#ffd68c" stroke="#e9ad67" />
            今日心动
          </h3>
          <button className="featured-card" onClick={() => onView(CARDS[0])}>
            <CardFace card={CARDS[0]} />
            <span className="featured-info">
              <strong>草莓奶兔</strong>
              <span className="rarity-tag SSR">SSR · 双形态</span>
              <small>
                像草莓一样
                <br />
                甜甜地拥抱你～
              </small>
              <span className="view-link">
                看看它的另一面 <ArrowUpRight size={15} />
              </span>
            </span>
          </button>
        </div>
      </section>
      <button
        className="machine-hotspot"
        disabled={busy}
        onClick={() => onDraw(1)}
        aria-label="转动扭蛋机，单抽一下"
      >
        <span className="machine-hello">hello, little friend ♡</span>
        <span className="machine-tip">
          <Sparkles size={15} /> 点一点，快乐就出发
        </span>
      </button>
      <aside className="preview-rail" aria-label="萌友预览">
        {[CARDS[1], CARDS[2], CARDS[3]].map((c) => (
          <button
            key={c.id}
            onClick={() => onView(c)}
            style={{ "--accent": c.color }}
          >
            <CardFace card={c} />
          </button>
        ))}
      </aside>
      <div className="draw-dock">
        <div className="mobile-pity">
          再 <strong>{30 - state.pity}</strong> 抽，必得 SSR
        </div>
        <div className="draw-buttons">
          <button
            className="draw-single"
            disabled={busy}
            onClick={() => onDraw(1)}
          >
            <span className="draw-label">
              <span className="desktop-title">一次相遇</span>
              <span className="mobile-title">一次相遇</span>
            </span>
          </button>
          <button
            className="draw-ten"
            disabled={busy}
            onClick={() => onDraw(10)}
          >
            <span className="draw-label">十次相遇</span>
          </button>
        </div>
        <button className="rules-link" onClick={onRules}>
          <Sparkles size={14} />
          十连必得 <b>SR</b>
          <span>·</span>30 抽必得 <b>SSR</b>
          <Info size={14} />
        </button>
      </div>
      <div className="home-bottom">
        <button className="pity-pill" onClick={onRules}>
          <Star size={26} fill="#ffdb9c" stroke="#efb260" />
          <span>
            距离 <b>SSR</b> 保底 <strong>{30 - state.pity}</strong> 抽
            <span className="pity-track">
              <i style={{ width: `${(state.pity / 30) * 100}%` }} />
            </span>
          </span>
        </button>
        <button className="collection-pill" onClick={onCollection}>
          <Heart size={18} />
          <span>
            {Object.keys(state.collection).length
              ? `已遇见 ${Object.keys(state.collection).length} / 12 位萌友`
              : "12 位萌友，等你遇见"}
          </span>
          <ChevronRight size={17} />
        </button>
      </div>
    </main>
  );
}
