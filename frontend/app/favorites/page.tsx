"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import "./favorites.css";

export default function FavoritesPage() {
  return (
    <section className="favorites-page">
      <div className="favorites-header">
        <Link href="/" className="back-link">
          <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
        </Link>
        <h1>Mes Favoris</h1>
      </div>

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
    </section>
  );
}
