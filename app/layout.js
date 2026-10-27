import "./globals.css";
import { LOGEMENT, PROPRIETAIRE } from "../lib/config";
import Effets from "./Effets";

const SITE = process.env.SITE_URL || "https://superdevoluy-location.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE),
  title: "Studio SuperDévoluy · Bois d'Aurouze — 5 pers., balcon, pistes à pied, en direct",
  description: "Studio 5 personnes au Bois d'Aurouze, SuperDévoluy : balcon vue montagne, télésiège du Jas à deux pas, météo neige en direct, devis immédiat. Réservez en direct, sans frais de plateforme.",
  icons: { icon: "/logo.svg" },
  openGraph: {
    type: "website",
    title: "Studio SuperDévoluy · Bois d'Aurouze — 5 pers., balcon, pistes à pied",
    description: "Réservez en direct, sans frais de plateforme. Devis en 10 secondes.",
    images: ["/photos/02-sejour-vue.jpg"],
    url: SITE,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Manrope:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Effets />
        <header className="top" id="top">
          <a className="brand" href="/"><img src="/logo.svg" alt="" />Bois d'Aurouze</a>
          <nav>
            <a href="/#photos">Photos</a>
            <a href="/#meteo">Neige</a>
            <a href="/#tarifs">Tarifs</a>
            <a href="/#faq">Questions</a>
            <a href="/documents">Documents</a>
            <a className="btn sm" href="/#reservation">Réserver</a>
          </nav>
        </header>
        {children}
        <footer>
          <p>Un propriétaire, pas une agence · <a href={`mailto:${PROPRIETAIRE.email}`}>{PROPRIETAIRE.email}</a></p>
          <p>{LOGEMENT.residence}, SuperDévoluy, 05250 Le Dévoluy · Meublé de tourisme · <a href="/documents#cgv">Conditions générales</a> · Contrat, état des lieux et inventaire envoyés avec la confirmation</p>
        </footer>
      </body>
    </html>
  );
}
