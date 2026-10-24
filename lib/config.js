// Paramètres du logement. Tout ce qui est en MAJUSCULES entre crochets est à remplacer.
export const LOGEMENT = {
  nom: "Studio SuperDévoluy",
  accroche: "Studio 4/5 personnes avec balcon, au pied des pistes",
  station: "SuperDévoluy, Le Dévoluy (Hautes-Alpes)",
  residence: "[NOM DE LA RÉSIDENCE]",
  adresse: "[ADRESSE COMPLÈTE], 05250 Le Dévoluy",
  surface: "[SURFACE] m²",
  capacite: 5,
  etage: "[ÉTAGE]",
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
  email: "[EMAIL]",
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
    { nom: "Hiver", debut: "12-01", fin: "04-15", nuit: 70, minNuits: 3 },
    { nom: "Été", debut: "07-01", fin: "08-31", nuit: 65, minNuits: 3 },
    { nom: "Basse saison", debut: "01-01", fin: "12-31", nuit: 50, minNuits: 2 },
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
