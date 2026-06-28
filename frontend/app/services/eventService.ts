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

type Event = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  sessions?: Session[];
};

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

const API_URL = `${getBaseUrl()}/api`;

export async function getEvents(): Promise<Event[]> {
  try {
    const response = await fetch(`${API_URL}/events`, { cache: "no-store" });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Erreur getEvents:", error);
    return [];
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    // ← appelle directement le backend Express pour avoir les sessions
    const response = await fetch(`${BACKEND_URL}/events/${id}`, { cache: "no-store" });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur getEventById:", error);
    return null;
  }
}