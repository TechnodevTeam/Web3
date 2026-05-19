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

  // Fonction robuste pour formater une heure
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

  // Heures uniques (ignorer les null)
  const timeSlots = useMemo(() => {
    const times = filteredSessions
      .map((s: any) => formatHour(s.startTime))
      .filter((t): t is string => t !== null);
    return Array.from(new Set(times)).sort((a, b) => a.localeCompare(b));
  }, [filteredSessions]);

  // Salles uniques (ignorer les null/undefined)
  const rooms = useMemo(() => {
    const roomSet = new Set(filteredSessions.map((s: any) => s.roomName).filter(Boolean));
    return Array.from(roomSet).sort();
  }, [filteredSessions]);

  // Grille : [heure][salle] = session ou null
  const grid = useMemo(() => {
    const map: Record<string, Record<string, any>> = {};
    timeSlots.forEach((time) => {
      map[time] = {};
      rooms.forEach((room) => {
        map[time][room] = null;
      });
    });
    filteredSessions.forEach((session: any) => {
      const hour = formatHour(session.startTime);
      if (hour && map[hour] && map[hour][session.roomName] === null) {
        map[hour][session.roomName] = session;
      }
    });
    return map;
  }, [filteredSessions, timeSlots, rooms]);

  // Debug : sessions non placées dans la grille (pour aider à corriger)
  const orphanSessions = filteredSessions.filter((session: any) => {
    const hour = formatHour(session.startTime);
    return !hour || !rooms.includes(session.roomName) || !grid[hour]?.[session.roomName];
  });

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
        <p>Sessions par horaires et salles</p>
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

      {timeSlots.length === 0 || rooms.length === 0 ? (
        <p>Aucune donnée à afficher (timeSlots ou rooms vide).</p>
      ) : (
        <>
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

          {/* Affichage debug des sessions non placées (à retirer plus tard) */}
          {orphanSessions.length > 0 && (
            <div className="debug-section">
              <h3>Sessions non affichées dans la grille (vérifiez roomName ou startTime) :</h3>
              <ul>
                {orphanSessions.map((s: any) => (
                  <li key={s.id}>
                    <strong>{s.title}</strong> — salle: "{s.roomName}", heure: "{s.startTime}"
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}