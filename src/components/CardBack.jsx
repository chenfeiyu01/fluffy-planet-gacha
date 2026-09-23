import React, { useEffect, useState } from "react";
import { loadCardBack } from "../cardArtwork";
export default function CardBack({ card, alt = "绒绒星球卡背" }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let live = true;
    loadCardBack(card)
      .then((result) => {
        if (live) setUrl(result.url);
      })
      .catch(console.error);
    return () => {
      live = false;
    };
  }, [card.id]);
  return url ? (
    <>
      <img className="card-face" src={url} alt={alt} draggable="false" />
      <span
        className={`card-foil foil-${card.rarity}`}
        aria-hidden="true"
        style={{ maskImage: `url("${url}")`, WebkitMaskImage: `url("${url}")` }}
      >
        <i />
        {card.rarity === "SSR" && <b className="foil-prisms" />}
      </span>
    </>
  ) : (
    <span className="card-back-loading" aria-label="卡背加载中" />
  );
}
