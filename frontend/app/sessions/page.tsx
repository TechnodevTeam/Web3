"use client";
import { useState } from "react";
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
  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Sessions</h1>
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
          <button type="submit" style={{ padding: "0.75rem 1rem", background: "#2563eb", color: "#fff", border: "none", cursor: "pointer" }}>
            Ajouter la session
          </button>
        </form>
      </section>
      <section>
        <h2>Liste des sessions</h2>
        {sessions.length === 0 ? (
          <p>Aucune session disponible pour le moment.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {sessions.map((session) => (
              <li key={session.id} style={{ border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "1rem", marginBottom: "1rem" }}>
                <h3 style={{ margin: "0 0 0.5rem" }}>{session.title}</h3>
                <p style={{ margin: "0 0 0.5rem", color: "#6b7280" }}>{session.date}</p>
                <p style={{ margin: 0 }}>{session.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
