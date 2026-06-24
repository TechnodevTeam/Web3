import Link from "next/link";
import { getSpeakerById } from "@/app/services/speakerService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUser,
  faMars,
  faVenus,
  faLink,
  faCalendarDays,
  faDoorOpen,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
type SpeakerPageProps = {
  params: Promise<{
    id: string;
  }>;
};
export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const { id } = await params;
  const speaker = await getSpeakerById(id);
  return (
    <section className="speaker-page">
      <Link href="/speakers" className="back-link" title="Retour">
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
      </Link>
      <div className="speaker-profile-card">
        <div className="speaker-photo">
          {speaker.photoUrl ? (
            <img src={speaker.photoUrl} alt={speaker.fullName} />
          ) : (
            <FontAwesomeIcon
              icon={getSpeakerGenderIcon(speaker.fullName)}
              className="speaker-default-icon"
              title={speaker.fullName}
            />
          )}
        </div>
        <div className="speaker-profile-content">
          <h1>{speaker.fullName}</h1>
          <p className="speaker-bio">
            {speaker.bio ? speaker.bio : "Aucune biographie disponible."}
          </p>
          {speaker.externalLinks && (
            <a
              href={speaker.externalLinks}
              target="_blank"
              rel="noreferrer"
              className="speaker-external-link"
            >
              <FontAwesomeIcon icon={faLink} />
              Voir le lien externe
            </a>
          )}
        </div>
      </div>
      <div className="speaker-sessions-section">
        <h2>Sessions associées</h2>
        {speaker.sessions.length === 0 ? (
          <p>Aucune session associée à cet intervenant.</p>
        ) : (
          <div className="speaker-session-list">
            {speaker.sessions.map((session) => (
              <div className="speaker-session-card" key={session.id}>
                <h3>{session.title}</h3>
                <p>{session.description}</p>
                <div className="speaker-session-meta">
                  <p>
                    <FontAwesomeIcon icon={faCalendarDays} />
                    <strong>Événement :</strong> {session.eventTitle}
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faDoorOpen} />
                    <strong>Salle :</strong> {session.roomName}
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faClock} />
                    <strong>Début :</strong>{" "}
                    {formatDateTime(session.startTime)}
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faClock} />
                    <strong>Fin :</strong> {formatDateTime(session.endTime)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function getSpeakerGenderIcon(fullName: string) {
  const firstName = fullName.trim().split(" ")[0].toLowerCase();
  const femaleNames = new Set(["mialy", "sarah", "tiana", "lisa", "marie", "anja", "fanja"]);
  if (femaleNames.has(firstName)) {
    return faVenus;
  }
  const maleNames = new Set(["jean", "hery", "toky", "rivo", "nicolas", "paul"]);
  if (maleNames.has(firstName)) {
    return faMars;
  }
  return faUser;
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
