// app/speakers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Speaker {
  id: number;
  full_name: string;
  photo_url: string | null;
  bio: string | null;
  external_links: string | null;
  session_count?: number;
  // Informations supplémentaires
  email?: string;
  company?: string;
  role?: string;
  twitter?: string;
  linkedin?: string;
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
      <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
        <h1>Intervenants</h1>
        <p>Chargement des intervenants...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
        <h1>Intervenants</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      {/* Header avec compteur */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Intervenants</h1>
        <span style={{ 
          padding: '0.5rem 1rem',
          background: '#e5e7eb',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          color: '#4b5563'
        }}>
          {speakers.length} intervenant{speakers.length > 1 ? 's' : ''}
        </span>
      </div>

      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        Découvrez tous les intervenants de nos événements
      </p>

      {speakers.length === 0 ? (
        <p>Aucun intervenant disponible pour le moment.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {speakers.map((speaker) => (
            <Link
              key={speaker.id}
              href={`/speakers/${speaker.id}`}
              style={{
                display: 'block',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              {/* Photo */}
              <div style={{ 
                width: '100%', 
                aspectRatio: '1/1', 
                backgroundColor: '#f3f4f6', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative'
              }}>
                {speaker.photo_url ? (
                  <img
                    src={speaker.photo_url}
                    alt={speaker.full_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <svg
                    style={{ width: '5rem', height: '5rem', color: '#9ca3af' }}
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
                )}

                {/* Badge du nombre de sessions */}
                {speaker.session_count !== undefined && speaker.session_count > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    borderRadius: '9999px',
                  }}>
                    {speaker.session_count} session{speaker.session_count > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Infos */}
              <div style={{ padding: '1rem' }}>
                {/* Nom */}
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  marginBottom: '0.25rem',
                  color: '#1a202c'
                }}>
                  {speaker.full_name}
                </h3>

                {/* Rôle / Company */}
                {speaker.role && (
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#2563eb', 
                    marginBottom: '0.25rem',
                    fontWeight: '500'
                  }}>
                    {speaker.role}
                    {speaker.company && ` • ${speaker.company}`}
                  </p>
                )}

                {/* Bio */}
                {speaker.bio && (
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    lineHeight: '1.5',
                    marginTop: '0.25rem'
                  }}>
                    {speaker.bio}
                  </p>
                )}

                {/* Liens sociaux */}
                <div style={{ 
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f3f4f6',
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  {speaker.linkedin && (
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      color: '#4b5563'
                    }}>
                      🔗 LinkedIn
                    </span>
                  )}
                  {speaker.twitter && (
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      color: '#4b5563'
                    }}>
                      🐦 Twitter
                    </span>
                  )}
                  {speaker.external_links && (
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      color: '#4b5563'
                    }}>
                      🌐 Site web
                    </span>
                  )}
                </div>

                {/* Lien "Voir le profil" */}
                <div style={{ 
                  marginTop: '0.75rem',
                  textAlign: 'right',
                  fontSize: '0.875rem',
                  color: '#2563eb',
                  fontWeight: '500'
                }}>
                  Cliquer pour voir le profil
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}