import React from "react";
import { artStyle } from "../data";
export default function Art({ card, className = "" }) {
  return (
    <div
      role="img"
      aria-label={card.name}
      className={`art ${className}`}
      style={artStyle(card)}
    />
  );
}
