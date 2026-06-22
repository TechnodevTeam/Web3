// app/services/favoriteService.ts
"use client";

import { useState, useEffect, useCallback } from 'react';

export type Session = {
  id: string;
  title: string;
  date: string;
  description: string;
};

export type Favorite = {
  id: string;
  userId: string;
  sessionId: string;
  createdAt: string;
  session: Session;
};

// API calls vers le backend
const favoriteAPI = {
  async getFavorites(): Promise<Favorite[]> {
    const response = await fetch('/api/favorites');
    if (!response.ok) throw new Error('Erreur chargement');
    return response.json();
  },
  
  async addFavorite(sessionId: string, session: Session): Promise<Favorite> {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, session })
    });
    if (!response.ok) throw new Error('Erreur ajout');
    return response.json();
  },
  
  async removeFavorite(sessionId: string): Promise<void> {
    const response = await fetch(`/api/favorites?sessionId=${sessionId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erreur suppression');
  },

  async clearAllFavorites(): Promise<void> {
    const response = await fetch('/api/favorites/clear', {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erreur suppression totale');
  }
};

// Hook personnalisé
export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await favoriteAPI.getFavorites();
      setFavorites(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addFavorite = useCallback(async (sessionId: string, session: Session) => {
    try {
      const newFavorite = await favoriteAPI.addFavorite(sessionId, session);
      setFavorites(prev => [newFavorite, ...prev]);
      return true;
    } catch (err) {
      setError('Erreur lors de l\'ajout');
      return false;
    }
  }, []);

  const removeFavorite = useCallback(async (sessionId: string) => {
    try {
      await favoriteAPI.removeFavorite(sessionId);
      setFavorites(prev => prev.filter(f => f.sessionId !== sessionId));
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression');
      return false;
    }
  }, []);

  const clearAllFavorites = useCallback(async () => {
    try {
      await favoriteAPI.clearAllFavorites();
      setFavorites([]);
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression totale');
      return false;
    }
  }, []);

  const toggleFavorite = useCallback(async (sessionId: string, session: Session) => {
    const exists = favorites.some(f => f.sessionId === sessionId);
    if (exists) {
      await removeFavorite(sessionId);
    } else {
      await addFavorite(sessionId, session);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback((sessionId: string) => {
    return favorites.some(f => f.sessionId === sessionId);
  }, [favorites]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    clearAllFavorites,
    toggleFavorite,
    isFavorite,
    loadFavorites,
    getFavoritesCount: favorites.length
  };
}