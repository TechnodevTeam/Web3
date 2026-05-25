type SpeakerSession = {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  roomName: string;
  eventTitle: string;
};
type Speaker = {
  id: number;
  fullName: string;
  photoUrl: string | null;
  bio: string | null;
  externalLinks: string | null;
  sessions: SpeakerSession[];
};
const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // Vercel
  return "http://localhost:3000"; // Local server
};
const API_URL = `${getBaseUrl()}/api`;
export async function getSpeakerById(speakerId: string): Promise<Speaker> {
  try {
    const response = await fetch(`${API_URL}/speakers/${speakerId}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Erreur lors du chargement de l'intervenant");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur getSpeakerById:", error);
    throw error;
  }
}
