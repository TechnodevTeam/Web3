import { getRooms } from "@/app/services/roomService";
import RoomList from "@/app/components/RoomList";
export default async function RoomsPage() {
  const rooms = await getRooms();
  return (
    <section className="rooms-container">
      <div className="section-header">
        <h1>Salles</h1>
        <p className="subtitle">
          Rechercher une salle et consulter les sessions associées.
        </p>
      </div>
      <RoomList initialRooms={rooms} />
    </section>
  );
}
