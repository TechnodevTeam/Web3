"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faArrowLeft, faCalendarAlt, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "./favorites.css";

interface Event {
  id: string | number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
}

export default function FavoritesPage() {
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedIds = localStorage.getItem("favoriteEvents");
        if (!savedIds) {
          setLoading(false);
          return;
        }

        const ids = JSON.parse(savedIds);
        if (ids.length === 0) {
          setLoading(false);
          return;
        }

        const response = await fetch("/api/events");
        if (response.ok) {
          const allEvents: Event[] = await response.json();
          const filtered = allEvents.filter(event => ids.includes(event.id));
          setFavoriteEvents(filtered);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des favoris:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = (id: string | number) => {
    const newFavorites = favoriteEvents.filter(e => e.id !== id);
    setFavoriteEvents(newFavorites);
    const newIds = newFavorites.map(e => e.id);
    localStorage.setItem("favoriteEvents", JSON.stringify(newIds));
  };

  if (loading) {
    return (
      <section className="favorites-page">
        <div className="favorites-header">
          <h1>Mes Favoris</h1>
        </div>
        <div className="loading-container">Chargement de vos favoris...</div>
      </section>
    );
  }

  return (
    <section className="favorites-page">
      <div className="favorites-header">
        <Link href="/" className="back-link">
          <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
        </Link>
        <h1>Mes Favoris</h1>
      </div>

      {favoriteEvents.length === 0 ? (
        <div className="favorites-empty">
          <div className="empty-icon-container">
            <FontAwesomeIcon icon={faHeart} className="empty-heart-icon" />
          </div>
          <h2>Votre liste est vide</h2>
          <p>
            Vous n'avez pas encore ajouté d'événements à vos favoris. 
            Parcourez la liste des événements pour trouver ceux qui vous intéressent !
          </p>
          <Link href="/events" className="btn-primary">
            Découvrir les événements
          </Link>
        </div>
      ) : (
        <div className="card-list">
          {favoriteEvents.map((event) => (
            <div className="card" key={event.id}>
              <div className="card-header-flex">
                <h2>{event.title}</h2>
                <button 
                  className="favorite-toggle active"
                  onClick={() => removeFavorite(event.id)}
                  title="Retirer des favoris"
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
              </div>
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
    </section>
  );
}
