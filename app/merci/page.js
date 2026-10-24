import Stripe from "stripe";
import { fmtFr } from "../../lib/pricing";
import { PROPRIETAIRE } from "../../lib/config";

export const dynamic = "force-dynamic";

export default async function Merci({ searchParams }) {
  const { session_id } = await searchParams;
  let s = null;
  if (session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      s = await new Stripe(process.env.STRIPE_SECRET_KEY).checkout.sessions.retrieve(session_id);
    } catch {}
  }
  if (!s || s.payment_status !== "paid") {
    return <main className="doc"><h1>Paiement introuvable</h1><p>Si tu as été débité, écris à {PROPRIETAIRE.email}.</p></main>;
  }
  const m = s.metadata;
  return (
    <main className="doc">
      <h1>Merci {m.nom}, ta réservation est confirmée</h1>
      <p>Séjour du <b>{fmtFr(m.arrivee)}</b> au <b>{fmtFr(m.depart)}</b>, {m.nuits} nuits, {Number(m.adultes) + Number(m.enfants)} personnes.</p>
      <p>Payé aujourd'hui : <b>{m.acompte} €</b>. {Number(m.solde) > 0 && <>Solde de <b>{m.solde} €</b> à régler 30 jours avant l'arrivée (un lien de paiement te sera envoyé).</>}</p>
      <p>Caution de {m.caution} € à l'arrivée (empreinte bancaire ou chèque), restituée après l'état des lieux.</p>
      <p>Un reçu Stripe a été envoyé à {s.customer_details?.email}.</p>
      <h2>Ton contrat</h2>
      <p>Le contrat est pré-rempli avec tes informations. Imprime-le, signe-le et renvoie-le à {PROPRIETAIRE.email}, ou réponds simplement « bon pour accord » à l'e-mail de confirmation.</p>
      <p>
        <a className="btn" href={`/contrat?session_id=${session_id}`}>Voir et imprimer le contrat</a>{" "}
        <a className="btn secondary" href="/documents">Règlement et état des lieux</a>
      </p>
    </main>
  );
}
