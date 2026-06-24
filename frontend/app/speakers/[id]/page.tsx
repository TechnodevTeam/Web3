// frontend/app/speakers/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUser,
  faMars,
  faVenus,
  faLink,
  faCalendarDays,
  faDoorOpen,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import BackButton from '@/app/components/BackButton';

interface Speaker {
  id: number;
  fullName: string;
  photoUrl: string | null;
  bio: string | null;
  externalLinks: string | null;
  sessions: {
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    roomName: string;
    eventTitle: string;
  }[];
}

async function getSpeakerById(id: string): Promise<Speaker> {
  const response = await fetch(`http://localhost:8080/api/speakers/${id}`);
  if (!response.ok) {
    throw new Error('Erreur chargement de l\'intervenant');
  }
  return response.json();
}

function getSpeakerGenderIcon(fullName: string) {
  if (!fullName) return faUser;
  const firstName = fullName.trim().split(" ")[0].toLowerCase();
  const femaleNames = new Set(["mialy", "sarah", "tiana", "lisa", "marie", "anja", "fanja", "mialy"]);
  if (femaleNames.has(firstName)) {
    return faVenus;
  }
  const maleNames = new Set(["jean", "hery", "toky", "rivo", "nicolas", "paul", "pierre"]);
  if (maleNames.has(firstName)) {
    return faMars;
  }
  // Si le prénom se termine par "a" ou "y", probablement féminin (règle approximative)
  if (firstName.endsWith("a") || firstName.endsWith("y")) {
    return faVenus;
  }
  return faUser;
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function SpeakerPage() {
  const params = useParams();
  const speakerId = params?.id as string;
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!speakerId) {
      setError("ID de l'intervenant invalide");
      setLoading(false);
      return;
    }

    const fetchSpeaker = async () => {
      try {
        const data = await getSpeakerById(speakerId);
        setSpeaker(data);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement de l'intervenant");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeaker();
  }, [speakerId]);

  if (loading) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
        <p>Chargement de l'intervenant...</p>
      </main>
    );
  }

  if (error || !speaker) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
        <h1>Erreur</h1>
        <p>{error || "Intervenant introuvable"}</p>
        <BackButton fallbackUrl="/speakers" title="" />
      </main>
    );
  }

  return (
    <section style={{ 
      padding: '2rem',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* ✅ BackButton avec fallback vers /speakers */}
      <BackButton fallbackUrl="/speakers" title="" />

      <div style={{
        display: 'flex',
        gap: '2rem',
        marginTop: '1.5rem',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        flexWrap: 'wrap'
      }}>
        {/* Photo */}
        <div style={{
          flexShrink: 0,
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {speaker.photoUrl ? (
            <img 
              src={speaker.photoUrl} 
              alt={speaker.fullName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <FontAwesomeIcon
              icon={getSpeakerGenderIcon(speaker.fullName)}
              style={{ fontSize: '4rem', color: '#9ca3af' }}
              title={speaker.fullName}
            />
          )}
        </div>

        {/* Infos */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: 0 }}>
            {speaker.fullName}
          </h1>

          <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '1rem' }}>
            {speaker.bio ? speaker.bio : "Aucune biographie disponible."}
          </p>

          {speaker.externalLinks && (
            <a
              href={speaker.externalLinks}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              <FontAwesomeIcon icon={faLink} />
              Voir le lien externe
            </a>
          )}
        </div>
      </div>

      {/* Sessions associées */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Sessions associées
        </h2>

        {speaker.sessions.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Aucune session associée à cet intervenant.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {speaker.sessions.map((session) => (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                style={{
                  display: 'block',
                  padding: '1rem',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'box-shadow 0.2s, transform 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {session.title}
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                  {session.description}
                </p>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#4b5563'
                }}>
                  <p style={{ margin: 0 }}>
                    <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: '0.5rem' }} />
                    <strong>Événement :</strong> {session.eventTitle}
                  </p>
                  <p style={{ margin: 0 }}>
                    <FontAwesomeIcon icon={faDoorOpen} style={{ marginRight: '0.5rem' }} />
                    <strong>Salle :</strong> {session.roomName}
                  </p>
                  <p style={{ margin: 0 }}>
                    <FontAwesomeIcon icon={faClock} style={{ marginRight: '0.5rem' }} />
                    <strong>Début :</strong> {formatDateTime(session.startTime)}
                  </p>
                  <p style={{ margin: 0 }}>
                    <FontAwesomeIcon icon={faClock} style={{ marginRight: '0.5rem' }} />
                    <strong>Fin :</strong> {formatDateTime(session.endTime)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}