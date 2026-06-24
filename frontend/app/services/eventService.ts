type Event = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
};
const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // Vercel
  return "http://localhost:3000"; // Local server
};
const API_URL = `${getBaseUrl()}/api`;
export async function getEvents(): Promise<Event[]> {
  try {
    const response = await fetch(`${API_URL}/events`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur getEvents:", error);
    return [];
  }
}
export async function getEventById(id: string): Promise<Event | null> {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur getEventById:", error);
    return null;
  }
}