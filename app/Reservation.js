"use client";
import { useEffect, useMemo, useState } from "react";
import { devis, chevauche, fmt } from "../lib/pricing";
import { LOGEMENT, PROPRIETAIRE } from "../lib/config";

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
        <span><i style={{ background: "rgba(255,255,255,.15)" }} />Libre</span>
        <span><i style={{ background: "rgba(200,57,43,.6)" }} />Occupé</span>
      </div>
    </div>
  );
}

// paiementActif : Stripe configuré côté serveur. Sinon la demande part par e-mail.
export default function Reservation({ paiementActif = false }) {
  const [blocs, setBlocs] = useState([]);
  const [f, setF] = useState({ arrivee: "", depart: "", adultes: 2, enfants: 0, nom: "", email: "", telephone: "", message: "", cgv: false });
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/availability").then((r) => r.json()).then((d) => setBlocs(d.blocs || [])).catch(() => {});
  }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const q = f.arrivee && f.depart ? devis(f) : null;
  const conflit = f.arrivee && f.depart && chevauche(f.arrivee, f.depart, blocs);
  const today = fmt(new Date());
  const minDepart = f.arrivee ? fmt(new Date(new Date(f.arrivee + "T00:00:00Z").getTime() + MS_JOUR)) : today;
  const pret = q && !q.erreur && !conflit;

  function demanderParMail() {
    const body = `Demande de réservation — Studio Bois d'Aurouze, SuperDévoluy\n\nArrivée : ${f.arrivee}\nDépart : ${f.depart}\nAdultes : ${f.adultes} · Enfants : ${f.enfants}\nNom : ${f.nom}\nE-mail : ${f.email}\nTéléphone : ${f.telephone}\n\nDevis : ${q.nuits} nuits, total ${q.total} €, acompte ${q.acompte} €\n\n${f.message}`;
    window.location.href = `mailto:${PROPRIETAIRE.email}?subject=${encodeURIComponent(`Réservation studio SuperDévoluy ${f.arrivee} → ${f.depart}`)}&body=${encodeURIComponent(body)}`;
    setInfo(`Votre messagerie s'ouvre avec la demande pré-remplie. Si rien ne s'ouvre, écrivez à ${PROPRIETAIRE.email}`);
  }

  async function envoyer(e) {
    e.preventDefault();
    setErr(""); setInfo("");
    if (!q || q.erreur) return setErr(q?.erreur || "Choisissez vos dates");
    if (conflit) return setErr("Ces dates sont déjà réservées");
    if (!f.cgv) return setErr("Il faut accepter les conditions générales");
    if (!paiementActif) return demanderParMail();
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

  const libelle = busy ? "Redirection…"
    : !pret ? "Choisissez vos dates"
    : paiementActif ? `Payer ${q.acompte} € par carte`
    : `Demander ces dates — ${q.total} € tout compris`;

  return (
    <div className="two">
      <Calendrier blocs={blocs} />
      <form onSubmit={envoyer} className="card">
        <div className="row">
          <label>Arrivée<input type="date" required min={today} value={f.arrivee} onChange={set("arrivee")} /></label>
          <label>Départ<input type="date" required min={minDepart} value={f.depart} onChange={set("depart")} /></label>
        </div>
        <div className="row">
          <label>Adultes<input type="number" min="1" max={LOGEMENT.capacite} value={f.adultes} onChange={set("adultes")} /></label>
          <label>Enfants<input type="number" min="0" max={LOGEMENT.capacite - 1} value={f.enfants} onChange={set("enfants")} /></label>
        </div>
        <div className="row">
          <label>Nom et prénom<input required autoComplete="name" value={f.nom} onChange={set("nom")} /></label>
          <label>E-mail<input type="email" required autoComplete="email" value={f.email} onChange={set("email")} /></label>
        </div>
        <label>Téléphone (facultatif)<input type="tel" autoComplete="tel" value={f.telephone} onChange={set("telephone")} /></label>
        <label>Un mot ? (linge, arrivée tardive, question)<textarea rows="2" value={f.message} onChange={set("message")} /></label>

        {q && !q.erreur && (
          <div className="devis">
            <dl>
              <dt>{q.nuits} nuits ({q.saisons.join(", ")})</dt><dd>{q.hebergement} €</dd>
              <dt>Ménage</dt><dd>{q.menage} €</dd>
              <dt>Taxe de séjour</dt><dd>{q.taxe} €</dd>
              <dt className="total">Total</dt><dd className="total">{q.total} €</dd>
              <dt>{paiementActif ? "À payer maintenant" : "Acompte à la réservation"}</dt><dd>{q.acompte} €</dd>
              {q.solde > 0 && <><dt>Solde 30 j avant l'arrivée</dt><dd>{q.solde} €</dd></>}
              <dt>Caution à l'arrivée</dt><dd>{q.caution} €</dd>
            </dl>
          </div>
        )}
        {q?.erreur && <p className="err">{q.erreur}</p>}
        {conflit && <p className="err">Ces dates sont déjà réservées.</p>}
        {pret && <p className="ok">Dates disponibles.</p>}

        <label style={{ gridTemplateColumns: "auto 1fr", alignItems: "start", fontWeight: 400 }}>
          <input type="checkbox" checked={f.cgv} onChange={set("cgv")} />
          <span>J'accepte les <a href="/documents#cgv" target="_blank">conditions générales</a> et le <a href="/documents#reglement" target="_blank">règlement intérieur</a>.</span>
        </label>
        {err && <p className="err">{err}</p>}
        {info && <p className="ok">{info}</p>}
        <button className="btn" disabled={busy || !pret}>{libelle}</button>
      </form>
    </div>
  );
}
