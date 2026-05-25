"use client";

import { useMemo, useState } from "react";

import {
  faCalendar,
  faClock,
  faSearch,
  faTimes,
  faFilter,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  initialRooms: any[];
};

function formatHour(value: string | null | undefined): string {
  if (!value) return "--:--";
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "--:--";
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "--:--";
  }
}

export default function RoomList({
  initialRooms,
}: Props) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredRooms = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    return initialRooms.filter((room) => {
      const matchesRoomName = room.name
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesSessionTitle = room.sessions?.some((session: any) =>
        session.title?.toLowerCase().includes(normalizedSearch) ||
        session.description?.toLowerCase().includes(normalizedSearch)
      );

      const matchesSearch =
        normalizedSearch === "" ||
        matchesRoomName ||
        matchesSessionTitle;

      const hasSessions = room.sessions && room.sessions.length > 0;
      const matchesFilter =
        filterType === "all" ||
        (filterType === "active" && hasSessions) ||
        (filterType === "empty" && !hasSessions);

      return matchesSearch && matchesFilter;
    });
  }, [initialRooms, search, filterType]);

  return (
    <>
      <div className="search-filter-bar">
        <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />

          <input
            type="text"
            placeholder="Rechercher une salle ou une session..."
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
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Toutes les salles</option>
            <option value="active">Avec sessions</option>
            <option value="empty">Sans session</option>
          </select>
        </div>
      </div>

      <div className="room-grid">
        {filteredRooms.map((room: any) => (
          <div
            className="room-card"
            key={room.id}
          >
            <div className="room-card-header">
              <h2 className="room-card-title">{room.name}</h2>
              {room.capacity && (
                <div className="room-capacity">
                  <FontAwesomeIcon icon={faUsers} />
                  <span>{room.capacity}</span>
                </div>
              )}
            </div>

            <div className="room-planning">
              <h3>
                <FontAwesomeIcon
                  icon={faCalendar}
                />

                Planning
              </h3>

              {(!room.sessions || room.sessions.length === 0) ? (
                <p>
                  Aucune session organisée.
                </p>
              ) : (
                <ul className="room-session-list">
                  {room.sessions.map(
                    (session: any) => (
                      <li
                        key={session.id}
                        className="room-session-item"
                      >
                        <div>
                          <strong>
                            {session.title}
                          </strong>
                        </div>

                        <span>
                          <FontAwesomeIcon
                            icon={faClock}
                          />

                          {formatHour(
                            session.startTime
                          )}{" "}
                          -{" "}
                          {formatHour(
                            session.endTime
                          )}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
