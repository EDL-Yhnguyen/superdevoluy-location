"use client";
import { useEffect } from "react";

// Barre fixe qui se teinte au défilement + apparition des sections.
export default function Effets() {
  useEffect(() => {
    const top = document.getElementById("top");
    const onScroll = () => top && top.classList.toggle("on", scrollY > 60);
    if (top && location.pathname !== "/") top.classList.add("solid");
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => { removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);
  return null;
}
