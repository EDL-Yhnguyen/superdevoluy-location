import Stripe from "stripe";
import { fmtFr } from "../../lib/pricing";
import { LOGEMENT, PROPRIETAIRE, TARIFS } from "../../lib/config";
import PrintButton from "../PrintButton";

export const dynamic = "force-dynamic";

// Sans session_id : contrat vierge, à remplir à la main.
export default async function Contrat({ searchParams }) {
  const { session_id } = await searchParams;
  let m = {}, email = "________________";
  if (session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const s = await new Stripe(process.env.STRIPE_SECRET_KEY).checkout.sessions.retrieve(session_id);
      if (s.payment_status === "paid") { m = s.metadata; email = s.customer_details?.email || email; }
    } catch {}
  }
  const v = (k, blank = "________________") => (m[k] ? m[k] : blank);
  const personnes = m.adultes ? Number(m.adultes) + Number(m.enfants || 0) : "____";
  const aujourdhui = new Date().toLocaleDateString("fr-FR");

  return (
    <main className="doc">
      <PrintButton />
      <h1>Contrat de location saisonnière</h1>
      <p>Meublé de tourisme — numéro d'enregistrement {LOGEMENT.numeroEnregistrement}</p>

      <h2>1. Les parties</h2>
      <p><b>Le propriétaire (bailleur)</b> : {PROPRIETAIRE.nom}, {PROPRIETAIRE.adresse}, {PROPRIETAIRE.email}, {PROPRIETAIRE.telephone}.</p>
      <p><b>Le locataire</b> : {v("nom")}, e-mail {email}, téléphone {v("telephone")}.</p>
      <p>Adresse du locataire : ______________________________________________</p>

      <h2>2. Le logement</h2>
      <p>{LOGEMENT.nom}, {LOGEMENT.residence}, {LOGEMENT.adresse}. Studio de {LOGEMENT.surface}, {LOGEMENT.etage}, capacité maximale {LOGEMENT.capacite} personnes.</p>
      <p>Couchages : {LOGEMENT.couchages.join(" ; ")}.</p>
      <p>Le logement est loué meublé et équipé selon l'inventaire joint. Animaux : non admis sauf accord écrit. Logement non-fumeur.</p>

      <h2>3. Durée</h2>
      <p>Du <b>{m.arrivee ? fmtFr(m.arrivee) : "____________"}</b> à partir de 16 h au <b>{m.depart ? fmtFr(m.depart) : "____________"}</b> avant 10 h, soit {v("nuits", "____")} nuits, pour {personnes} personnes.</p>
      <p>Le locataire ne pourra en aucun cas se prévaloir d'un droit au maintien dans les lieux à l'expiration du séjour.</p>

      <h2>4. Prix et paiement</h2>
      <p>Loyer total du séjour, ménage ({v("menage", TARIFS.menage)} €) et taxe de séjour ({v("taxe", "____")} €) inclus : <b>{v("total", "________")} €</b>.</p>
      <p>Acompte versé à la réservation : {v("acompte", "________")} €. Solde : {v("solde", "________")} €, exigible au plus tard {TARIFS.joursAvantSolde} jours avant l'arrivée. À défaut, le propriétaire pourra considérer la réservation comme annulée.</p>
      <p>Les charges (eau, électricité, chauffage) sont comprises. Le linge de lit et de toilette {"[EST / N'EST PAS]"} fourni.</p>

      <h2>5. Dépôt de garantie</h2>
      <p>Une caution de <b>{v("caution", TARIFS.caution)} €</b> est remise à l'arrivée (empreinte bancaire ou chèque non encaissé). Elle est restituée dans les 10 jours suivant le départ, déduction faite des éventuels dégâts, objets manquants ou ménage non effectué, sur justificatifs.</p>

      <h2>6. Annulation</h2>
      <ul>
        <li>Annulation par le locataire plus de 30 jours avant l'arrivée : l'acompte est remboursé, moins 30 € de frais.</li>
        <li>Entre 30 et 8 jours avant : l'acompte est conservé.</li>
        <li>Moins de 8 jours avant, ou non-présentation : la totalité du séjour est due.</li>
        <li>Annulation par le propriétaire : remboursement intégral des sommes versées, plus une indemnité égale au montant de l'acompte.</li>
        <li>Fermeture administrative de la station ou interdiction de déplacement : report ou remboursement intégral.</li>
      </ul>

      <h2>7. État des lieux et inventaire</h2>
      <p>Un état des lieux et un inventaire sont établis à l'arrivée et au départ. Toute anomalie doit être signalée dans les 24 h suivant l'arrivée. Le logement doit être rendu propre, vaisselle faite, poubelles sorties, lits défaits.</p>

      <h2>8. Obligations du locataire</h2>
      <p>Occupation paisible, respect du règlement de la résidence et du règlement intérieur joint. Le nombre d'occupants ne peut dépasser {LOGEMENT.capacite}. Sous-location interdite. Le locataire est responsable des dommages causés par lui ou ses invités et déclare être couvert par une assurance villégiature.</p>

      <h2>9. Litiges</h2>
      <p>Le présent contrat est soumis au droit français. En cas de litige, les parties rechercheront une solution amiable ; à défaut, médiation de la consommation puis tribunal compétent.</p>

      <p>Fait en deux exemplaires, le {aujourdhui}. Signatures précédées de la mention « lu et approuvé ».</p>
      <div className="sig">
        <div>Le propriétaire<br />{PROPRIETAIRE.nom}</div>
        <div>Le locataire<br />{v("nom", "")}</div>
      </div>
      <p className="noprint" style={{ marginTop: "2rem" }}><a href="/documents">Règlement intérieur, état des lieux et inventaire →</a></p>
    </main>
  );
}
