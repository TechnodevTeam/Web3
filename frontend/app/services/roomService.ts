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
const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; 
  return "http://localhost:3000";
};
const API_URL = `${getBaseUrl()}/api`;
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
    console.error("Erreur getRooms:", error);
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
    console.error("Erreur getSessionsByRoomId:", error);
    return [];
  }
}
