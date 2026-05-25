import { getEvents } from "@/app/services/eventService";
import EventList from "@/app/components/EventList";
export default async function EventsPage() {
  const events = await getEvents();
  return (
    <section className="events-container">
      <div className="section-header">
        <h1>Découvrir les événements</h1>
        <p className="subtitle">Trouvez et rejoignez les meilleures conférences Web3 à travers le monde.</p>
      </div>
      <EventList initialEvents={events} />
    </section>
  );
}
