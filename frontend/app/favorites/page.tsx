"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function FavoritesPage() {
  return (
    <section className="favorites-page">
      <div className="favorites-header">
        <Link href="/" className="back-link">
          <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
          Retour à l'accueil
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

      <style jsx>{`
        .favorites-page {
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .favorites-header {
          margin-bottom: 40px;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4b5563;
          margin-bottom: 20px;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #2563eb;
        }

        .favorites-header h1 {
          font-size: 32px;
          color: #111827;
        }

        .favorites-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 20px;
          background-color: white;
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .empty-icon-container {
          width: 80px;
          height: 80px;
          background-color: #fef2f2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .empty-heart-icon {
          font-size: 32px;
          color: #ef4444;
        }

        .favorites-empty h2 {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 12px;
        }

        .favorites-empty p {
          color: #6b7280;
          max-width: 400px;
          margin-bottom: 32px;
          line-height: 1.6;
        }
      `}</style>
    </section>
  );
}
