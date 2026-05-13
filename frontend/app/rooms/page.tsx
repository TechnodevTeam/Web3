import {
  faCalendar,
  faClock,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getRooms } from "@/app/services/roomService";

import RoomList from "@/app/components/RoomList";

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <section className="rooms-container">
      <div className="section-header">
        <h1>Salles</h1>

        <p className="subtitle">
          Consulter les salles disponibles et
          les sessions organisées.
        </p>
      </div>

      <RoomList initialRooms={rooms} />

      <div className="room-grid">
        {rooms.map((room: any) => (
          <div
            className="room-card"
            key={room.id}
          >
            <div className="room-card-header">
              <h2>{room.name}</h2>

              <span className="room-capacity">
                <FontAwesomeIcon
                  icon={faUsers}
                />

                {room.capacity}
              </span>
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
    </section>
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