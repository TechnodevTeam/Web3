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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function getSpeakerById(speakerId: string): Promise<Speaker> {
  const response = await fetch(`${API_URL}/speakers/${speakerId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erreur lors du chargement de l'intervenant");
  }

  return response.json();
}