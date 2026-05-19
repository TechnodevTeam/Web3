"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Session = {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  roomName: string;
  eventId: number;
  live: boolean;
  speakers: { fullName: string }[];
};

// Fonction utilitaire pour formater une heure
const formatHour = (value: string | null | undefined): string | null => {
  if (!value) return null;
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return null;
  }
};

// Fonction pour formater une date complète (ex: "20 Mai 2026")
const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Extraire la date (YYYY-MM-DD) à partir d'un timestamp
const getDateKey = (timestamp: string): string => {
  return new Date(timestamp).toISOString().split("T")[0];
};

export default function PlanningBoard({ sessions = [], events = [] }: any) {
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favoriteSessions");
      return new Set(saved ? JSON.parse(saved) : []);
    }
    return new Set();
  });

  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeEvents = Array.isArray(events) ? events : [];

  if (safeSessions.length === 0) {
    return (
      <section className="planning-multitrack">
        <div className="planning-header">
          <h1>Planning Multi-Track</h1>
          <p>Aucune session trouvée.</p>
        </div>
      </section>
    );
  }

  // Enrichir avec titre événement
  const sessionsWithEventTitle = safeSessions.map((session: any) => ({
    ...session,
    eventTitle: safeEvents.find((e: any) => e.id === session.eventId)?.title || "Sans événement",
  }));

  // Filtrage
  const filteredSessions = useMemo(() => {
    return sessionsWithEventTitle.filter((session: any) => {
      const matchesSearch =
        session.title.toLowerCase().includes(search.toLowerCase()) ||
        session.roomName?.toLowerCase().includes(search.toLowerCase()) ||
        session.speakers?.some((s: any) => s.fullName.toLowerCase().includes(search.toLowerCase()));
      const matchesEvent = selectedEvent === "all" || String(session.eventId) === selectedEvent;
      return matchesSearch && matchesEvent;
    });
  }, [sessionsWithEventTitle, search, selectedEvent]);

  // Regrouper les sessions par date (clé YYYY-MM-DD)
  const groupedByDate = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredSessions.forEach((session: any) => {
      if (!session.startTime) return;
      const dateKey = getDateKey(session.startTime);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(session);
    });
    // Trier les dates
    const sortedDates = Object.keys(groups).sort();
    const result: { dateKey: string; sessions: any[] }[] = sortedDates.map(dateKey => ({
      dateKey,
      sessions: groups[dateKey],
    }));
    return result;
  }, [filteredSessions]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      localStorage.setItem("favoriteSessions", JSON.stringify([...newSet]));
      return newSet;
    });
  };

  return (
    <section className="planning-multitrack">
      <div className="planning-header">
        <h1>Planning Multi-Track</h1>
        <p>Sessions organisées par date, horaires et salles</p>
      </div>

      <div className="planning-filters">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
          <option value="all">Tous les événements</option>
          {safeEvents.map((event: any) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      {groupedByDate.length === 0 ? (
        <p>Aucune session correspondante.</p>
      ) : (
        groupedByDate.map(({ dateKey, sessions: dateSessions }) => {
          // Pour cette date, extraire les créneaux horaires (heures de début uniques)
          const timeSlots = Array.from(
            new Set(
              dateSessions
                .map((s: any) => formatHour(s.startTime))
                .filter((t): t is string => t !== null)
            )
          ).sort((a, b) => a.localeCompare(b));

          // Salles uniques pour cette date
          const rooms = Array.from(
            new Set(dateSessions.map((s: any) => s.roomName).filter(Boolean))
          ).sort();

          // Construire la grille [heure][salle] = session ou null
          const grid: Record<string, Record<string, any>> = {};
          timeSlots.forEach((time) => {
            grid[time] = {};
            rooms.forEach((room) => {
              grid[time][room] = null;
            });
          });
          dateSessions.forEach((session: any) => {
            const hour = formatHour(session.startTime);
            if (hour && grid[hour] && grid[hour][session.roomName] === null) {
              grid[hour][session.roomName] = session;
            }
          });

          // Sessions orphelines pour debug (optionnel)
          const orphanSessions = dateSessions.filter((s: any) => {
            const hour = formatHour(s.startTime);
            return !hour || !rooms.includes(s.roomName) || !grid[hour]?.[s.roomName];
          });

          return (
            <div key={dateKey} className="planning-date-group">
              <h2 className="date-header">{formatDate(dateKey)}</h2>
              <div className="overflow-x-auto">
                <table className="planning-table">
                  <thead>
                    <tr>
                      <th className="time-header">Horaire</th>
                      {rooms.map((room) => (
                        <th key={room} className="room-header">{room}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((time) => (
                      <tr key={time}>
                        <td className="time-cell">{time}</td>
                        {rooms.map((room) => {
                          const session = grid[time]?.[room];
                          return (
                            <td key={room} className="session-cell">
                              {session ? (
                                <div className="session-card">
                                  <div className="session-header">
                                    <Link href={`/sessions/${session.id}`} className="session-title">
                                      {session.title}
                                    </Link>
                                    <button
                                      className={`favorite-btn ${favorites.has(session.id) ? "active" : ""}`}
                                      onClick={() => toggleFavorite(session.id)}
                                    >
                                      ♥
                                    </button>
                                  </div>
                                  <div className="session-meta">
                                    <span>{formatHour(session.startTime)} - {formatHour(session.endTime)}</span>
                                    <span>📌 {session.roomName}</span>
                                  </div>
                                  {session.speakers?.length > 0 && (
                                    <div className="session-speakers">
                                      🎤 {session.speakers.map((s: any) => s.fullName).join(", ")}
                                    </div>
                                  )}
                                  {session.live && <span className="live-badge">LIVE</span>}
                                  <p className="session-description">{session.description?.substring(0, 80)}...</p>
                                </div>
                              ) : (
                                <span className="empty-session">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {orphanSessions.length > 0 && (
                <div className="debug-section">
                  <strong>Sessions non affichées pour cette date :</strong>
                  <ul>
                    {orphanSessions.map((s: any) => (
                      <li key={s.id}>
                        {s.title} (salle: "{s.roomName}", heure: "{s.startTime}")
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })
      )}
    </section>
  );
}