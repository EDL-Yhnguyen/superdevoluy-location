import { TARIFS } from "./config";

const MS_JOUR = 86400000;

export function parseDate(s) {
  const d = new Date(s + "T00:00:00Z");
  return isNaN(d) ? null : d;
}

export function fmt(d) {
  return d.toISOString().slice(0, 10);
}

export function fmtFr(s) {
  const d = parseDate(s);
  return d ? d.toLocaleDateString("fr-FR", { timeZone: "UTC", day: "2-digit", month: "long", year: "numeric" }) : s;
}

function dansSaison(d, saison) {
  const mmdd = fmt(d).slice(5);
  if (saison.debut <= saison.fin) return mmdd >= saison.debut && mmdd <= saison.fin;
  return mmdd >= saison.debut || mmdd <= saison.fin; // saison à cheval sur le nouvel an
}

export function saisonPour(d) {
  return TARIFS.saisons.find((s) => dansSaison(d, s)) || TARIFS.saisons.at(-1);
}

export function devis({ arrivee, depart, adultes = 2, enfants = 0 }) {
  const a = parseDate(arrivee);
  const d = parseDate(depart);
  if (!a || !d || d <= a) return { erreur: "Dates invalides" };
  const nuits = Math.round((d - a) / MS_JOUR);
  const personnes = Number(adultes) + Number(enfants);
  let hebergement = 0;
  let minNuits = 1;
  const saisons = new Set();
  for (let i = 0; i < nuits; i++) {
    const jour = new Date(a.getTime() + i * MS_JOUR);
    const s = saisonPour(jour);
    hebergement += s.nuit;
    minNuits = Math.max(minNuits, s.minNuits);
    saisons.add(s.nom);
  }
  if (nuits < minNuits) return { erreur: `Séjour minimum : ${minNuits} nuits sur cette période` };
  const taxe = Math.round(TARIFS.taxeSejourParPersonneParNuit * Number(adultes) * nuits * 100) / 100;
  const total = Math.round((hebergement + TARIFS.menage + taxe) * 100) / 100;
  const joursAvant = Math.round((a - new Date(fmt(new Date()) + "T00:00:00Z")) / MS_JOUR);
  const acompte = joursAvant > TARIFS.joursAvantSolde
    ? Math.round(total * TARIFS.acomptePourcent) / 100
    : total;
  return {
    nuits, personnes, hebergement, menage: TARIFS.menage, taxe, total,
    acompte, solde: Math.round((total - acompte) * 100) / 100,
    caution: TARIFS.caution, saisons: [...saisons],
  };
}

// Chevauchement entre [arrivee, depart) et une liste de blocs {start, end} (end exclu).
export function chevauche(arrivee, depart, blocs) {
  return blocs.some((b) => arrivee < b.end && depart > b.start);
}
