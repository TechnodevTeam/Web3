# EventSync — Plateforme de gestion d'événements

EventSync est une application web full-stack permettant de gérer des événements, des sessions, des salles et des intervenants, avec un système de questions en direct et de favoris pour les participants.

## Stack technique

| Couche | Technologie |
|--------|------------|
| Frontend | Next.js 14, TypeScript, CSS modules |
| Backend | Node.js, Express |
| Base de données | PostgreSQL (via Sequelize) |
| Auth | JWT (middleware Next.js) |

## Fonctionnalités

- 📅 Consultation des événements et sessions
- 🏛️ Gestion des salles disponibles
- 🎤 Pages dédiées aux intervenants
- ❤️ Système de favoris (persisté en local)
- ❓ Soumission et upvote de questions en direct
- 🗓️ Planning interactif des sessions
- 🔐 Espace administration sécurisé

## Lancer le projet

### Prérequis
- Node.js ≥ 18
- PostgreSQL en cours d'exécution

### Backend
```bash
cd backend
npm install
# Configurer les variables d'environnement dans .env
node init-db-and-data.js   # initialiser la base de données
node index.js              # démarrer le serveur (port 3001)
```

### Frontend
```bash
cd frontend
npm install
npm run dev                # démarrer l'app (port 3000)
```

## Équipe — TechnodevTeam

Projet réalisé dans le cadre du cours **Web3**

| Nom | Numéro étudiant |
|-----|----------------|
| Mahefa | STD24173 |
| Antsa | STD24135 |
| Franco | STD24029 |
| Miaritsoa | STD24078 |