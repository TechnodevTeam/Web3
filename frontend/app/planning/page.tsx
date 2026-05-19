import PlanningBoard from "../components/planningBoard";

import { getAllSessions } from "../services/sessionService";
import { getEvents } from "../services/eventService";

export default async function PlanningPage() {
  const sessions = await getAllSessions();
  const events = await getEvents();

  return (
    <PlanningBoard
      sessions={sessions}
      events={events}
    />
  );
}