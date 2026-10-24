import "./globals.css";
import { LOGEMENT, PROPRIETAIRE } from "../lib/config";

export const metadata = {
  title: `${LOGEMENT.nom} — ${LOGEMENT.accroche}`,
  description: `Location de vacances à ${LOGEMENT.station}. ${LOGEMENT.accroche}. Réservation en ligne et paiement sécurisé.`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <header className="topbar">
          <a href="/" className="brand">{LOGEMENT.nom}</a>
          <nav>
            <a href="/#photos">Photos</a>
            <a href="/#tarifs">Tarifs</a>
            <a href="/#reservation">Réserver</a>
            <a href="/documents">Documents</a>
          </nav>
        </header>
        {children}
        <footer>
          <p>{PROPRIETAIRE.nom} · {PROPRIETAIRE.email} · {PROPRIETAIRE.telephone}</p>
          <p>Meublé de tourisme n° {LOGEMENT.numeroEnregistrement} · <a href="/documents#cgv">Conditions générales</a></p>
        </footer>
      </body>
    </html>
  );
}
