import { LOGEMENT, TARIFS, PHOTOS, PHOTOS_LEGENDES, FAQ, FORFAITS } from "../lib/config";
import Reservation from "./Reservation";
import Galerie from "./Galerie";
import Meteo from "./Meteo";
import Calculateur from "./Calculateur";

const ORDRE = [1, 0, 3, 2, 5, 4, 6]; // ordre d'affichage dans la mosaïque
const photos = ORDRE.map((i) => ({ ...PHOTOS[i], legende: PHOTOS_LEGENDES[i] }));

const JSONLD = {
  "@context": "https://schema.org", "@type": "VacationRental",
  name: "Studio SuperDévoluy – Bois d'Aurouze",
  description: "Studio 5 personnes avec balcon vue montagne au Bois d'Aurouze, SuperDévoluy, télésiège du Jas à deux pas.",
  image: photos.slice(0, 3).map((p) => p.src),
  address: { "@type": "PostalAddress", streetAddress: "Résidence Le Bois d'Aurouze, appartement 347 N", addressLocality: "Le Dévoluy", postalCode: "05250", addressRegion: "Hautes-Alpes", addressCountry: "FR" },
  geo: { "@type": "GeoCoordinates", latitude: 44.683, longitude: 5.897 },
  containsPlace: { "@type": "Accommodation", floorLevel: "3", occupancy: { "@type": "QuantitativeValue", maxValue: LOGEMENT.capacite }, numberOfRooms: 1 },
  checkinTime: "16:00", checkoutTime: "10:00", petsAllowed: false, smokingAllowed: false,
  priceRange: `${TARIFS.saisons.at(-1).nuit} € - ${TARIFS.saisons[0].nuit} € par nuit`,
};
const FAQLD = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };

