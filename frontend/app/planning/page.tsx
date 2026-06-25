// frontend/app/planning/page.tsx
import PlanningBoard from "../components/planningBoard";
import { getAllSessions } from "../services/sessionService";

export default async function PlanningPage() {
  const sessions = await getAllSessions();
  return <PlanningBoard sessions={sessions} />;
}