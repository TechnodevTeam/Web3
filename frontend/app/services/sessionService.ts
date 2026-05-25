type Speaker = {
  id: number;
  fullName: string;
  photoUrl: string | null;
  bio: string | null;
  externalLinks: string | null;
};
type Question = {
  id: number;
  content: string;
  authorName: string | null;
  upvotes: number;
  createdAt: string;
};
type Session = {
  id: number;
  eventId: number;
  eventTitle?: string;
  roomId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  capacity: number | null;
  roomName: string;
  live: boolean;
  speakers: Speaker[];
  questions: Question[];
};
const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // Vercel
  return "http://localhost:3000"; // Local server
};
const API_URL = `${getBaseUrl()}/api`;
export async function getSessionsByEventId(
  eventId: string
): Promise<Session[]> {
  const response = await fetch(`${API_URL}/events/${eventId}/sessions`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des sessions de l'événement");
  }
  return response.json();
}
export async function getAllSessions() {
  try {
    const response = await fetch(
      `${API_URL}/sessions`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error(
        "Erreur chargement sessions"
      );
    }
    return response.json();
  } catch (error) {
    console.error("Erreur getAllSessions:", error);
    return [];
  }
}
