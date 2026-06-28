import Link from "next/link";
import { getEventById } from "@/app/services/eventService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarDays,
  faLocationDot,
  faClock,
  faList,
  faDoorOpen,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

type Session = {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  roomName: string;
  capacity: number | null;
  live: boolean;
  speakers: { id: number; fullName: string }[];
}

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    return (
      <section className="event-detail-page">
        <Link href="/events" className="back-link">
          <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
        </Link>
        <h1>Événement introuvable</h1>
        <p>Désolé, nous n'avons pas pu trouver les détails de cet événement.</p>
      </section>
    );
  }

  const status = getEventStatus(event.startDate, event.endDate);
  const sessions: Session[] = event.sessions || [];
  const liveSessions = sessions.filter((s) => s.live);

  return (
    <section className="event-detail-page">
      <Link href="/events" className="back-link" title="">
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
      </Link>

      <div className="event-detail-hero">
        <span className={`event-status ${status.className}`}>{status.label}</span>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
        <div className="event-detail-actions">
          <Link href={`/events/${event.id}/sessions`} className="btn-primary">
            <FontAwesomeIcon icon={faList} className="button-icon" />
            Voir toutes les sessions
          </Link>
          <Link href="/events" className="btn-secondary">
            Tous les événements
          </Link>
        </div>
      </div>

      <div className="event-info-grid">
        <div className="info-card">
          <FontAwesomeIcon icon={faCalendarDays} className="info-icon" />
          <div>
            <h3>Date de début</h3>
            <p>{formatDate(event.startDate)}</p>
          </div>
        </div>
        <div className="info-card">
          <FontAwesomeIcon icon={faClock} className="info-icon" />
          <div>
            <h3>Date de fin</h3>
            <p>{formatDate(event.endDate)}</p>
          </div>
        </div>
        <div className="info-card">
          <FontAwesomeIcon icon={faLocationDot} className="info-icon" />
          <div>
            <h3>Lieu</h3>
            <p>{event.location}</p>
          </div>
        </div>
      </div>

      {/* Sessions Live */}
      {liveSessions.length > 0 && (
        <div className="event-detail-section">
          <h2>🔴 Sessions en cours</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {liveSessions.map((session) => (
              <SessionCard key={session.id} session={session} eventId={id} />
            ))}
          </div>
        </div>
      )}

      {/* Toutes les sessions */}
      <div className="event-detail-section">
        <h2>Programme ({sessions.length} session{sessions.length > 1 ? 's' : ''})</h2>
        {sessions.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Aucune session pour cet événement.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {sessions
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
              .map((session) => (
                <SessionCard key={session.id} session={session} eventId={id} />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SessionCard({ session, eventId }: { session: Session; eventId: string }) {
  return (
    <Link
      href={`/sessions/${session.id}`}
      style={{
        display: 'block', padding: '1rem', backgroundColor: 'white',
        borderRadius: '8px', border: session.live ? '2px solid #ff4444' : '1px solid #e5e7eb',
        textDecoration: 'none', color: 'inherit',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>{session.title}</h3>
        {session.live && (
          <span style={{
            background: '#ff4444', color: 'white',
            padding: '0.2rem 0.6rem', borderRadius: '4px',
            fontSize: '0.75rem', fontWeight: 'bold'
          }}>
            🔴 LIVE
          </span>
        )}
      </div>

      <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0 0 0.5rem' }}>
        {session.description}
      </p>

      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#4b5563', flexWrap: 'wrap' }}>
        <span>
          <FontAwesomeIcon icon={faClock} style={{ marginRight: '0.4rem' }} />
          {formatHour(session.startTime)} - {formatHour(session.endTime)}
        </span>
        <span>
          <FontAwesomeIcon icon={faDoorOpen} style={{ marginRight: '0.4rem' }} />
          {session.roomName}
        </span>
        {session.speakers && session.speakers.length > 0 && (
          <span>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: '0.4rem' }} />
            {session.speakers.map((s) => s.fullName).join(', ')}
          </span>
        )}
      </div>
    </Link>
  )
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("fr-FR", { dateStyle: "long" });
}

function formatHour(value: string): string {
  return new Date(value).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function getEventStatus(startDate: string, endDate: string) {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  if (today < start) return { label: "À venir", className: "upcoming" };
  if (today >= start && today <= end) return { label: "En cours", className: "ongoing" };
  return { label: "Terminé", className: "finished" };
}