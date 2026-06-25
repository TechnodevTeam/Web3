// frontend/app/components/planningBoard.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCalendarAlt,
  faDoorOpen,
  faClock,
  faUser,
  faTrash,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useFavorites } from "../services/favoriteService";

// ============================================================
// TYPES
// ============================================================
interface Speaker {
  id: number;
  fullName: string;
}

interface Session {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  roomName: string;
  roomId?: number;
  eventTitle?: string;
  eventId?: number;
  speakers?: Speaker[];
  live?: boolean;
}

interface PlanningBoardProps {
  sessions: Session[];
}

// ============================================================
// UTILITAIRES
// ============================================================

// Grouper les sessions par date puis par horaire
const groupByDateAndTime = (sessions: Session[]): Record<string, Record<string, Session[]>> => {
  const groups: Record<string, Record<string, Session[]>> = {};
  sessions.forEach((session) => {
    const dateKey = new Date(session.startTime).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const timeKey = new Date(session.startTime).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (!groups[dateKey]) groups[dateKey] = {};
    if (!groups[dateKey][timeKey]) groups[dateKey][timeKey] = [];
    groups[dateKey][timeKey].push(session);
  });
  // Trier les dates
  const sortedDates: Record<string, Record<string, Session[]>> = {};
  Object.keys(groups)
    .sort((a, b) => {
      const da = new Date(a.split(" ").reverse().join(" ").replace(" ", " "));
      const db = new Date(b.split(" ").reverse().join(" ").replace(" ", " "));
      return da.getTime() - db.getTime();
    })
    .forEach((date) => {
      sortedDates[date] = groups[date];
      // Trier les horaires pour chaque date
      const sortedTimes: Record<string, Session[]> = {};
      Object.keys(sortedDates[date])
        .sort((a, b) => a.localeCompare(b))
        .forEach((time) => {
          sortedTimes[time] = sortedDates[date][time];
        });
      sortedDates[date] = sortedTimes;
    });
  return sortedDates;
};

// Récupérer toutes les salles uniques
const getUniqueRooms = (sessions: Session[]): string[] => {
  const rooms = new Set<string>();
  sessions.forEach((s) => rooms.add(s.roomName));
  return Array.from(rooms);
};

