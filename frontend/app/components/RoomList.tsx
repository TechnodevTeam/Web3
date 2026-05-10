"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faDoorOpen, faUsers, faTag, faFilter } from "@fortawesome/free-solid-svg-icons";

interface Room {
  id: string | number;
  name: string;
  capacity: number;
  type: string;
}

interface RoomListProps {
  initialRooms: Room[];
}

export default function RoomList({ initialRooms }: RoomListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const roomTypes = useMemo(() => {
    const types = new Set(initialRooms.map(r => r.type).filter(Boolean));
    return ["all", ...Array.from(types)];
  }, [initialRooms]);

  const filteredRooms = useMemo(() => {
    return initialRooms.filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || room.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, filterType, initialRooms]);

  return (
    <div className="room-list-wrapper">
      <div className="search-filter-bar">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher une salle..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <FontAwesomeIcon icon={faFilter} className="filter-icon" />
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Tous les types</option>
            {roomTypes.filter(t => t !== "all").map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="results-count">
        {filteredRooms.length} salle{filteredRooms.length > 1 ? "s" : ""} trouvée{filteredRooms.length > 1 ? "s" : ""}
      </div>

      {filteredRooms.length === 0 ? (
        <div className="no-results">
          <p>Aucune salle ne correspond à vos critères.</p>
        </div>
      ) : (
        <div className="card-list">
          {filteredRooms.map((room) => (
            <div className="card" key={room.id}>
              <div className="card-header">
                <FontAwesomeIcon icon={faDoorOpen} className="room-icon" />
                <h2>{room.name}</h2>
              </div>
              
              <div className="info-grid">
                <p>
                  <FontAwesomeIcon icon={faUsers} className="card-icon" />
                  <strong>Capacité :</strong> {room.capacity} personnes
                </p>
                <p>
                  <FontAwesomeIcon icon={faTag} className="card-icon" />
                  <strong>Type :</strong> {room.type}
                </p>
              </div>

              <Link href={`/rooms/${room.id}/sessions`} className="btn-primary">
                Voir les sessions
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
