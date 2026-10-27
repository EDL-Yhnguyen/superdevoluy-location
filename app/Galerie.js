"use client";
import { useEffect, useState } from "react";

export default function Galerie({ photos }) {
  const [cur, setCur] = useState(-1);
  const show = (i) => setCur((i + photos.length) % photos.length);
  useEffect(() => {
    if (cur < 0) return;
    const onKey = (e) => {
      if (e.key === "Escape") setCur(-1);
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });
  return (
    <>
      <div className="gal">
        {photos.map((p, i) => (
          <a key={p.src} href={p.src} onClick={(e) => { e.preventDefault(); show(i); }}>
            <img src={p.src} alt={p.alt} loading={i ? "lazy" : "eager"} />
            <span>{p.legende}</span>
          </a>
        ))}
      </div>
      {cur >= 0 && (
        <div className="lb" onClick={() => setCur(-1)}>
          <button className="p" aria-label="Précédente" onClick={(e) => { e.stopPropagation(); show(cur - 1); }}>‹</button>
          <img src={photos[cur].src} alt={photos[cur].alt} onClick={(e) => e.stopPropagation()} />
          <button className="n" aria-label="Suivante" onClick={(e) => { e.stopPropagation(); show(cur + 1); }}>›</button>
          <button className="x" aria-label="Fermer">×</button>
        </div>
      )}
    </>
  );
}
