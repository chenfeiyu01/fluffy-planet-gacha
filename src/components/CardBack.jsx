import React, { useEffect, useState } from "react";
import { getCardBack, loadCardBack } from "../cardArtwork";
export default function CardBack({ card, alt = "绒绒星球卡背" }) {
  const [url, setUrl] = useState(() => getCardBack(card)?.url || "");
  useEffect(() => {
    let live = true;
    setUrl(getCardBack(card)?.url || "");
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
    <img
      className="card-face"
      src={card.rarity === "SSR" ? "/art/card-parts/backs/ssr-back-art.webp" : "/art/card-parts/backs/card-back.webp"}
      alt={alt}
      draggable="false"
    />
  );
}
