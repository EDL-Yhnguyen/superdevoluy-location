import { LOGEMENT, PROPRIETAIRE, TARIFS } from "../../lib/config";
import PrintButton from "../PrintButton";

const INVENTAIRE = [
  "Lit mezzanine : matelas, alèse", "Clic-clac : matelas, housse", "Banquette convertible : matelas, housse",
  "Couettes et oreillers (nombre : ____)", "Table ronde", "Chaises (4)", "Buffet", "Armoire", "Télévision + télécommande",
  "Étendoir", "Horloge, cadres, étagère", "Plaques de cuisson", "Réfrigérateur-congélateur", "Micro-ondes",
  "Appareil sous le plan de travail [LAVE-VAISSELLE / LAVE-LINGE]", "Assiettes, verres, couverts (6 couverts)",
  "Casseroles, poêle, plats", "Cafetière, bouilloire", "Égouttoir, poubelle", "Douche, rideau ou paroi", "Lavabo, miroir, meuble",
  "WC, balayette", "Sèche-cheveux [À CONFIRMER]", "Aspirateur, balai, serpillière", "Clés remises (nombre : ____)",
];

const PIECES = ["Séjour", "Coin nuit / mezzanine", "Kitchenette", "Salle d'eau et WC", "Balcon", "Entrée et placards"];

export default function Documents() {
  return (
    <main className="doc">
      <PrintButton />
      <h1>Documents de location</h1>
      <p>Règlement intérieur, conditions générales de vente, état des lieux et inventaire. <a href="/contrat">Contrat de location vierge →</a></p>

      <h2 id="reglement">Règlement intérieur</h2>
      <ol>
        <li>Arrivée à partir de 16 h, départ avant 10 h. Horaires différents sur demande, selon le planning.</li>
        <li>{LOGEMENT.capacite} personnes maximum, enfants compris. Aucune personne non déclarée ne peut dormir dans le logement.</li>
        <li>Logement non-fumeur. Animaux non admis sauf accord écrit du propriétaire.</li>
        <li>Calme entre 22 h et 8 h ; respect du règlement de copropriété et des voisins.</li>
        <li>Skis, chaussures et luges restent dans le casier ou sur le balcon, pas dans le séjour.</li>
        <li>Chauffage : baisser le thermostat et fermer les fenêtres en sortant. Ne pas sécher de linge sur les radiateurs.</li>
        <li>Au départ : vaisselle faite et rangée, poubelles sorties, lits défaits, réfrigérateur vidé, fenêtres fermées, clés remises.</li>
        <li>Toute casse ou panne est signalée au propriétaire au {PROPRIETAIRE.telephone}.</li>
      </ol>

      <h2 id="cgv">Conditions générales de vente</h2>
      <ol>
        <li><b>Réservation.</b> La réservation est ferme à réception de l'acompte de {TARIFS.acomptePourcent} % du séjour (ou du total si l'arrivée est à moins de {TARIFS.joursAvantSolde} jours). Le contrat et le présent document sont réputés acceptés au paiement.</li>
        <li><b>Prix.</b> Les prix affichés sont en euros, toutes charges comprises. Le ménage de fin de séjour ({TARIFS.menage} €) et la taxe de séjour ({TARIFS.taxeSejourParPersonneParNuit} € par adulte et par nuit, reversée à la commune) sont ajoutés au devis.</li>
        <li><b>Solde.</b> Exigible {TARIFS.joursAvantSolde} jours avant l'arrivée. Sans règlement à cette date, le propriétaire peut annuler la réservation et conserver l'acompte.</li>
        <li><b>Caution.</b> {TARIFS.caution} € à l'arrivée, restitués sous 10 jours après l'état des lieux de sortie, déduction faite des dommages constatés.</li>
        <li><b>Annulation par le locataire.</b> Plus de 30 jours avant l'arrivée : remboursement de l'acompte moins 30 € de frais. De 30 à 8 jours : acompte conservé. Moins de 8 jours ou non-présentation : totalité du séjour due. Un séjour écourté ne donne lieu à aucun remboursement.</li>
        <li><b>Annulation par le propriétaire.</b> Remboursement intégral plus indemnité égale à l'acompte, sauf cas de force majeure (sinistre, fermeture administrative) où seul le remboursement intégral est dû.</li>
        <li><b>Paiement.</b> Carte bancaire via Stripe. Le propriétaire ne conserve aucune donnée bancaire. Virement possible sur demande.</li>
        <li><b>Assurance.</b> Le locataire déclare être couvert par une assurance responsabilité civile villégiature.</li>
        <li><b>Données personnelles.</b> Les données collectées servent uniquement à la gestion de la réservation et aux obligations légales (fiche de police le cas échéant). Elles ne sont pas transmises à des tiers hors Stripe. Droit d'accès et de suppression par e-mail à {PROPRIETAIRE.email}.</li>
        <li><b>Droit de rétractation.</b> Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux prestations d'hébergement à date déterminée.</li>
        <li><b>Litiges.</b> Droit français. Médiateur de la consommation : [NOM ET SITE DU MÉDIATEUR CHOISI].</li>
      </ol>

      <h2 id="edl">État des lieux</h2>
      <p>Locataire : ____________________ · Arrivée le ____/____/______ · Départ le ____/____/______</p>
      <table>
        <thead><tr><th>Pièce</th><th>État à l'arrivée</th><th>État au départ</th></tr></thead>
        <tbody>
          {PIECES.map((p) => <tr key={p}><td>{p}</td><td style={{ height: 48 }}></td><td></td></tr>)}
        </tbody>
      </table>
      <p>Relevé compteur électrique : arrivée __________ kWh · départ __________ kWh</p>
      <p>Caution remise : ☐ empreinte bancaire ☐ chèque n° __________ · Restituée le ____/____/______</p>

      <h2 id="inventaire">Inventaire</h2>
      <ul className="check">{INVENTAIRE.map((i) => <li key={i}>{i}</li>)}</ul>

      <div className="sig">
        <div>Le propriétaire<br />{PROPRIETAIRE.nom}</div>
        <div>Le locataire</div>
      </div>
    </main>
  );
}
