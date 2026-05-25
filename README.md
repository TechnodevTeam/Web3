Projet Web3 par 4 Groupe des personnes

## Setup PostgreSQL

1. Create the database and user:

```powershell
psql -U postgres -c "CREATE USER user1 WITH PASSWORD '01234';"
psql -U postgres -c "CREATE DATABASE eventsync_db OWNER user1;"
psql -U postgres -d eventsync_db -c "ALTER SCHEMA public OWNER TO user1;"
psql -U postgres -d eventsync_db -c "GRANT ALL ON SCHEMA public TO user1;"
```

2. Initialize the schema:

If you have PostgreSQL CLI installed:

```powershell
psql -U user1 -d eventsync_db -f backend/init-db.sql
```

If you do not have `psql` installed, use the backend init script instead:

```powershell
cd backend
npm install
npm run init-db
```

3. Start the backend:

```powershell
cd backend
npm install
npm run dev
```

4. Start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

> If you change the DB credentials, update `backend/.env` and the hardcoded credentials in `frontend/app/api/*.ts`.
