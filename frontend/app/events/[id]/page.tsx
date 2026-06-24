import Link from "next/link";
import { getEventById } from "@/app/services/eventService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarDays,
  faLocationDot,
  faClock,
  faList,
} from "@fortawesome/free-solid-svg-icons";
type EventDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};
export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
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
  return (
    <section className="event-detail-page">
      <Link href="/events" className="back-link" title="">
        <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
      </Link>
      <div className="event-detail-hero">
        <span className={`event-status ${status.className}`}>
          {status.label}
        </span>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
        <div className="event-detail-actions">
          <Link href={`/events/${event.id}/sessions`} className="btn-primary">
            <FontAwesomeIcon icon={faList} className="button-icon" />
            Voir les sessions
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
      <div className="event-detail-section">
        <h2>À propos de cet événement</h2>
        <p>
          Cette page présente les informations détaillées de l’événement.
          Pour consulter le programme complet, clique sur le ici   
          <Link href={`/events/${event.id}/sessions`}>
            Voir détails
          </Link>.
        </p>
      </div>
    </section>
  );
}
function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("fr-FR", {
    dateStyle: "long",
  });
}
function getEventStatus(startDate: string, endDate: string) {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  if (today < start) {
    return {
      label: "À venir",
      className: "upcoming",
    };
  }
  if (today >= start && today <= end) {
    return {
      label: "En cours",
      className: "ongoing",
    };
  }
  return {
    label: "Terminé",
    className: "finished",
  };
}
