"use client";
import { useEffect, useState } from "react";

const WC = { 0: "Ciel dégagé", 1: "Plutôt dégagé", 2: "Nuageux", 3: "Couvert", 45: "Brouillard", 48: "Brouillard givrant", 51: "Bruine", 61: "Pluie", 63: "Pluie", 65: "Forte pluie", 71: "Neige", 73: "Neige", 75: "Forte neige", 77: "Grésil", 80: "Averses", 85: "Averses de neige", 86: "Fortes averses de neige", 95: "Orage" };
const J = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];
const URL = "https://api.open-meteo.com/v1/forecast?latitude=44.683&longitude=5.897&elevation=1500&current=temperature_2m,weather_code&daily=snowfall_sum,temperature_2m_max,temperature_2m_min,weather_code&timezone=Europe%2FParis&forecast_days=4";

export default function Meteo() {
  const [m, setM] = useState(null);
  const [ko, setKo] = useState(false);
  useEffect(() => { fetch(URL).then((r) => r.json()).then(setM).catch(() => setKo(true)); }, []);
  if (ko) return <div className="meteo"><div className="card"><b>—</b><div className="d">Météo indisponible</div></div></div>;
  if (!m) return <div className="meteo"><div className="card"><b>…</b><div className="d">Chargement</div></div></div>;
  const c = m.current, d = m.daily;
  return (
    <div className="meteo">
      <div className="card"><b>{Math.round(c.temperature_2m)} °C</b><div className="d">{WC[c.weather_code] || ""} · maintenant à 1 500 m</div></div>
      {[1, 2, 3].map((i) => {
        const dt = new Date(d.time[i] + "T12:00:00");
        return (
          <div className="card" key={i}>
            <div className="d">{J[dt.getDay()]} {dt.getDate()}</div>
            <b>{Math.round(d.temperature_2m_max[i])}°<span style={{ fontSize: "1.1rem", opacity: .6 }}> / {Math.round(d.temperature_2m_min[i])}°</span></b>
            <div className="d">{WC[d.weather_code[i]] || ""}</div>
            {d.snowfall_sum[i] > 0 && <div className="snow">❄ {d.snowfall_sum[i].toFixed(0)} cm de neige</div>}
          </div>
        );
      })}
    </div>
  );
}
