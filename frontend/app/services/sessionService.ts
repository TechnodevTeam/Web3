//app/services/sessionService.ts

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
}