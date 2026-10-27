// Paramètres du logement. Tout ce qui est en MAJUSCULES entre crochets est à remplacer.
export const LOGEMENT = {
  nom: "Studio SuperDévoluy",
  accroche: "Studio 4/5 personnes avec balcon, au pied des pistes",
  station: "SuperDévoluy, Le Dévoluy (Hautes-Alpes)",
  residence: "Résidence Le Bois d'Aurouze",
  adresse: "Appartement n° 347 N, Résidence Le Bois d'Aurouze, SuperDévoluy, 05250 Le Dévoluy",
  surface: "[SURFACE] m²",
  capacite: 5,
  etage: "3e étage",
  numeroEnregistrement: "[NUMÉRO D'ENREGISTREMENT MAIRIE]",
  couchages: [
    "Lit mezzanine 1 personne (90 cm)",
    "Clic-clac 2 personnes sous la mezzanine",
    "Banquette convertible 2 personnes",
  ],
  equipements: [
    "Balcon avec vue montagne",
    "Kitchenette : plaques, frigo-congélateur, micro-ondes",
    "Salle d'eau : douche, lavabo, WC",
    "TV, armoire, étendoir",
    "Chauffage électrique",
    "Table 4 chaises",
    "Casier à skis [À CONFIRMER]",
    "Parking [À CONFIRMER]",
  ],
  atouts: [
    "Pistes et remontées à [DISTANCE] m",
    "Commerces et restaurants à [DISTANCE] m",
    "Domaine du Dévoluy : 100 km de pistes, 1 500 à 2 500 m",
    "Été : randonnée, VTT, via ferrata, lac du Sautet",
  ],
};

export const PROPRIETAIRE = {
  nom: "[NOM PRÉNOM DU PROPRIÉTAIRE]",
  adresse: "[ADRESSE DU PROPRIÉTAIRE]",
  email: "yhnguyen@edl.fr",
  telephone: "[TÉLÉPHONE]",
};

// Tarifs en euros par nuit. Les saisons sont testées dans l'ordre : la première qui correspond gagne.
export const TARIFS = {
  menage: 50,
  caution: 300,
  taxeSejourParPersonneParNuit: 0.9,
  acomptePourcent: 30, // acompte si l'arrivée est à plus de 30 jours, sinon 100 %
  joursAvantSolde: 30,
  saisons: [
    { nom: "Vacances de Noël", debut: "12-20", fin: "01-05", nuit: 95, minNuits: 7 },
    { nom: "Vacances de février", debut: "02-07", fin: "03-08", nuit: 95, minNuits: 7 },
    { nom: "Hiver", debut: "12-01", fin: "04-15", nuit: 60, minNuits: 3 },
    { nom: "Été", debut: "07-01", fin: "08-31", nuit: 45, minNuits: 3 },
    { nom: "Basse saison", debut: "01-01", fin: "12-31", nuit: 40, minNuits: 2 },
  ],
};

export const PHOTOS = [
  { src: "/photos/01-sejour-balcon.jpg", alt: "Séjour avec balcon et coin repas" },
  { src: "/photos/02-sejour-vue.jpg", alt: "Séjour, vue sur la montagne" },
  { src: "/photos/03-coin-repas.jpg", alt: "Coin repas et banquette" },
  { src: "/photos/04-couchages.jpg", alt: "Lit mezzanine et banquettes" },
  { src: "/photos/05-rangements.jpg", alt: "Armoire et télévision" },
  { src: "/photos/06-cuisine.jpg", alt: "Kitchenette équipée" },
  { src: "/photos/07-salle-eau.jpg", alt: "Salle d'eau" },
];

// Forfaits de ski Dévoluy 2025-2026 (indicatif, pour le calculateur).
export const FORFAITS = { adulte6j: 220, enfant6j: 179, adulteJour: 44 };

export const PHOTOS_LEGENDES = ["Coin repas", "Séjour et vue", "Depuis la mezzanine", "Couchages", "Rangements", "Kitchenette", "Salle d'eau"];

export const FAQ = [
  ["Le linge est-il fourni ?", "Couettes et oreillers sont sur place. Draps et serviettes sur demande dans le formulaire ; sinon pensez à les apporter."],
  ["À quelle distance sont les pistes ?", "Le Bois d'Aurouze est à deux pas du télésiège du Jas. Pistes, école de ski et commerces se rejoignent à pied, skis sur l'épaule."],
  ["Comment se passe le paiement ?", "Acompte de 30 % par lien de paiement sécurisé (carte bancaire), solde 30 jours avant l'arrivée. Caution de 300 € à l'arrivée, restituée sous 10 jours après l'état des lieux."],
  ["Et si je dois annuler ?", "Plus de 30 jours avant : acompte remboursé moins 30 € de frais. De 30 à 8 jours : acompte conservé. Moins de 8 jours ou non-présentation : séjour dû. Fermeture administrative de la station : remboursement intégral."],
  ["Peut-on arriver tard le soir ?", "Oui, dites-le dans votre demande : la remise des clés s'organise à l'avance."],
  ["Animaux, fumeurs, nombre de personnes ?", "Non-fumeur. Animaux sur accord préalable. 5 personnes maximum, enfants compris."],
];
