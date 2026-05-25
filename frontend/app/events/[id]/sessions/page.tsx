import Link from "next/link";
import { getSessionsByEventId } from "@/app/services/sessionService";
import QuestionForm from "@/app/components/QuestionForm";
import QuestionItem from "@/app/components/QuestionItem";
import QuestionList from "@/app/components/QuestionList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faClock,
  faDoorOpen,
  faUsers,
  faQuestionCircle,
  faMicrophone,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
type EventSessionsPageProps = {
  params: Promise<{
    id: string;
  }>;
};
export default async function EventSessionsPage({
  params,
}: EventSessionsPageProps) {
  const { id } = await params;
  const sessions = await getSessionsByEventId(id);
  return (
    <section className="sessions-page">
      <Link href={`/events/${id}`} className="back-link" title="Retour">
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
      </Link>
      <div className="page-header">
        <h1>Sessions de l’événement</h1>
        <p>
          Voici les interventions ou activités prévues pour cet événement.
        </p>
      </div>
      {sessions.length === 0 ? (
        <p>Aucune session trouvée pour cet événement.</p>
      ) : (
        <div className="session-list">
          {sessions.map((session) => (
            <article className="session-full-card" key={session.id}>
              <div className="session-title-row">
                <h2>{session.title}</h2>
                {session.live && <span className="live-badge">LIVE</span>}
              </div>
              <p className="session-description">{session.description}</p>
              <div className="session-info-grid">
                <div className="session-info-item">
                  <FontAwesomeIcon icon={faDoorOpen} className="meta-icon" />
                  <div>
                    <strong>Salle</strong>
                    <p>{session.roomName}</p>
                  </div>
                </div>
                <div className="session-info-item">
                  <FontAwesomeIcon icon={faClock} className="meta-icon" />
                  <div>
                    <strong>Début</strong>
                    <p>{formatDateTime(session.startTime)}</p>
                  </div>
                </div>
                <div className="session-info-item">
                  <FontAwesomeIcon icon={faClock} className="meta-icon" />
                  <div>
                    <strong>Fin</strong>
                    <p>{formatDateTime(session.endTime)}</p>
                  </div>
                </div>
                <div className="session-info-item">
                  <FontAwesomeIcon icon={faUsers} className="meta-icon" />
                  <div>
                    <strong>Capacité</strong>
                    <p>
                      {session.capacity !== null
                        ? session.capacity
                        : "Non définie"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="session-section">
                <h3>
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className="section-icon"
                  />
                  Intervenants
                </h3>
                {session.speakers.length === 0 ? (
                  <p>Aucun intervenant associé.</p>
                ) : (
                  <ul className="speaker-list">
                    {session.speakers.map((speaker) => (
                      <li key={speaker.id} className="speaker-list-item">
                        <span>{speaker.fullName}</span>
                        <Link
                          href={`/speakers/${speaker.id}`}
                          className="speaker-info-link"
                          title={`Voir les informations de ${speaker.fullName}`}
                        >
                          <FontAwesomeIcon icon={faCircleInfo} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="session-section">
                <h3>
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="section-icon"
                  />
                  Questions
                </h3>
                {session.questions && session.questions.length === 0 ? (
                  <p>Aucune question pour cette session.</p>
                ) : (
                  <ul className="question-list-small">
                    <QuestionList
                      initialQuestions={session.questions || []}
                    />
                  </ul>
                )}
                {session.live && <QuestionForm sessionId={session.id} />}
              </div>
            </article>
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
