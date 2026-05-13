"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faCalendarAlt, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

interface Event {
  id: string | number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
}

interface EventListProps {
  initialEvents: Event[];
}

export default function EventList({ initialEvents }: EventListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");

  const locations = useMemo(() => {
    const locs = new Set(initialEvents.map(e => e.location));
    return ["all", ...Array.from(locs)];
  }, [initialEvents]);

  const filteredEvents = useMemo(() => {
    return initialEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = filterLocation === "all" || event.location === filterLocation;
      return matchesSearch && matchesLocation;
    });
  }, [searchTerm, filterLocation, initialEvents]);

  return (
    <div className="event-list-wrapper">
      <div className="search-filter-bar">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher un événement..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <FontAwesomeIcon icon={faFilter} className="filter-icon" />
          <select 
            value={filterLocation} 
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            <option value="all">Tous lieux</option>
            {locations.filter(l => l !== "all").map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="results-count">
        {filteredEvents.length} événement{filteredEvents.length > 1 ? "s" : ""} trouvé{filteredEvents.length > 1 ? "s" : ""}
      </div>

      {filteredEvents.length === 0 ? (
        <div className="no-results">
          <p>Aucun événement ne correspond à vos critères.</p>
        </div>
      ) : (
        <div className="card-list">
          {filteredEvents.map((event) => (
            <div className="card" key={event.id}>
              <h2>{event.title}</h2>
              <p className="description">{event.description}</p>

              <div className="info-grid">
                <p>
                  <FontAwesomeIcon icon={faCalendarAlt} className="card-icon" />
                  <strong>Début :</strong> <span suppressHydrationWarning>{new Date(event.startDate).toLocaleDateString()}</span>
                </p>
                <p>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="card-icon" />
                  <strong>Lieu :</strong> {event.location}
                </p>
              </div>

              <Link href={`/events/${event.id}`} className="btn-primary">
                Voir détails
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
