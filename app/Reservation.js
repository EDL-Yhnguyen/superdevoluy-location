"use client";
import { useEffect, useMemo, useState } from "react";
import { devis, chevauche, fmt } from "../lib/pricing";
import { LOGEMENT } from "../lib/config";

const MS_JOUR = 86400000;

function Calendrier({ blocs }) {
  const today = fmt(new Date());
  const mois = useMemo(() => {
    const out = [];
    const d = new Date(); d.setUTCDate(1);
    for (let m = 0; m < 6; m++) {
      const y = d.getUTCFullYear(), mo = d.getUTCMonth();
      const first = new Date(Date.UTC(y, mo, 1));
      const n = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate();
      const offset = (first.getUTCDay() + 6) % 7; // lundi = 0
      const jours = [];
      for (let i = 0; i < offset; i++) jours.push(null);
      for (let j = 1; j <= n; j++) jours.push(fmt(new Date(Date.UTC(y, mo, j))));
      out.push({ titre: first.toLocaleDateString("fr-FR", { timeZone: "UTC", month: "long", year: "numeric" }), jours });
      d.setUTCMonth(mo + 1);
    }
    return out;
  }, []);
  const occupe = (j) => blocs.some((b) => j >= b.start && j < b.end);
  return (
    <div>
      <div className="cal">
        {mois.map((m) => (
          <div className="month" key={m.titre}>
            <h4>{m.titre}</h4>
            <div className="days">
              {["L", "M", "M", "J", "V", "S", "D"].map((x, i) => <b key={i}>{x}</b>)}
              {m.jours.map((j, i) => j
                ? <span key={j} className={j < today ? "past" : occupe(j) ? "busy" : "free"}>{Number(j.slice(8))}</span>
                : <span key={"v" + i} />)}
            </div>
          </div>
        ))}
      </div>
      <div className="legend">
        <span><i style={{ background: "#e3efe7" }} />Libre</span>
        <span><i style={{ background: "#e8d7d3" }} />Occupé</span>
      </div>
    </div>
  );
}

export default function Reservation() {
  const [blocs, setBlocs] = useState([]);
  const [f, setF] = useState({ arrivee: "", depart: "", adultes: 2, enfants: 0, nom: "", email: "", telephone: "", cgv: false });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/availability").then((r) => r.json()).then((d) => setBlocs(d.blocs || [])).catch(() => {});
  }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const q = f.arrivee && f.depart ? devis(f) : null;
  const conflit = f.arrivee && f.depart && chevauche(f.arrivee, f.depart, blocs);
  const today = fmt(new Date());
  const minDepart = f.arrivee ? fmt(new Date(new Date(f.arrivee + "T00:00:00Z").getTime() + MS_JOUR)) : today;

  async function payer(e) {
    e.preventDefault();
    setErr("");
    if (!q || q.erreur) return setErr(q?.erreur || "Choisis tes dates");
    if (conflit) return setErr("Ces dates sont déjà réservées");
    if (!f.cgv) return setErr("Il faut accepter les conditions générales");
    setBusy(true);
    try {
      const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.erreur || "Erreur");
      window.location.href = d.url;
    } catch (e2) {
      setErr(e2.message);
      setBusy(false);
    }
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
      <div>
        <Calendrier blocs={blocs} />
      </div>
      <form onSubmit={payer} className="card">
        <div className="row">
          <label>Arrivée<input type="date" required min={today} value={f.arrivee} onChange={set("arrivee")} /></label>
          <label>Départ<input type="date" required min={minDepart} value={f.depart} onChange={set("depart")} /></label>
        </div>
        <div className="row">
          <label>Adultes<input type="number" min="1" max={LOGEMENT.capacite} value={f.adultes} onChange={set("adultes")} /></label>
          <label>Enfants<input type="number" min="0" max={LOGEMENT.capacite - 1} value={f.enfants} onChange={set("enfants")} /></label>
        </div>
        <label>Nom et prénom<input required value={f.nom} onChange={set("nom")} /></label>
        <label>E-mail<input type="email" required value={f.email} onChange={set("email")} /></label>
        <label>Téléphone<input type="tel" value={f.telephone} onChange={set("telephone")} /></label>

        {q && !q.erreur && (
          <div className="devis">
            <dl>
              <dt>{q.nuits} nuits ({q.saisons.join(", ")})</dt><dd>{q.hebergement} €</dd>
              <dt>Ménage</dt><dd>{q.menage} €</dd>
              <dt>Taxe de séjour</dt><dd>{q.taxe} €</dd>
              <dt className="total">Total</dt><dd className="total">{q.total} €</dd>
              <dt>À payer maintenant</dt><dd>{q.acompte} €</dd>
              {q.solde > 0 && <><dt>Solde 30 j avant l'arrivée</dt><dd>{q.solde} €</dd></>}
              <dt>Caution à l'arrivée</dt><dd>{q.caution} €</dd>
            </dl>
          </div>
        )}
        {q?.erreur && <p className="err">{q.erreur}</p>}
        {conflit && <p className="err">Ces dates sont déjà réservées.</p>}
        {q && !q.erreur && !conflit && <p className="ok">Dates disponibles.</p>}

        <label style={{ gridTemplateColumns: "auto 1fr", alignItems: "start", fontWeight: 400 }}>
          <input type="checkbox" checked={f.cgv} onChange={set("cgv")} />
          <span>J'accepte les <a href="/documents#cgv" target="_blank">conditions générales</a> et le <a href="/documents#reglement" target="_blank">règlement intérieur</a>.</span>
        </label>
        {err && <p className="err">{err}</p>}
        <button className="btn" disabled={busy || !q || !!q.erreur || conflit}>
          {busy ? "Redirection…" : q && !q.erreur ? `Payer ${q.acompte} € par carte` : "Choisir des dates"}
        </button>
      </form>
    </div>
  );
}
