import Link from "next/link";
import { getSessionsByRoomId } from "@/app/services/roomService";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type RoomSessionsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RoomSessionsPage({
  params,
}: RoomSessionsPageProps) {
  const { id } = await params;

  const sessions = await getSessionsByRoomId(id);

  return (
    <section>
      <Link href="/rooms" className="back-link" title="Retour aux salles">
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
      </Link>

      <h1>Sessions de la salle</h1>

      {sessions.length === 0 ? (
        <p>Aucune session trouvée pour cette salle.</p>
      ) : (
        <div className="card-list">
          {sessions.map((session) => (
            <div className="card" key={session.id}>
              <div className="card-header">
                <h2>{session.title}</h2>

                {session.live && <span className="live-badge">LIVE</span>}
              </div>

              <p>{session.description}</p>

              <p>
                <strong>Salle :</strong> {session.roomName}
              </p>

              <p>
                <strong>Début :</strong> {formatDateTime(session.startTime)}
              </p>

              <p>
                <strong>Fin :</strong> {formatDateTime(session.endTime)}
              </p>

              <p>
                <strong>Capacité :</strong>{" "}
                {session.capacity !== null ? session.capacity : "Non définie"}
              </p>

              <Link href={`/sessions/${session.id}`} className="btn-primary">
                Voir détails
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}