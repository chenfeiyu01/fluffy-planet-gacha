import React, { useEffect, useState } from "react";
import { preload } from "../preload";
export default function BootScreen({ children }) {
  const [progress, setProgress] = useState(0),
    [ready, setReady] = useState(false),
    [error, setError] = useState(false),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let live = true;
    setError(false);
    preload((p) => live && setProgress(p))
      .then(() => live && setReady(true))
      .catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, [attempt]);
  if (ready) return children;
  return (
    <main className="boot-screen" aria-busy={!error}>
      <img className="boot-illustration" src="/art/screen/loading-garden.webp" alt="" fetchPriority="high" />
      <div className="boot-sky-stars" aria-hidden="true">✧ <span>✦</span> ✧</div>
      <div className="boot-brand"><span>WELCOME TO</span><h1>绒绒星球</h1><small>FLUFFY PLANET</small></div>
      <div className="boot-status">

      <p>{error ? "有几位小伙伴还没到齐" : "正在准备你的扭蛋小屋"}</p>
      <div
        className="boot-progress"
        role="progressbar"
        aria-label="素材准备进度"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <i style={{ width: `${progress}%` }} />
      </div>
      <span className="boot-percent">{progress}%</span>
      {error ? (
        <button onClick={() => setAttempt((a) => a + 1)}>再接它们一次</button>
      ) : (
        <small>卡片、动画和小惊喜，马上就好</small>
      )}
      </div>
    </main>
  );
}
