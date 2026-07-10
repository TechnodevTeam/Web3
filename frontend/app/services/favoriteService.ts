"use client";

import { useState, useEffect, useCallback } from "react";

interface Favorite {
  sessionId: number;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  roomName?: string;
  eventTitle?: string;
  roomId?: number;
  eventId?: number;
  speakers?: any[];
  live?: boolean;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(() => {
    try {
      const stored = localStorage.getItem("favorites");
      if (stored) {
        const parsed = JSON.parse(stored);
        const unique = parsed.filter(
          (fav: Favorite, index: number, self: Favorite[]) =>
            index === self.findIndex((f) => f.sessionId === fav.sessionId)
        );
        setFavorites(unique);
        if (unique.length !== parsed.length) {
          localStorage.setItem("favorites", JSON.stringify(unique));
        }
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("❌ Erreur chargement favoris:", error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveFavorites = useCallback((newFavorites: Favorite[]) => {
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  }, []);

  const addFavorite = useCallback((session: any) => {
    if (!session || !session.id) {
      console.error("❌ Session invalide pour l'ajout aux favoris");
      return;
    }

    if (favorites.some((f) => f.sessionId === session.id)) {
      console.log("ℹ️ Session déjà dans les favoris:", session.id);
      return;
    }

    const newFavorite: Favorite = {
      sessionId: session.id,
      title: session.title || "Sans titre",
      description: session.description,
      startTime: session.startTime,
      endTime: session.endTime,
      roomName: session.roomName,
      eventTitle: session.eventTitle,
      roomId: session.roomId,
      eventId: session.eventId,
      speakers: session.speakers,
      live: session.live,
    };

    const updated = [...favorites, newFavorite];
    saveFavorites(updated);
    console.log("✅ Favori ajouté:", session.id, newFavorite.title);
  }, [favorites, saveFavorites]);

  const removeFavorite = useCallback((sessionId: number) => {
    const updated = favorites.filter((f) => f.sessionId !== sessionId);
    if (updated.length === favorites.length) {
      console.warn("⚠️ Favori non trouvé:", sessionId);
      return;
    }
    saveFavorites(updated);
    console.log("🗑️ Favori retiré:", sessionId);
  }, [favorites, saveFavorites]);

  const toggleFavorite = useCallback((sessionId: number | string, session: any) => {
    const id = typeof sessionId === "string" ? parseInt(sessionId, 10) : sessionId;
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(session);
    }
  }, [addFavorite, removeFavorite]);

  const isFavorite = useCallback((sessionId: number | string) => {
    const id = typeof sessionId === "string" ? parseInt(sessionId, 10) : sessionId;
    return favorites.some((f) => f.sessionId === id);
  }, [favorites]);

  const clearAllFavorites = useCallback(() => {
    saveFavorites([]);
    console.log("🗑️ Tous les favoris supprimés");
  }, [saveFavorites]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    isLoading,
    loadFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
  };
}
