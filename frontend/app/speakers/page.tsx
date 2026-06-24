// app/speakers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Speaker {
  id: number;
  full_name: string;
  photo_url: string | null;
  bio: string | null;
  external_links: string | null;
  // Nombre de sessions (optionnel, si tu veux l'afficher)
  session_count?: number;
}

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/speakers');
      if (!response.ok) {
        throw new Error('Erreur chargement des intervenants');
      }
      const data = await response.json();
      setSpeakers(data);
    } catch (err) {
      setError('Impossible de charger la liste des intervenants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="text-gray-500">Chargement des intervenants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (speakers.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Intervenants</h1>
        <p className="text-gray-500">Aucun intervenant disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Intervenants</h1>
      <p className="text-gray-500 mb-6">
        Découvrez tous les intervenants de nos événements
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {speakers.map((speaker) => (
          <Link
            key={speaker.id}
            href={`/speakers/${speaker.id}`}
            className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
          >
            <div className="aspect-square bg-gray-100 relative">
              {speaker.photo_url ? (
                <img
                  src={speaker.photo_url}
                  alt={speaker.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    className="w-20 h-20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                {speaker.full_name}
              </h3>
              {speaker.bio && (
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {speaker.bio}
                </p>
              )}
              {speaker.session_count !== undefined && (
                <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {speaker.session_count} session{speaker.session_count > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}