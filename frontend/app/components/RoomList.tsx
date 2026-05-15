"use client";

import { useMemo, useState } from "react";

import {
  faCalendar,
  faClock,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  initialRooms: any[];
};

export default function RoomList({
  initialRooms,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredRooms = useMemo(() => {
    return initialRooms.filter((room) =>
      room.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [initialRooms, search]);

  return (
    <>
      <div className="room-search">
        <FontAwesomeIcon icon={faSearch} />

        <input
          type="text"
          placeholder="Rechercher une salle..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <div className="room-grid">
        {filteredRooms.map((room: any) => (
          <div
            className="room-card"
            key={room.id}
          >
            <div className="room-card-header">
              <h2>{room.name}</h2>
            </div>

            <div className="room-planning">
              <h3>
                <FontAwesomeIcon
                  icon={faCalendar}
                />

                Planning
              </h3>

              {room.sessions.length === 0 ? (
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

function formatHour(value: string) {
  return new Date(value).toLocaleTimeString(
    "fr-FR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}