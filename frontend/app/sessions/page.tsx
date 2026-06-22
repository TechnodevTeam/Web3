"use client";

import { useState, useEffect } from "react";
import { useFavorites } from "../services/favoriteService";
import Link from "next/link";

type Session = {
  id: string;
  title: string;
  date: string;
  description: string;
};

const initialSessions: Session[] = [
  {
    id: "1",
    title: "Session d'introduction",
    date: "2025-06-01",
    description: "Introduction au Web3 et aux concepts de base.",
  },
  {
    id: "2",
    title: "Session de développement",
    date: "2025-06-10",
    description: "Création d'une application décentralisée simple.",
  },
];

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Hook pour les favoris
  const { toggleFavorite, isFavorite, isLoading, loadFavorites, getFavoritesCount } = useFavorites();

  // Charger les favoris au démarrage
  useEffect(() => {
    loadFavorites();
  }, [refreshKey]);

  const handleAddSession = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title || !date || !description) {
      return;
    }
    const newSession: Session = {
      id: String(Date.now()),
      title,
      date,
      description,
    };
    setSessions((current) => [newSession, ...current]);
    setTitle("");
    setDate("");
    setDescription("");
  };

  const handleToggleFavorite = async (session: Session) => {
    await toggleFavorite(session.id, session);
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h1>Sessions</h1>
        <p>Chargement des favoris...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      {/* Header avec compteur de favoris */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0 }}>Sessions</h1>
        <Link href="/favorites">
          <button style={{
            padding: "10px 20px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "1rem"
          }}>
            ❤️ Favoris ({getFavoritesCount})
          </button>
        </Link>
      </div>

      {/* Formulaire d'ajout */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Créer une nouvelle session</h2>
        <form onSubmit={handleAddSession} style={{ display: "grid", gap: "0.75rem", maxWidth: "420px" }}>
          <label>
            Titre
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Titre de la session"
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </label>
          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Description de la session"
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", minHeight: "100px" }}
            />
          </label>
          <button type="submit" style={{ padding: "0.75rem 1rem", background: "#2563eb", color: "#fff", border: "none", cursor: "pointer", borderRadius: "8px" }}>
            Ajouter la session
          </button>
        </form>
      </section>

      {/* Liste des sessions */}
      <section>
        <h2>Liste des sessions</h2>
        {sessions.length === 0 ? (
          <p>Aucune session disponible pour le moment.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {sessions.map((session) => (
              <li 
                key={session.id} 
                style={{ 
                  border: "1px solid #e5e7eb", 
                  borderRadius: "0.5rem", 
                  padding: "1rem", 
                  marginBottom: "1rem",
                  position: "relative",
                  background: "white"
                }}
              >
                {/* BOUTON CŒUR */}
                <button
                  onClick={() => handleToggleFavorite(session)}
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "2rem",
                    transition: "transform 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {isFavorite(session.id) ? "❤️" : "♡"}
                </button>

                <h3 style={{ margin: "0 0 0.5rem", paddingRight: "3rem" }}>{session.title}</h3>
                <p style={{ margin: "0 0 0.5rem", color: "#6b7280" }}>📅 {session.date}</p>
                <p style={{ margin: 0 }}>{session.description}</p>
                
                {/* Badge Favori */}
                {isFavorite(session.id) && (
                  <span style={{
                    display: "inline-block",
                    marginTop: "0.5rem",
                    padding: "0.25rem 0.75rem",
                    background: "#fee2e2",
                    color: "#ef4444",
                    borderRadius: "0.25rem",
                    fontSize: "0.75rem",
                    fontWeight: "bold"
                  }}>
                    ⭐ Favori
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}