import React, { useState, useEffect } from "react";
import { Heart, Lock, Sparkles, ArrowLeft } from "lucide-react";
import { CARDS } from "../data";
import CollectionArt from "./CollectionArt";
export default function Collection({ state, onView, onHome, closing = false }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    // Paint the stable, decoded grid once before starting the entrance transition.
    let second;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setEntered(true));
    });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, []);
  const [filter, setFilter] = useState("全部"),
    [ownedOnly, setOwnedOnly] = useState(false);
  const cards = CARDS.filter(
    (c) =>
      (filter === "全部" || c.rarity === filter) &&
      (!ownedOnly || state.collection[c.id]),
  );
  return (
    <main className={`collection-page ${entered ? "is-entered" : ""} ${closing ? "is-closing" : ""}`}>
      <div className="album-decor" aria-hidden="true">
        <span>✧</span>
        <span>✦</span>
        <span>✧</span>
        <span>✿</span>
      </div>
      <div className="album-opening" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <i key={i} style={{ "--petal-angle": `${i * 45}deg` }}>
            ✧
          </i>
        ))}
      </div>
      <div className="collection-heading">
        <div>
          <span className="collection-eyebrow">FLUFFY PLANET · COLLECTION</span>
          <h1>
            萌物图鉴
            <Heart size={28} />
          </h1>
          <p>
            已遇见 <b>{Object.keys(state.collection).length}</b> / {CARDS.length} 位萌友 ·
            一共拥抱了 {state.total} 次
          </p>
        </div>
        <button className="soft-button" onClick={onHome}>
          <ArrowLeft size={17} />
          返回扭蛋小屋
        </button>
      </div>
      <div className="collection-toolbar">
        <div className="filters">
          {["全部", "SSR", "SR", "R"].map((f) => (
            <button
              key={f}
              className={f === filter ? "active" : ""}
              onClick={() => setFilter(f)}
              aria-pressed={f === filter}
            >
              {f === "SSR" ? <Sparkles size={14} /> : null}
              {f}
            </button>
          ))}
        </div>
        <label>
          <input
            type="checkbox"
            checked={ownedOnly}
            onChange={(e) => setOwnedOnly(e.target.checked)}
          />
          只看已收藏
        </label>
      </div>
      <div className="collection-grid">
        {cards.map((c, index) => {
          const count = state.collection[c.id] || 0;
          return (
            <button
              className={`collection-card rarity-${c.rarity} ${count ? "collected" : "uncollected"}`}
              key={c.id}
              onClick={() => count && onView(c)}
              disabled={!count}
              aria-label={
                count
                  ? `${c.name} · ${c.rarity} · 已收藏 ${count} 张`
                  : `${c.rarity} 卡片 · 待解锁`
              }
              style={{
                "--accent": c.color,
                "--entry-delay": `${Math.min(index, 8) * 35}ms`,
              }}
            >
              <div className="collection-art">
                {count ? (
                  <CollectionArt card={c} />
                ) : (
                  <div className="locked-card">
                    <CollectionArt card={c} back />
                    <span className="locked-seal">
                      <Lock size={22} />
                      <b>待解锁</b>
                      <small>{c.rarity}</small>
                    </span>
                  </div>
                )}
              </div>
              <span className="collection-status">
                {count ? `已收藏 · ×${count}` : "等待相遇"}
              </span>
            </button>
          );
        })}
      </div>
      {!cards.length && (
        <div className="empty">
          <Heart size={38} />
          <h2>把第一位小可爱带回家吧</h2>
          <p>这里会好好收藏你们的每一次相遇。</p>
          <button className="primary-button" onClick={onHome}>
            去扭蛋小屋
          </button>
        </div>
      )}
      <p className="local-note">收藏会保存在当前浏览器，随时回来看看小伙伴。</p>
    </main>
  );
}