export default function Home() {
  const paiementActif = Boolean(process.env.STRIPE_SECRET_KEY);
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQLD) }} />

      <section className="hero">
        <div className="bg" style={{ backgroundImage: `url(${PHOTOS[1].src})` }} />
        <div className="in">
          <div className="chips"><span>★ Bois d'Aurouze, 3e étage</span><span>5 couchages</span><span>Balcon plein sud</span><span>Télésiège du Jas à 2 min</span></div>
          <h1>Dormez au pied des pistes. Payez le studio, pas la plateforme.</h1>
          <p className="sub">Studio lumineux pour 5 à SuperDévoluy : balcon vue montagne, kitchenette, 100 km de pistes à la porte. Devis en 10 secondes, réponse du propriétaire sous 24 h.</p>
          <div className="cta"><a className="btn" href="#reservation">Voir mon devis</a><a className="btn ghost" href="#photos">Visiter le studio</a></div>
        </div>
        <div className="scroll">DÉFILER</div>
      </section>

      <div className="wrap reveal"><div className="stats">
        <div><b>100 km</b><small>de pistes, 1 500 → 2 500 m, enneigement artificiel</small></div>
        <div><b>0 €</b><small>de frais de service : le prix affiché est le prix payé</small></div>
        <div><b>2 min</b><small>à pied jusqu'au télésiège du Jas, skis sur l'épaule</small></div>
        <div><b>24 h</b><small>pour une réponse ferme, par le propriétaire</small></div>
      </div></div>

      <section id="photos" className="wrap reveal">
        <div className="eyebrow">Le studio</div><h2>Un vrai séjour, pas un placard à skis</h2>
        <p className="muted" style={{ maxWidth: "60ch" }}>Grand séjour carrelé ouvert sur le balcon, coin nuit avec mezzanine, kitchenette séparée, salle d'eau avec douche. Cinq personnes y vivent une semaine sans se marcher dessus.</p>
        <Galerie photos={photos} />
        <div className="cards" style={{ marginTop: "1.4rem" }}>
          <div className="card"><h3>Couchages · {LOGEMENT.capacite}</h3><ul>{LOGEMENT.couchages.map((c) => <li key={c}>{c}</li>)}<li>Couettes et oreillers fournis</li></ul></div>
          <div className="card"><h3>Équipements</h3><ul>{LOGEMENT.equipements.filter((c) => !c.includes("[")).map((c) => <li key={c}>{c}</li>)}</ul></div>
          <div className="card"><h3>Pour qui</h3><ul><li>Une famille avec 2 ou 3 enfants</li><li>Deux couples d'amis</li><li>Des skieurs qui veulent le pied des pistes sans payer un chalet</li></ul></div>
        </div>
      </section>

      <section id="meteo" className="dark"><div className="wrap reveal">
        <div className="eyebrow">En direct de la station</div><h2>Neige et météo à SuperDévoluy</h2>
        <p className="muted">Données Open-Meteo pour le Bois d'Aurouze (1 500 m), rafraîchies à chaque visite.</p>
        <Meteo />
        <p className="muted" style={{ fontSize: ".85rem", marginTop: "1rem" }}>Domaine ouvert de mi-décembre à mi-avril. Forfait adulte 2025-2026 : {FORFAITS.adulteJour} € la journée, {FORFAITS.adulte6j} € les 6 jours ({FORFAITS.enfant6j} € enfant et sénior).</p>
      </div></section>

      <section id="tarifs" className="wrap reveal">
        <div className="eyebrow">Tarifs 2026-2027</div><h2>Le prix affiché est le prix payé</h2>
        <div className="two">
          <div>
            <table>
              <thead><tr><th>Période</th><th>Dates</th><th>Nuit</th><th>Minimum</th></tr></thead>
              <tbody>{TARIFS.saisons.map((s) => (
                <tr key={s.nom}><td>{s.nom}</td><td>{s.debut.replace("-", "/")} → {s.fin.replace("-", "/")}</td><td><b>{s.nuit} €</b></td><td>{s.minNuits} nuits</td></tr>
              ))}</tbody>
            </table>
            <p className="muted" style={{ fontSize: ".95rem" }}>Ménage {TARIFS.menage} € par séjour. Taxe de séjour {TARIFS.taxeSejourParPersonneParNuit} € par adulte et par nuit. Caution {TARIFS.caution} € à l'arrivée, rendue après l'état des lieux. Acompte {TARIFS.acomptePourcent} %, solde {TARIFS.joursAvantSolde} jours avant l'arrivée.</p>
          </div>
          <Calculateur />
        </div>
        <div className="card" style={{ marginTop: "1.4rem" }}><h3>Pourquoi en direct ?</h3><p>Les plateformes ajoutent des frais de service au prix du logement, et Airbnb passe à une commission unique de 15,5 % prélevée sur les hôtes européens en octobre 2026. Ici vous payez le logement, le ménage et la taxe de séjour. Rien d'autre. Le studio reste visible sur Airbnb, Booking et Abritel si vous préférez leur garantie.</p></div>
      </section>

      <section id="reservation" className="dark"><div className="wrap reveal">
        <div className="eyebrow">Réservation</div><h2>{paiementActif ? "Vos dates, votre paiement, c'est réservé" : "Votre devis, puis votre demande"}</h2>
        <div className="steps" style={{ marginBottom: "2rem" }}>
          <div><div><b>Choisissez vos dates.</b><br /><span className="muted">Le calendrier montre les disponibilités, le devis s'affiche tout de suite, taxe et ménage inclus.</span></div></div>
          {paiementActif ? <>
            <div><div><b>Payez l'acompte de 30 % par carte.</b><br /><span className="muted">Paiement sécurisé Stripe. Les dates sont à vous immédiatement.</span></div></div>
            <div><div><b>Recevez contrat et confirmation.</b><br /><span className="muted">Solde 30 jours avant l'arrivée, caution à l'arrivée.</span></div></div>
          </> : <>
            <div><div><b>Envoyez la demande.</b><br /><span className="muted">Elle part par e-mail au propriétaire, sans paiement à cette étape.</span></div></div>
            <div><div><b>Réponse sous 24 h.</b><br /><span className="muted">Avec le contrat et un lien de paiement sécurisé par carte.</span></div></div>
            <div><div><b>Acompte de 30 %.</b><br /><span className="muted">Et les dates sont à vous. Solde 30 jours avant l'arrivée.</span></div></div>
          </>}
        </div>
        <Reservation paiementActif={paiementActif} />
      </div></section>

      <section className="wrap reveal">
        <div className="eyebrow">La station</div><h2>SuperDévoluy, tout se fait à pied</h2>
        <div className="cards">
          <div className="card"><h3>Hiver</h3><ul><li>SuperDévoluy + La Joue du Loup : 100 km de pistes</li><li>Télésiège du Jas à 2 minutes du studio</li><li>École de ski, location, luge, ski nordique dans la station</li><li>Boulangerie, supérette, restaurants à pied</li></ul></div>
          <div className="card"><h3>Été</h3><ul><li>Randonnée vers le Pic de Bure et l'Obiou</li><li>VTT de descente, remontées ouvertes en juillet-août</li><li>Via ferrata, canyoning, lac du Sautet</li><li>Station calme, parfaite avec de jeunes enfants</li></ul></div>
          <div className="card"><h3>Venir</h3><ul><li>Gap 50 min · Grenoble 1 h 30 · Marseille 2 h 30</li><li>Gare de Veynes-Dévoluy à 25 km, navette vers la station</li><li>Parking de la station à proximité</li></ul></div>
        </div>
        <iframe style={{ marginTop: "1.4rem" }} loading="lazy" title="Carte SuperDévoluy" src="https://www.openstreetmap.org/export/embed.html?bbox=5.870%2C44.670%2C5.925%2C44.700&layer=mapnik&marker=44.683%2C5.897" />
      </section>

      <section id="faq" className="wrap reveal" style={{ paddingTop: 0 }}>
        <div className="eyebrow">Questions</div><h2>Ce qu'on nous demande toujours</h2>
        {FAQ.map(([q, a], i) => <details key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>)}
      </section>

      <div className="sticky"><span>Devis immédiat, sans frais</span><a className="btn sm" href="#reservation">Réserver</a></div>
    </main>
  );
}
