// app/favorites/page.tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useFavorites } from "../services/favoriteService";

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearAllFavorites, isLoading, loadFavorites } = useFavorites();

  useEffect(() => {
    loadFavorites();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Mes Favoris</h1>
        <p>Chargement...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h1>Mes Favoris</h1>
        <div style={{ padding: "3rem", background: "#f9fafb", borderRadius: "1rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>💔</div>
          <h2>Votre liste est vide</h2>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
            Vous n'avez pas encore ajouté de sessions à vos favoris.
          </p>
          <Link href="/sessions">
            <button style={{
              padding: "0.75rem 1.5rem",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer"
            }}>
              Découvrir les sessions
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ margin: 0 }}>❤️ Mes Favoris ({favorites.length})</h1>
        <button
          onClick={clearAllFavorites}
          style={{
            padding: "0.5rem 1rem",
            background: "#fee2e2",
            color: "#ef4444",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer"
          }}
        >
          🗑️ Tout supprimer
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {favorites.map((fav) => (
          <div
            key={fav.sessionId}
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              position: "relative"
            }}
          >
            <button
              onClick={() => removeFavorite(fav.sessionId)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "#ef4444"
              }}
              aria-label="Retirer des favoris"
            >
              ❌
            </button>

            {/* ✅ Correction : utiliser fav.title directement */}
            <h3 style={{ margin: "0 0 0.25rem 0", paddingRight: "2rem" }}>
              {fav.title}
            </h3>

            {fav.description && (
              <p style={{ margin: "0.5rem 0", color: "#6b7280" }}>
                {fav.description}
              </p>
            )}

            <div style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "0.5rem" }}>
              {fav.startTime && (
                <span style={{ marginRight: "1rem" }}>
                  📅 {new Date(fav.startTime).toLocaleDateString("fr-FR")}
                </span>
              )}
              {fav.startTime && (
                <span>
                  🕐 {new Date(fav.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
              {fav.roomName && (
                <span style={{ marginLeft: "1rem" }}>
                  📍 {fav.roomName}
                </span>
              )}
            </div>

            {fav.eventTitle && (
              <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#4b5563" }}>
                📅 Événement : {fav.eventTitle}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}