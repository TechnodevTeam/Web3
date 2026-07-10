"use client";

import Link from "next/link";
import { useState } from "react";
import { useFavorites } from "../services/favoriteService";

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearAllFavorites, isLoading } = useFavorites();
  const [removing, setRemoving] = useState<number | null>(null);

  const handleRemove = (sessionId: number) => {
    setRemoving(sessionId);
    setTimeout(() => {
      removeFavorite(sessionId);
      setRemoving(null);
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="fav-page">
        <div className="fav-header">
          <h1>❤️ Mes Favoris</h1>
        </div>
        <div className="fav-loading">
          <div className="fav-spinner" />
          <p>Chargement de vos favoris...</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="fav-page">
        <div className="fav-header">
          <h1>❤️ Mes Favoris</h1>
          <p className="fav-subtitle">Retrouvez ici toutes vos sessions sauvegardées</p>
        </div>
        <div className="fav-empty">
          <div className="fav-empty-icon">💔</div>
          <h2>Votre liste est vide</h2>
          <p>Vous n'avez pas encore ajouté de sessions à vos favoris.<br />Parcourez les sessions et cliquez sur ❤️ pour en sauvegarder.</p>
          <Link href="/sessions" className="fav-btn-primary">
            Découvrir les sessions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fav-page">
      {/* Header */}
      <div className="fav-header">
        <div>
          <h1>❤️ Mes Favoris</h1>
          <p className="fav-subtitle">Retrouvez ici toutes vos sessions sauvegardées</p>
        </div>
        <div className="fav-header-right">
          <span className="fav-count-badge">{favorites.length} session{favorites.length > 1 ? "s" : ""}</span>
          <button onClick={clearAllFavorites} className="fav-btn-danger">
            🗑️ Tout supprimer
          </button>
        </div>
      </div>

      {/* Grille de cartes */}
      <div className="fav-grid">
        {favorites.map((fav) => (
          <div
            key={fav.sessionId}
            className={`fav-card ${removing === fav.sessionId ? "fav-card-removing" : ""}`}
          >
            {/* Barre colorée en haut */}
            <div className="fav-card-top-bar" />

            {/* Bouton supprimer */}
            <button
              onClick={() => handleRemove(fav.sessionId)}
              className="fav-remove-btn"
              aria-label="Retirer des favoris"
              title="Retirer des favoris"
            >
              ✕
            </button>

            {/* Badge live */}
            {fav.live && (
              <span className="fav-live-badge">🔴 En direct</span>
            )}

            {/* Titre */}
            <h3 className="fav-card-title">{fav.title}</h3>

            {/* Description */}
            {fav.description && (
              <p className="fav-card-desc">{fav.description}</p>
            )}

            {/* Infos */}
            <div className="fav-card-meta">
              {fav.startTime && (
                <span className="fav-meta-item">
                  📅 {new Date(fav.startTime).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                </span>
              )}
              {fav.startTime && (
                <span className="fav-meta-item">
                  🕐 {new Date(fav.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  {fav.endTime && ` → ${new Date(fav.endTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`}
                </span>
              )}
              {fav.roomName && (
                <span className="fav-meta-item">📍 {fav.roomName}</span>
              )}
              {fav.eventTitle && (
                <span className="fav-meta-item">🎪 {fav.eventTitle}</span>
              )}
              {fav.speakers && fav.speakers.length > 0 && (
                <span className="fav-meta-item">
                  🎤 {fav.speakers.map((s: any) => s.full_name || s.fullName).join(", ")}
                </span>
              )}
            </div>

            {/* Lien vers la session */}
            <Link href={`/sessions/${fav.sessionId}`} className="fav-card-link">
              Voir la session →
            </Link>
          </div>
        ))}
      </div>

      <style>{`
        .fav-page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem;
        }
        .fav-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .fav-header h1 {
          font-size: 2.2rem;
          font-weight: 800;
          margin: 0 0 0.25rem 0;
          color: #111827;
        }
        .fav-subtitle {
          color: #6b7280;
          margin: 0;
          font-size: 1rem;
        }
        .fav-header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .fav-count-badge {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
          border-radius: 9999px;
          padding: 0.35rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
        }
        .fav-btn-primary {
          display: inline-block;
          padding: 0.75rem 1.75rem;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(37,99,235,0.35);
        }
        .fav-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37,99,235,0.45);
        }
        .fav-btn-danger {
          padding: 0.5rem 1rem;
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fca5a5;
          border-radius: 0.625rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .fav-btn-danger:hover { background: #fecaca; }

        .fav-loading {
          text-align: center;
          padding: 4rem;
          color: #6b7280;
        }
        .fav-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .fav-empty {
          text-align: center;
          padding: 4rem 2rem;
          background: #f9fafb;
          border: 2px dashed #e5e7eb;
          border-radius: 1.5rem;
          animation: fadeIn 0.4s ease;
        }
        .fav-empty-icon { font-size: 4rem; margin-bottom: 1rem; }
        .fav-empty h2 { font-size: 1.5rem; color: #111827; margin-bottom: 0.75rem; }
        .fav-empty p { color: #6b7280; margin-bottom: 1.75rem; line-height: 1.7; }

        .fav-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .fav-card {
          position: relative;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 1.25rem;
          padding: 1.5rem;
          padding-top: 1.75rem;
          transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.3s ease;
          overflow: hidden;
          animation: fadeIn 0.4s ease;
        }
        .fav-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.12);
          border-color: #c7d2fe;
        }
        .fav-card-removing {
          opacity: 0;
          transform: scale(0.95);
        }
        .fav-card-top-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 5px;
          background: linear-gradient(90deg, #6366f1, #2563eb);
        }
        .fav-remove-btn {
          position: absolute;
          top: 1rem; right: 1rem;
          width: 28px; height: 28px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 50%;
          font-size: 0.75rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, transform 0.2s;
        }
        .fav-remove-btn:hover { background: #fca5a5; transform: scale(1.15); }
        .fav-live-badge {
          display: inline-block;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fca5a5;
          border-radius: 9999px;
          padding: 0.2rem 0.7rem;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        .fav-card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #111827;
          margin: 0 2rem 0.75rem 0;
          line-height: 1.4;
        }
        .fav-card-desc {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .fav-card-meta {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1.25rem;
          padding: 0.875rem;
          background: #f9fafb;
          border-radius: 0.75rem;
        }
        .fav-meta-item {
          font-size: 0.8rem;
          color: #4b5563;
        }
        .fav-card-link {
          display: inline-block;
          color: #2563eb;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border: 1.5px solid #bfdbfe;
          border-radius: 0.5rem;
          transition: background 0.2s, color 0.2s;
        }
        .fav-card-link:hover {
          background: #eff6ff;
          color: #1d4ed8;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
