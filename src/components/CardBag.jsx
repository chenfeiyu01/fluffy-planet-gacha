import React, { useId } from "react";
const ART = "/art/card-parts/pocket/card-bag.webp";
// Preserve the entire bag and its accessories; cards enter through the top zip opening.
export default function CardBag({ src, count }) {
  const id = useId().replace(/[^a-z0-9]/gi, "");
  return (
    <>
      <div
        className="pocket-pouch pocket-pouch-back card-bag"
        aria-hidden="true"
      >
        <svg viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id={`${id}-depth`} x2="0" y2="1">
              <stop stopColor="#5b3447" />
              <stop offset="1" stopColor="#b75d83" />
            </linearGradient>
          </defs>
          <ellipse
            className="bag-zip-opening"
            cx="495"
            cy="72"
            rx="327"
            ry="42"
            fill={`url(#${id}-depth)`}
            stroke="#f5c6b8"
            strokeWidth="9"
          />
        </svg>
      </div>
      <div className="pocket-pouch card-bag card-bag-front">
        <svg
          viewBox="0 0 1000 1000"
          role="img"
          aria-label="粉色展示卡包，保留完整蝴蝶结、小花和草莓挂件"
        >
          <defs>
            <clipPath id={`${id}-window`}>
              <rect x="290" y="429" width="438" height="400" rx="25" />
            </clipPath>
          </defs>
          <rect
            x="290"
            y="429"
            width="438"
            height="400"
            rx="25"
            fill="#f6dce7"
          />
          {src && (
            <image
              className="bag-window-card"
              href={src}
              x="320"
              y="431"
              width="372"
              height="396"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${id}-window)`}
            />
          )}
          <image href={ART} width="1000" height="1000" />
          <path
            className="bag-zip-shine"
            d="M195 67 Q485 8 779 68"
            fill="none"
            stroke="#fff8d7"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
        <span>已珍藏 · {count} 张</span>
      </div>
    </>
  );
}
