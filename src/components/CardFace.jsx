import React, { useEffect, useState } from "react";
import { loadCardArtwork } from "../cardArtwork";
import Art from "./Art";
export default function CardFace({ card }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let live = true;
    loadCardArtwork(card)
      .then((face) => {
        if (live) setUrl(face.url);
      })
      .catch(console.error);
    return () => {
      live = false;
    };
  }, [card.id]);
  return url ? (
    <>
      <img
        className="card-face"
        src={url}
        alt={`${card.name} · ${card.rarity}`}
        draggable="false"
      />
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
    <Art card={card} className="card-face" />
  );
}
