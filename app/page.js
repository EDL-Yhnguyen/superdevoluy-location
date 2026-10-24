import { LOGEMENT, TARIFS, PHOTOS } from "../lib/config";
import Reservation from "./Reservation";

export default function Home() {
  return (
    <main>
      <div className="hero" style={{ backgroundImage: `url(${PHOTOS[1].src})` }}>
        <div>
          <h1>{LOGEMENT.accroche}</h1>
          <p>{LOGEMENT.station} · {LOGEMENT.capacite} personnes · {LOGEMENT.surface}</p>
          <a href="#reservation" className="btn">Vérifier les disponibilités</a>
        </div>
      </div>

      <section id="photos">
        <h2>Le studio</h2>
        <div className="gallery">
          {PHOTOS.map((p) => <img key={p.src} src={p.src} alt={p.alt} loading="lazy" />)}
        </div>
      </section>

      <section className="alt">
        <div className="grid">
          <div className="card"><h3>Couchages</h3><ul>{LOGEMENT.couchages.map((c) => <li key={c}>{c}</li>)}</ul></div>
          <div className="card"><h3>Équipements</h3><ul>{LOGEMENT.equipements.map((c) => <li key={c}>{c}</li>)}</ul></div>
          <div className="card"><h3>Autour</h3><ul>{LOGEMENT.atouts.map((c) => <li key={c}>{c}</li>)}</ul></div>
        </div>
      </section>

      <section id="tarifs">
        <h2>Tarifs</h2>
        <table>
          <thead><tr><th>Période</th><th>Dates</th><th>Par nuit</th><th>Séjour minimum</th></tr></thead>
          <tbody>
            {TARIFS.saisons.map((s) => (
              <tr key={s.nom}>
                <td>{s.nom}</td>
                <td>{s.debut.replace("-", "/")} → {s.fin.replace("-", "/")}</td>
                <td>{s.nuit} €</td>
                <td>{s.minNuits} nuits</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Ménage {TARIFS.menage} € par séjour. Taxe de séjour {TARIFS.taxeSejourParPersonneParNuit} € par adulte et par nuit.
          Caution {TARIFS.caution} € demandée à l'arrivée, restituée après l'état des lieux.
          Acompte {TARIFS.acomptePourcent} % à la réservation, solde {TARIFS.joursAvantSolde} jours avant l'arrivée.</p>
      </section>

      <section className="alt" id="reservation">
        <div>
          <h2>Réserver en direct</h2>
          <p>Sans commission de plateforme. Paiement sécurisé par carte (Stripe). Contrat de location envoyé automatiquement.</p>
          <Reservation />
        </div>
      </section>
    </main>
  );
}
