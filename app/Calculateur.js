"use client";
import { useState } from "react";
import { TARIFS, FORFAITS } from "../lib/config";

const NUIT_VAC = TARIFS.saisons[0].nuit;

export default function Calculateur() {
  const [n, setN] = useState(7), [a, setA] = useState(2), [e, setE] = useState(2);
  const log = NUIT_VAC * n + TARIFS.menage + Math.round(TARIFS.taxeSejourParPersonneParNuit * a * n * 100) / 100;
  const ff = FORFAITS.adulte6j * a + FORFAITS.enfant6j * e;
  const tot = log + ff, pers = a + e;
  return (
    <div className="card" style={{ background: "var(--night)", color: "#fff", border: 0 }}>
      <div className="eyebrow" style={{ color: "var(--amber)" }}>Calculez votre semaine</div>
      <h3 style={{ color: "#fff" }}>Logement + forfaits, tout compris</h3>
      <div className="calc">
        <label>Nuits {n}<input className="rng" type="range" min="2" max="14" value={n} onChange={(ev) => setN(+ev.target.value)} /></label>
        <label>Adultes {a}<input className="rng" type="range" min="1" max="5" value={a} onChange={(ev) => setA(+ev.target.value)} /></label>
        <label>Enfants {e}<input className="rng" type="range" min="0" max="4" value={e} onChange={(ev) => setE(+ev.target.value)} /></label>
      </div>
      <p style={{ marginTop: "1rem", opacity: .8 }}>En vacances scolaires d'hiver, forfaits 6 jours inclus :</p>
      <output>{Math.round(tot)} € pour {pers} personne{pers > 1 ? "s" : ""}</output>
      <p style={{ opacity: .7, fontSize: ".85rem" }}>Studio {Math.round(log)} € ({n} nuits à {NUIT_VAC} €, ménage et taxe inclus) + forfaits {ff} €. Soit {Math.round(tot / pers / n)} € par personne et par nuit, ski compris.</p>
      <a className="btn" href="#reservation" style={{ marginTop: ".6rem" }}>Réserver ces dates</a>
    </div>
  );
}
