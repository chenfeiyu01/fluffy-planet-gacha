import React, { useEffect, useState, useRef } from "react";
import {
  Sparkles,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import { CARD_MAP } from "../data";
import { sound } from "../audio";
import CardFace from "./CardFace";
import CardBack from "./CardBack";
import CardBag from "./CardBag";
import { pocketFlight } from "../pocketMotion";
import { loadCardArtwork, loadCardBack } from "../cardArtwork";

async function prepareResultCards(items) {
  const artwork = await Promise.all([...new Set(items.map((item) => item.id))].flatMap((id) => [
    loadCardBack(CARD_MAP[id]),
    loadCardArtwork(CARD_MAP[id]),
  ]));
  await Promise.all([...new Set(artwork.map((result) => result.url))].map(async (url) => {
    const image = new Image();
    image.src = url;
    await image.decode();
  }));
}

function Cinema({ video, onFinish, soundOn }) {
  const ref = useRef();
  const backdrop = useRef();
  const [needsPlay, setNeedsPlay] = useState(false);
  const [error, setError] = useState(false);
  const [light, setLight] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.play().catch(() => setNeedsPlay(true));
    backdrop.current?.play().catch(() => {});
  }, []);
  return (
    <div className="cinema-stage">
      <video
        className="cinema-fill-video"
        ref={backdrop}
        src={video.url}
        muted
        playsInline
        aria-hidden="true"
      />
      <video
        className="cinema-main-video"
        ref={ref}
        src={video.url}
        poster="/art/screen/summon-first-frame.webp"
        playsInline
        muted={!soundOn}
        preload="auto"
        onEnded={onFinish}
        onError={() => setError(true)}
        onPlaying={() => setNeedsPlay(false)}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          if (Number.isFinite(el.duration)) {
            setLight(
              Math.max(
                0,
                Math.min(1, (el.currentTime - el.duration + 0.55) / 0.4),
              ),
            );
          }
          if (
            backdrop.current &&
            Math.abs(backdrop.current.currentTime - el.currentTime) > 0.3
          ) {
            backdrop.current.currentTime = el.currentTime;
          }
        }}
      />
      <div
        className="cinema-light"
        style={{ opacity: light }}
        aria-hidden="true"
      />
      {needsPlay && !error && (
        <button
          className="cinema-play"
          onClick={() => ref.current?.play().catch(() => setError(true))}
        >
          <Play size={26} />
          播放惊喜
        </button>
      )}
      {error && (
        <div className="cinema-error">
          <p>这段视频暂时无法播放。</p>
          <button className="primary-button" onClick={onFinish}>
            直接揭晓
          </button>
        </div>
      )}
      <button className="skip-cinema" onClick={onFinish}>
        跳过演出 <ArrowRight size={14} />
      </button>
    </div>
  );
}
export default function Reveal({
  items,
  phase,
  setPhase,
  onFinish,
  onView,
  soundOn,
  video,
  viewerOpen,
}) {
  const [cinemaExiting,setCinemaExiting] = useState(false);
  const [cardsPending, setCardsPending] = useState(false);
  const cinemaDone = useRef(false);
  const cinemaExitTimer = useRef();
  const preparation = useRef(null);
  useEffect(() => {
    preparation.current = prepareResultCards(items);
    preparation.current.catch(console.error);
  }, [items]);
  const finishCinema = async () => {
    if(cinemaDone.current) return;
    cinemaDone.current = true;
    setCardsPending(true);
    try {
      await (preparation.current || prepareResultCards(items));
    } catch (error) {
      console.error(error);
    }
    setCardsPending(false);
    setCinemaExiting(true);
    setPhase("results");
    cinemaExitTimer.current=setTimeout(()=>setCinemaExiting(false),750);
  };
  const [tierEffect, setTierEffect] = useState(null);
  const [autoReveal, setAutoReveal] = useState(false);
  const lastRevealed = useRef(null);
  const [opened, setOpened] = useState(new Set());
  const [rareQueue, setRareQueue] = useState([]);
  const [collecting, setCollecting] = useState(false);
  const [turning, setTurning] = useState(new Set());
  const flipTimers = useRef([]);
  const [flights, setFlights] = useState([]);
  const [active, setActive] = useState(0);
  const grid = useRef(),
    collectTimer = useRef(),
    collectionLock = useRef(false);
  const rareIndex = rareQueue[0];
  const rare = rareIndex === undefined ? null : CARD_MAP[items[rareIndex].id];
  useEffect(() => {
    if (!rare) return;
    sound("rare", soundOn);
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 450 : rare.rarity === "SR" ? 2300 : 2700;
    // Prepare the underlying face while the reveal stage is still opaque.
    const prepareTimer = setTimeout(() => {
      setOpened((old) => new Set([...old, rareIndex]));
      if (innerWidth <= 760) scrollTo(rareIndex);
    }, duration * 0.65);
    const timer = setTimeout(
      () => {
        lastRevealed.current = rareIndex;
        if (rare.rarity === "SSR") {
          setAutoReveal(false);
          lastRevealed.current = null;
          onView(rare);
        }
        setRareQueue((old) => old.slice(1));
      },
      duration,
    );
    return () => { clearTimeout(prepareTimer); clearTimeout(timer); };
  }, [rareIndex]);
  useEffect(
    () => () => {
      clearTimeout(collectTimer.current);
      clearTimeout(cinemaExitTimer.current);
      flipTimers.current.forEach(clearTimeout);
    },
    [],
  );
  const normalReveal = (i, delay = 0) => {
    const run = () => {
      lastRevealed.current = i;
      const bounds=grid.current.children[i].getBoundingClientRect();
      setTierEffect({card:CARD_MAP[items[i].id],x:bounds.left,y:bounds.top,w:bounds.width,h:bounds.height});
      setOpened((old) => new Set([...old, i]));
      setTurning((old) => new Set([...old, i]));
      flipTimers.current.push(
        setTimeout(
          () => {
            setTierEffect(null);
            setTurning((old) => {
              const next = new Set(old);
              next.delete(i);
              return next;
            });
          },
          CARD_MAP[items[i].id].rarity === "SR" ? 2200 : 1550,
        ),
      );
    };
    if (delay) flipTimers.current.push(setTimeout(run, delay));
    else run();
  };
  const collect = () => {
    if (collectionLock.current || rare || turning.size) return;
    collectionLock.current = true;
    setAutoReveal(false);
    setFlights(
      [...grid.current.children].map((node, i) => {
        const rect = node.getBoundingClientRect();
        const img = node.querySelector(
          opened.has(i) ? ".result-front img" : ".result-back img",
        );
        return {
          i,
          src: img?.src || "/art/card-parts/backs/card-back.webp",
          ...pocketFlight(rect, i, items.length, {
            width: innerWidth,
            height: innerHeight,
          }),
        };
      }),
    );
    setCollecting(true);
    sound("reveal", soundOn);
    collectTimer.current = setTimeout(
      onFinish,
      matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 200
        : 3500 + items.length * 35,
    );
  };
  useEffect(() => {
    const handler = (e) => {
      if (
        e.key === "Escape" &&
        !document.querySelector("dialog[open]") &&
        phase === "results"
      )
        collect();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [phase, rare, opened, turning]);
  const reveal = (i) => {
    if (rare || collecting || turning.size || cinemaExiting) return;
    if (opened.has(i)) {
      onView(CARD_MAP[items[i].id]);
      return;
    }
    if (CARD_MAP[items[i].id].rarity !== "R") {
      setRareQueue([i]);
      return;
    }
    normalReveal(i);
    sound("reveal", soundOn);
  };
  const all = () => {
    if (collecting) return;
    setAutoReveal((value) => !value);
  };
  const scrollTo = (i) => {
    const el = grid.current?.children[i];
    if (el) {
      grid.current.scrollTo({
        left: el.offsetLeft - (grid.current.clientWidth - el.clientWidth) / 2,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
      setActive(i);
    }
  };
  useEffect(() => {
    if (
      phase !== "results" ||
      rare ||
      turning.size ||
      collecting ||
      viewerOpen ||
      cinemaExiting
    )
      return;
    const next = items.findIndex((_, i) => !opened.has(i));
    if (next < 0) {
      setAutoReveal(false);
      return;
    }
    if (!autoReveal && lastRevealed.current === null) return;
    const last = lastRevealed.current;
    const hold =
      last === null
        ? 0
        : CARD_MAP[items[last].id].rarity === "SSR"
          ? 1300
          : CARD_MAP[items[last].id].rarity === "SR"
            ? 1000
            : 450;
    let flipTimer;
    const moveTimer = setTimeout(() => {
      scrollTo(next);
      lastRevealed.current = null;
      if (autoReveal)
        flipTimer = setTimeout(
          () => reveal(next),
          matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 380,
        );
    }, hold);
    return () => {
      clearTimeout(moveTimer);
      clearTimeout(flipTimer);
    };
  }, [
    autoReveal,
    opened,
    turning,
    rareIndex,
    collecting,
    viewerOpen,
    phase,
    cinemaExiting,
  ]);
  const onScroll = () => {
    const el = grid.current;
    if (!el || innerWidth > 760) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0,
      dist = Infinity;
    [...el.children].forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - center);
      if (d < dist) {
        dist = d;
        nearest = i;
      }
    });
    setActive(nearest);
  };
  const ready = opened.size === items.length;
  const detailIndex = opened.has(active) ? active : [...opened].at(-1);
  return (
    <section
      className={`reveal-overlay phase-${phase} ${collecting ? "is-collecting" : ""}`}
      role="region"
      aria-label="抽卡结果"
      aria-live="polite"
    >
      {video && (phase === "cinematic" || cinemaExiting) && (
        <div className={`cinema-transition ${cinemaExiting ? 'is-leaving' : ''}`}>
          <Cinema video={video} soundOn={soundOn} onFinish={finishCinema}/>
          {cardsPending && <span className="cinema-card-wait">正在整理刚遇见的小伙伴…</span>}
        </div>
      )}
      {phase !== "cinematic" && (
        <div className={`results ${items.length === 1 ? "single-result" : ""}`}>
          <div className="results-heading">
            <span className="little-stars">FLUFFY PLANET · NEW ENCOUNTER</span>
            <h2>{ready ? "相遇，值得珍藏" : "是谁来到你身边"}</h2>
            <p>
              {ready
                ? "轻触卡面，查看详情。"
                : `轻触翻开 · ${opened.size} / ${items.length}`}
            </p>
          </div>
          <div className="result-card-stage">
          <div className="result-grid" ref={grid} onScroll={onScroll}>
            {items.map((item, i) => {
              const c = CARD_MAP[item.id],
                open = opened.has(i);
              return (
                <button
                  key={item.serial}
                  className={`result-card ${open ? "is-open" : ""} ${turning.has(i) ? "is-turning" : ""} rarity-${c.rarity}`}
                  style={{ "--delay": `${i * 0.085}s`, "--accent": c.color }}
                  onClick={() => reveal(i)}
                  aria-label={open ? `查看${c.name}的3D卡片与故事` : `揭晓第${i + 1}张卡片`}
                >
                  <div className="result-flipper">
                    <div className="result-back" aria-hidden={open}>
                      <CardBack card={c} />
                    </div>
                    <div className="result-front" aria-hidden={!open}>
                      <CardFace card={c} />
                    </div>
                  </div>

                </button>
              );
            })}
          </div>
          {detailIndex !== undefined && !turning.has(detailIndex) && (
            <button className="card-detail-guide" onClick={() => reveal(detailIndex)}>
              <span>轻触查看</span>
            </button>
          )}
          </div>
          {items.length > 1 && (
            <div className="carousel-controls">
              <button
                className="icon-button"
                disabled={active === 0}
                onClick={() => scrollTo(Math.max(0, active - 1))}
                aria-label="上一张"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="card-dots">
                {items.map((_, i) => (
                  <button
                    aria-label={`跳到第${i + 1}张`}
                    key={i}
                    className={`${active === i ? "active" : ""} ${opened.has(i) ? "revealed" : ""}`}
                    onClick={() => scrollTo(i)}
                  />
                ))}
              </div>
              <button
                className="icon-button"
                disabled={active === items.length - 1}
                onClick={() => scrollTo(Math.min(items.length - 1, active + 1))}
                aria-label="下一张"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
          <div className="result-actions">
            {!ready && (
              <button
                className="primary-button"
                onClick={all}
                disabled={collecting}
              >
                <Sparkles size={18} />
                {autoReveal ? "暂停连翻" : "逐张揭晓"}
              </button>
            )}
            <button
              className={ready ? "primary-button" : "soft-button"}
              onClick={collect}
              disabled={collecting || !!rare || turning.size > 0}
            >
              {ready ? (
                <>
                  <Heart size={18} />
                  收进口袋
                </>
              ) : (
                "收好并返回"
              )}
              <ArrowRight size={17} />
            </button>
          </div>
          <p className="saved-note">已自动放入萌物图鉴，小可爱不会走丢。</p>
        </div>
      )}
      {tierEffect && !rare && <div className={`tier-fx tier-${tierEffect.card.rarity}`} aria-hidden="true" style={{left:tierEffect.x,top:tierEffect.y,width:tierEffect.w,height:tierEffect.h}}>
        <div className="tier-aura"/><div className="tier-ring"/>
        <div className="tier-label">{tierEffect.card.rarity === 'SR' ? '✦ SR · 闪耀相遇 ✦' : '✧ 新的相遇 ✧'}</div>
        {Array.from({length:tierEffect.card.rarity==='SR'?18:8},(_,n)=><i key={n} style={{'--a':`${n*(tierEffect.card.rarity==='SR'?20:45)}deg`,'--wait':`${.6+n%3*.06}s`}}>✦</i>)}
      </div>}
      {rare && (
        <div
          className={`legendary-reveal rarity-${rare.rarity}`}
          key={rareIndex}
          role="status"
          aria-label={`${rare.rarity} ${rare.name} 特别揭晓`}
        >
          <div className="legendary-rays" />
          <div className="legendary-orbit" />
          <div className="legendary-card">
            <div className="legendary-flip">
              <div className="legendary-back">
                <CardBack card={rare} alt="" />
              </div>
              <div className="legendary-front">
                <CardFace card={rare} />
              </div>
            </div>
          </div>
          <div className="legendary-title">
            <span>{rare.rarity === "SR" ? "✿ SHINING ENCOUNTER ✿" : "✦ SPECIAL ENCOUNTER ✦"}</span>
            <strong>{rare.rarity}</strong>
            <p>{rare.name}</p>
          </div>
          {Array.from({ length: rare.rarity === "SR" ? 18 : 32 }, (_, i) => (
            <i
              className="legendary-spark"
              key={i}
              style={{
                "--a": `${i * 11.25}deg`,
                "--distance": `${120 + (i % 5) * 35}px`,
                "--wait": `${0.65 + (i % 6) * 0.055}s`,
              }}
            />
          ))}
        </div>
      )}
      {collecting && (
        <div
          className="pocket-scene"
          role="status"
          aria-label="正在收纳卡片"
          style={{
            "--mouth-y": `${flights[0]?.mouth || innerHeight * 0.78}px`,
            "--collect-duration": `${3500 + items.length * 35}ms`,
          }}
        >
          <div className="pocket-flight-layer">
            {flights.map((f) => (
              <div
                className="flying-card"
                key={f.i}
                style={{
                  left: f.x,
                  top: f.y,
                  width: f.w,
                  height: f.h,
                  "--gx": `${f.gx}px`,
                  "--gy": `${f.gy}px`,
                  "--dx": `${f.dx}px`,
                  "--hover-y": `${f.hoverY}px`,
                  "--enter-y": `${f.enterY}px`,
                  "--stack-scale": f.stackScale,
                  "--entry-scale": f.entryScale,
                  "--twist": `${f.tilt}deg`,
                  "--flight-delay": `${f.i * 35}ms`,
                }}
              >
                <img src={f.src} alt="" />
              </div>
            ))}
          </div>
          <CardBag
            count={items.length}
            src={
              flights[
                items.reduce(
                  (best, item, i) =>
                    ({ R: 0, SR: 1, SSR: 2 })[CARD_MAP[item.id].rarity] >
                    { R: 0, SR: 1, SSR: 2 }[CARD_MAP[items[best].id].rarity]
                      ? i
                      : best,
                  0,
                )
              ]?.src
            }
          />
        </div>
      )}
    </section>
  );
}
export function StarFace() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path
        d="M40 6C45 6 47 22 52 25S73 24 74 30 61 44 60 50 67 69 62 72 46 61 40 61 22 73 17 70 22 52 19 47 4 36 6 30 24 28 28 24 35 6 40 6Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="29" cy="40" r="3" fill="#805b50" />
      <circle cx="49" cy="40" r="3" fill="#805b50" />
      <path
        d="M35 48Q40 54 45 48"
        stroke="#805b50"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="23" cy="47" rx="5" ry="3" fill="#ffa6a9" />
      <ellipse cx="55" cy="47" rx="5" ry="3" fill="#ffa6a9" />
    </svg>
  );
}
