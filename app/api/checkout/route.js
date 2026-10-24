import Stripe from "stripe";
import { devis, chevauche } from "../../../lib/pricing";
import { blocsOccupes } from "../../../lib/availability";
import { LOGEMENT } from "../../../lib/config";

export async function POST(req) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ erreur: "Paiement non configuré (STRIPE_SECRET_KEY manquante)" }, { status: 500 });
  }
  const b = await req.json();
  const { arrivee, depart, adultes, enfants, nom, email, telephone } = b;
  if (!nom || !email || !/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json({ erreur: "Nom et e-mail obligatoires" }, { status: 400 });
  }
  if (Number(adultes) + Number(enfants || 0) > LOGEMENT.capacite) {
    return Response.json({ erreur: `Maximum ${LOGEMENT.capacite} personnes` }, { status: 400 });
  }
  const q = devis({ arrivee, depart, adultes, enfants });
  if (q.erreur) return Response.json({ erreur: q.erreur }, { status: 400 });
  if (chevauche(arrivee, depart, await blocsOccupes())) {
    return Response.json({ erreur: "Ces dates ne sont plus disponibles" }, { status: 409 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = req.headers.get("origin") || process.env.SITE_URL;
  const estAcompte = q.acompte < q.total;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(q.acompte * 100),
        product_data: {
          name: `${LOGEMENT.nom} — ${arrivee} au ${depart}`,
          description: estAcompte
            ? `Acompte ${q.acompte} € sur ${q.total} € (${q.nuits} nuits). Solde ${q.solde} € 30 jours avant l'arrivée.`
            : `${q.nuits} nuits, ménage et taxe de séjour inclus.`,
        },
      },
    }],
    metadata: {
      arrivee, depart, adultes: String(adultes), enfants: String(enfants || 0),
      nom, telephone: telephone || "", nuits: String(q.nuits),
      total: String(q.total), acompte: String(q.acompte), solde: String(q.solde),
      caution: String(q.caution), taxe: String(q.taxe), menage: String(q.menage),
    },
    success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/#reservation`,
  });
  return Response.json({ url: session.url });
}
