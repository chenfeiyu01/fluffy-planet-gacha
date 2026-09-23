import React, { useEffect, useRef, useState } from "react";

import { mediaUrl } from "../preload";
export default function IdleScene({ active }) {
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const el = video.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    const sync = () => {
      if (!active || document.hidden || reduced.matches) {
        el.pause();
        if (reduced.matches) setPlaying(false);
      } else {
        el.play().catch(() => {
          if (!disposed) setPlaying(false);
        });
      }
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      el.pause();
    };
  }, [active]);
  return (
    <div className="world-art home-idle" aria-hidden="true">
      <img className="idle-poster" src="/art/summon-first-frame.webp" alt="" />
      <video
        ref={video}
        className={`idle-video ${playing ? "is-playing" : ""}`}
        src={mediaUrl("/media/home-idle.mp4")}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
        onError={() => setPlaying(false)}
      />
    </div>
  );
}