// Extraire les dates uniques pour le filtre
const getUniqueDates = (sessions: Session[]): string[] => {
  const dates = new Set<string>();
  sessions.forEach((s) => {
    const date = new Date(s.startTime).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    dates.add(date);
  });
  return Array.from(dates).sort((a, b) => {
    const da = new Date(a.split(" ").reverse().join(" ").replace(" ", " "));
    const db = new Date(b.split(" ").reverse().join(" ").replace(" ", " "));
    return da.getTime() - db.getTime();
  });
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export default function PlanningBoard({ sessions }: PlanningBoardProps) {
  const { favorites, toggleFavorite, loadFavorites } = useFavorites();
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const filteredSessions = useMemo(() => {
    if (selectedDate === "all") return sessions;
    return sessions.filter((s) => {
      const date = new Date(s.startTime).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return date === selectedDate;
    });
  }, [sessions, selectedDate]);

  const grouped = groupByDateAndTime(filteredSessions);
  const dates = Object.keys(grouped);
  const rooms = getUniqueRooms(filteredSessions);
  const allDates = useMemo(() => getUniqueDates(sessions), [sessions]);

  const totalSessions = filteredSessions.length;
  const totalRooms = rooms.length;
  const totalDates = dates.length;

  const handleToggleFavorite = (session: Session) => {
    try {
      toggleFavorite(session.id, session);
    } catch (err) {
      console.error("❌ Erreur toggleFavorite:", err);
      setError("Impossible de modifier les favoris. Veuillez réessayer.");
    }
  };

  if (!sessions || sessions.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>📋 Planning</h1>
        <p style={{ color: "#6b7280" }}>Aucune session disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
        Planning Multi-Track
      </h1>

      {/* Filtre par date */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontWeight: "500", color: "#1a202c" }}>
          <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: "0.25rem" }} />
          Filtrer par date :
        </span>
        <button
          onClick={() => setSelectedDate("all")}
          style={{
            padding: "0.4rem 1rem",
            borderRadius: "9999px",
            border: selectedDate === "all" ? "2px solid #2563eb" : "1px solid #e5e7eb",
            background: selectedDate === "all" ? "#dbeafe" : "white",
            color: selectedDate === "all" ? "#1d4ed8" : "#4b5563",
            cursor: "pointer",
            fontWeight: selectedDate === "all" ? "600" : "400",
            transition: "all 0.2s",
            fontSize: "0.9rem",
          }}
        >
          Toutes les dates
        </button>
        {allDates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              border: selectedDate === date ? "2px solid #2563eb" : "1px solid #e5e7eb",
              background: selectedDate === date ? "#dbeafe" : "white",
              color: selectedDate === date ? "#1d4ed8" : "#4b5563",
              cursor: "pointer",
              fontWeight: selectedDate === date ? "600" : "400",
              transition: "all 0.2s",
              fontSize: "0.9rem",
            }}
          >
            {date}
          </button>
        ))}
      </div>

      {/* Légende + compteur */}
      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ background: "#ef4444", color: "white", padding: "0.15rem 0.6rem", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: "bold" }}>
            <FontAwesomeIcon icon={faCircle} style={{ fontSize: "0.5rem", marginRight: "0.25rem" }} />
            LIVE
          </span>
          <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>Session en cours</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FontAwesomeIcon icon={faHeart} style={{ color: "#ef4444" }} />
          <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>Ajouter aux favoris</span>
        </span>
        <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>
          {totalSessions} session{totalSessions > 1 ? "s" : ""} • {totalRooms} salle{totalRooms > 1 ? "s" : ""} • {totalDates} jour{totalDates > 1 ? "s" : ""}
          <span style={{ marginLeft: "1rem", color: "#9ca3af" }}>
            <FontAwesomeIcon icon={faHeart} style={{ color: "#ef4444", marginRight: "0.25rem" }} />
            {favorites.length} favori{favorites.length > 1 ? "s" : ""}
          </span>
        </span>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div style={{
          padding: "0.75rem 1rem",
          background: "#fee2e2",
          color: "#dc2626",
          borderRadius: "8px",
          marginBottom: "1rem",
          border: "1px solid #fecaca",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span>❌ {error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#dc2626",
              fontSize: "1.2rem",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Grille multi-track */}
      {dates.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>
          Aucune session pour la date sélectionnée.
        </p>
      ) : (
        dates.map((date) => {
          const times = Object.keys(grouped[date]);
          const sessionsByTime = grouped[date];

          return (
            <div key={date} style={{ marginBottom: "2.5rem" }}>
              {/* En-tête de date */}
              <h2
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                  padding: "0.5rem 1rem",
                  background: "#f1f5f9",
                  borderRadius: "8px",
                  color: "#1e293b",
                  borderLeft: "4px solid #2563eb",
                }}
              >
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: "0.5rem" }} />
                {date}
              </h2>

              <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: "12px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                  {/* En-tête : Salles */}
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={{ padding: "0.75rem 1rem", borderBottom: "2px solid #e5e7eb", textAlign: "left", fontWeight: "600", minWidth: "100px" }}>
                        <FontAwesomeIcon icon={faClock} style={{ marginRight: "0.5rem" }} />
                        Horaire de début
                      </th>
                      {rooms.map((room) => (
                        <th
                          key={room}
                          style={{
                            padding: "0.75rem 1rem",
                            borderBottom: "2px solid #e5e7eb",
                            textAlign: "left",
                            fontWeight: "600",
                            minWidth: "180px",
                          }}
                        >
                          <FontAwesomeIcon icon={faDoorOpen} style={{ marginRight: "0.5rem" }} />
                          {room}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Corps : Sessions par horaire */}
                  <tbody>
                    {times.map((time, timeIndex) => {
                      const sessionsAtTime = sessionsByTime[time];
                      const roomSessionMap: Record<string, Session | null> = {};
                      rooms.forEach((room) => {
                        const session = sessionsAtTime.find((s) => s.roomName === room);
                        roomSessionMap[room] = session || null;
                      });

                      const isEven = timeIndex % 2 === 0;

                      return (
                        <tr
                          key={`${date}-${time}`}
                          style={{
                            borderBottom: "1px solid #e5e7eb",
                            background: isEven ? "#ffffff" : "#fafafa",
                          }}
                        >
                          {/* Colonne Horaire */}
                          <td
                            style={{
                              padding: "0.75rem 1rem",
                              fontWeight: "500",
                              color: "#1a202c",
                              verticalAlign: "middle",
                              whiteSpace: "nowrap",
                              background: isEven ? "#ffffff" : "#fafafa",
                            }}
                          >
                            {time}
                          </td>

                          {/* Colonnes Salles */}
                          {rooms.map((room) => {
                            const session = roomSessionMap[room];
                            return (
                              <td
                                key={`${date}-${time}-${room}`}
                                style={{
                                  padding: "0.5rem",
                                  verticalAlign: "top",
                                  background: session?.live ? "#fef2f2" : "transparent",
                                }}
                              >
                                {session ? (
                                  <div
                                    style={{
                                      padding: "0.75rem",
                                      background: "white",
                                      borderRadius: "8px",
                                      border: session.live ? "2px solid #ef4444" : "1px solid #e5e7eb",
                                      boxShadow: session.live ? "0 0 0 3px rgba(239, 68, 68, 0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
                                      transition: "box-shadow 0.2s",
                                      position: "relative",
                                    }}
                                  >
                                    {/* Badge Live */}
                                    {session.live && (
                                      <span
                                        style={{
                                          position: "absolute",
                                          top: "-0.5rem",
                                          right: "-0.5rem",
                                          background: "#ef4444",
                                          color: "white",
                                          fontSize: "0.6rem",
                                          fontWeight: "bold",
                                          padding: "0.15rem 0.5rem",
                                          borderRadius: "9999px",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faCircle} style={{ fontSize: "0.5rem", marginRight: "0.25rem" }} />
                                        LIVE
                                      </span>
                                    )}

                                    {/* Titre + lien */}
                                    <Link
                                      href={`/sessions/${session.id}`}
                                      style={{
                                        textDecoration: "none",
                                        color: "#1a202c",
                                        fontWeight: "600",
                                        fontSize: "0.9rem",
                                        display: "block",
                                        marginBottom: "0.25rem",
                                        lineHeight: "1.3",
                                      }}
                                    >
                                      {session.title}
                                    </Link>

                                    {/* Intervenants */}
                                    {session.speakers && session.speakers.length > 0 && (
                                      <div
                                        style={{
                                          fontSize: "0.75rem",
                                          color: "#6b7280",
                                          marginBottom: "0.25rem",
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faUser} style={{ marginRight: "0.25rem" }} />
                                        {session.speakers.map((s) => s.fullName).join(", ")}
                                      </div>
                                    )}

                                    {/* Événement */}
                                    {session.eventTitle && (
                                      <div
                                        style={{
                                          fontSize: "0.7rem",
                                          color: "#9ca3af",
                                          marginBottom: "0.5rem",
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: "0.25rem" }} />
                                        {session.eventTitle}
                                      </div>
                                    )}

                                    {/* Cœur Favori */}
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleToggleFavorite(session);
                                      }}
                                      style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "1.2rem",
                                        padding: "0.1rem 0.25rem",
                                        color: favorites.some(f => f.sessionId === session.id) ? "#ef4444" : "#d1d5db",
                                        transition: "transform 0.2s",
                                        display: "inline-flex",
                                        alignItems: "center",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.2)";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                      }}
                                      aria-label={favorites.some(f => f.sessionId === session.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                                    >
                                      <FontAwesomeIcon
                                        icon={favorites.some(f => f.sessionId === session.id) ? faHeart : faHeartRegular}
                                        style={{ color: favorites.some(f => f.sessionId === session.id) ? "#ef4444" : "#d1d5db" }}
                                      />
                                    </button>
                                  </div>
                                ) : (
                                  // Case vide
                                  <div
                                    style={{
                                      height: "100%",
                                      minHeight: "60px",
                                      background: "#f9fafb",
                                      borderRadius: "8px",
                                      border: "1px dashed #e5e7eb",
                                    }}
                                  />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}