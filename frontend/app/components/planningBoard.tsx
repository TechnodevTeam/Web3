"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { faSearch, faTimes, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
const formatHour = (value: string | null | undefined): string => {
  if (!value) return "--:--";
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return "--:--";
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "--:--";
  }
};
const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
const getDateKey = (timestamp: string): string => {
  return new Date(timestamp).toISOString().split("T")[0];
};
export default function PlanningBoard({ sessions = [], events = [] }: any) {
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [favorites, setFavorites] = useState<Set<number>>(() => new Set());
  useEffect(() => {
    if (typeof window !== "undefined") {
     const saved = localStorage.getItem("favoriteSessions");
      if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
      }
    }
  }, []);
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
  const sessionsWithEventTitle = safeSessions.map((session: any) => ({
    ...session,
    eventTitle: safeEvents.find((e: any) => e.id === session.eventId)?.title || "Sans événement",
  }));
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
  const groupedByDate = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredSessions.forEach((session: any) => {
      if (!session.startTime) return;
      const dateKey = getDateKey(session.startTime);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(session);
    });
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
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher une session..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button 
              className="clear-search" 
              onClick={() => setSearch("")}
              aria-label="Effacer la recherche"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
        <div className="filter-box">
          <FontAwesomeIcon icon={faFilter} className="filter-icon" />
          <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
            <option value="all">Tous les événements</option>
            {safeEvents.map((event: any) => (
              <option key={event.id} value={event.id}>
               {event.title}
             </option>
            ))}
          </select>
        </div>
      </div>
      {groupedByDate.length === 0 ? (
        <p>Aucune session correspondante.</p>
      ) : (
        groupedByDate.map(({ dateKey, sessions: dateSessions }) => {
          const timeSlots = Array.from(
            new Set(
              dateSessions
                .map((s: any) => formatHour(s.startTime))
                .filter((t): t is string => t !== null)
            )
          ).sort((a, b) => a.localeCompare(b));
          const rooms = Array.from(
            new Set(dateSessions.map((s: any) => s.roomName).filter(Boolean))
          ).sort();
          const grid: Record<string, Record<string, any[]>> = {};
          timeSlots.forEach((time) => {
            grid[time] = {};
            rooms.forEach((room) => {
              grid[time][room] = [];
            });
          });
          dateSessions.forEach((session: any) => {
            const hour = formatHour(session.startTime);
            if (hour && grid[hour] && Array.isArray(grid[hour][session.roomName])) {
              grid[hour][session.roomName].push(session);
            }
          });
          const orphanSessions = dateSessions.filter((s: any) => {
            const hour = formatHour(s.startTime);
            return !hour || !rooms.includes(s.roomName);
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
                          const slotSessions = grid[time]?.[room] || [];
                          return (
                            <td key={room} className="session-cell">
                              {slotSessions.map((session: any) => (
                                <div className="session-card" key={session.id} style={{ marginBottom: slotSessions.length > 1 ? '10px' : '0' }}>
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
                                    <span>🕒 {formatHour(session.startTime)} - {formatHour(session.endTime)}</span>
                                    {session.live && <span className="live-badge">LIVE</span>}
                                  </div>
                                  {session.speakers && session.speakers.length > 0 && (
                                    <div className="session-speakers">
                                      👤 {session.speakers.map((s: any) => s.fullName).join(", ")}
                                    </div>
                                  )}
                                  <p className="session-description">{session.description}</p>
                                </div>
                              ))}
                              {slotSessions.length === 0 && (
                                <div className="empty-session">Libre</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}
