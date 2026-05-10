type Room = {
  id: number;
  name: string;
  capacity: number;
  type: string;
};

type Session = {
  id: number;
  eventId: number;
  roomId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  capacity: number | null;
  roomName: string;
  live: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function getRooms(): Promise<Room[]> {
  try {
    const response = await fetch(`${API_URL}/rooms`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function getSessionsByRoomId(roomId: string): Promise<Session[]> {
  try {
    const response = await fetch(`${API_URL}/rooms/${roomId}/sessions`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    return [];
  }
}