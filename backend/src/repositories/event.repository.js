const db = require("../db");

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Introduction au Web3",
    description: "Une session complète sur les bases de la blockchain et du Web3.",
    startDate: "2026-06-10T09:00:00Z",
    endDate: "2026-06-10T17:00:00Z",
    location: "Paris, France"
  },
  {
    id: 2,
    title: "Ethereum Developer Summit",
    description: "Conférence pour les développeurs Solidity et Ethereum.",
    startDate: "2026-07-15T10:00:00Z",
    endDate: "2026-07-17T18:00:00Z",
    location: "Berlin, Allemagne"
  },
  {
    id: 3,
    title: "Intelligence Artificielle & Futur",
    description: "Découvrez comment l'IA transforme notre quotidien et les industries de demain.",
    startDate: "2026-08-05T09:00:00Z",
    endDate: "2026-08-05T18:00:00Z",
    location: "Lyon, France"
  },
  {
    id: 4,
    title: "Développement d'Applications Modernes",
    description: "Atelier pratique sur les frameworks récents et les meilleures pratiques de code.",
    startDate: "2026-09-12T10:00:00Z",
    endDate: "2026-09-12T17:00:00Z",
    location: "Nantes, France"
  },
  {
    id: 5,
    title: "Cybersécurité & Protection des Données",
    description: "Apprenez les fondamentaux de la sécurité informatique pour protéger vos applications et vos utilisateurs.",
    startDate: "2026-10-20T09:00:00Z",
    endDate: "2026-10-20T18:00:00Z",
    location: "Bordeaux, France"
  },
  {
    id: 6,
    title: "Blockchain & Finance Décentralisée",
    description: "Plongez dans l'univers de la DeFi et comprenez les nouveaux protocoles financiers.",
    startDate: "2026-11-05T14:00:00Z",
    endDate: "2026-11-05T19:00:00Z",
    location: "Toulouse, France"
  },
  {
    id: 7,
    title: "UX/UI Design pour le Web3",
    description: "Comment créer des interfaces intuitives pour des technologies complexes.",
    startDate: "2026-12-01T09:30:00Z",
    endDate: "2026-12-01T16:30:00Z",
    location: "Montpellier, France"
  },
  {
    id: 8,
    title: "Cloud Computing & Scalabilité",
    description: "Gérez des infrastructures massives et optimisez les performances de vos applications.",
    startDate: "2027-01-15T09:00:00Z",
    endDate: "2027-01-15T18:00:00Z",
    location: "Lille, France"
  },
  {
    id: 9,
    title: "DevOps & CI/CD Mastery",
    description: "Automatisez vos déploiements et améliorez la collaboration entre vos équipes tech.",
    startDate: "2027-02-20T10:00:00Z",
    endDate: "2027-02-20T17:00:00Z",
    location: "Nantes, France"
  }
];

async function findAllEvents() {
  try {
    const result = await db.query(`
      SELECT
        id,
        title,
        description,
        start_date AS "startDate",
        end_date AS "endDate",
        location
      FROM events
      ORDER BY start_date
    `);
    return result.rows;
  } catch (error) {
    return MOCK_EVENTS;
  }
}

async function findEventById(id) {
  try {
    const result = await db.query(
      `
      SELECT
        id,
        title,
        description,
        start_date AS "startDate",
        end_date AS "endDate",
        location
      FROM events
      WHERE id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    return MOCK_EVENTS.find((e) => e.id === id) || null;
  }
}

module.exports = {
  findAllEvents,
  findEventById,
};
