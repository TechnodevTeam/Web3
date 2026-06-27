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
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const response = await fetch('/api/speakers');
      if (!response.ok) throw new Error('Erreur chargement des intervenants');
      const data = await response.json();
      setSpeakers(data);
    } catch (err) {
      setError('Impossible de charger la liste des intervenants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = speakers.filter((s) =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (s.bio && s.bio.toLowerCase().includes(search.toLowerCase())) ||
    (s.role && s.role.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="spk-page">
        <div className="spk-header">
          <h1>🎤 Intervenants</h1>
        </div>
        <div className="spk-loading">
          <div className="spk-spinner" />
          <p>Chargement des intervenants...</p>
        </div>
        <style>{speakersCSS}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="spk-page">
        <div className="spk-header"><h1>🎤 Intervenants</h1></div>
        <div className="spk-error">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <p>{error}</p>
          <button onClick={fetchSpeakers} className="spk-retry-btn">Réessayer</button>
        </div>
        <style>{speakersCSS}</style>
      </div>
    );
  }

  return (
    <div className="spk-page">
      {/* Header */}
      <div className="spk-header">
        <div>
          <h1>🎤 Intervenants</h1>
          <p className="spk-subtitle">Découvrez les experts qui animent nos événements</p>
        </div>
        <span className="spk-count-badge">
          {filtered.length} intervenant{filtered.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Barre de recherche */}
      <div className="spk-search-wrapper">
        <span className="spk-search-icon">🔍</span>
        <input
          type="text"
          placeholder="Rechercher un intervenant, un rôle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="spk-search-input"
        />
        {search && (
          <button onClick={() => setSearch('')} className="spk-search-clear">✕</button>
        )}
      </div>

      {/* Résultats vides après recherche */}
      {filtered.length === 0 ? (
        <div className="spk-empty">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h2>Aucun résultat</h2>
          <p>Aucun intervenant ne correspond à "<strong>{search}</strong>"</p>
          <button onClick={() => setSearch('')} className="spk-retry-btn">Effacer la recherche</button>
        </div>
      ) : (
        <div className="spk-grid">
          {filtered.map((speaker, index) => (
            <Link
              key={speaker.id}
              href={`/speakers/${speaker.id}`}
              className="spk-card"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              {/* Photo */}
              <div className="spk-photo-wrapper">
                {speaker.photo_url ? (
                  <img
                    src={speaker.photo_url}
                    alt={speaker.full_name}
                    className="spk-photo"
                  />
                ) : (
                  <div className="spk-photo-placeholder">
                    {speaker.full_name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Badge sessions */}
                {speaker.session_count !== undefined && speaker.session_count > 0 && (
                  <span className="spk-sessions-badge">
                    {speaker.session_count} session{speaker.session_count > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Infos */}
              <div className="spk-info">
                <h3 className="spk-name">{speaker.full_name}</h3>

                {speaker.role && (
                  <p className="spk-role">
                    {speaker.role}
                    {speaker.company && <span className="spk-company"> · {speaker.company}</span>}
                  </p>
                )}

                {speaker.bio && (
                  <p className="spk-bio">{speaker.bio}</p>
                )}

                {/* Liens sociaux */}
                {(speaker.linkedin || speaker.twitter || speaker.external_links) && (
                  <div className="spk-socials">
                    {speaker.linkedin && (
                      <span className="spk-social-tag spk-linkedin">🔗 LinkedIn</span>
                    )}
                    {speaker.twitter && (
                      <span className="spk-social-tag spk-twitter">🐦 Twitter</span>
                    )}
                    {speaker.external_links && (
                      <span className="spk-social-tag spk-web">🌐 Site web</span>
                    )}
                  </div>
                )}

                <div className="spk-card-footer">
                  <span className="spk-voir-profil">Voir le profil →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{speakersCSS}</style>
    </div>
  );
}

const speakersCSS = `
  .spk-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
  }
  .spk-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .spk-header h1 {
    font-size: 2.2rem;
    font-weight: 800;
    margin: 0 0 0.25rem 0;
    color: #111827;
  }
  .spk-subtitle {
    color: #6b7280;
    margin: 0;
    font-size: 1rem;
  }
  .spk-count-badge {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    border-radius: 9999px;
    padding: 0.35rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    white-space: nowrap;
    align-self: center;
  }

  /* Recherche */
  .spk-search-wrapper {
    position: relative;
    margin-bottom: 2rem;
  }
  .spk-search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1rem;
  }
  .spk-search-input {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 2.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.875rem;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    background: #f9fafb;
  }
  .spk-search-input:focus {
    border-color: #2563eb;
    background: white;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
  }
  .spk-search-clear {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: #e5e7eb;
    border: none;
    border-radius: 50%;
    width: 24px; height: 24px;
    font-size: 0.75rem;
    cursor: pointer;
    color: #4b5563;
    display: flex; align-items: center; justify-content: center;
  }
  .spk-search-clear:hover { background: #d1d5db; }

  /* Loading */
  .spk-loading {
    text-align: center;
    padding: 4rem;
    color: #6b7280;
  }
  .spk-spinner {
    width: 40px; height: 40px;
    border: 4px solid #e5e7eb;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spkSpin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }
  @keyframes spkSpin { to { transform: rotate(360deg); } }

  /* Error / Empty */
  .spk-error, .spk-empty {
    text-align: center;
    padding: 4rem 2rem;
    background: #f9fafb;
    border: 2px dashed #e5e7eb;
    border-radius: 1.5rem;
  }
  .spk-retry-btn {
    margin-top: 1.25rem;
    padding: 0.65rem 1.5rem;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 0.625rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .spk-retry-btn:hover { background: #1d4ed8; }

  /* Grid */
  .spk-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  /* Card */
  .spk-card {
    display: flex;
    flex-direction: column;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 1.25rem;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    animation: spkFadeIn 0.4s ease both;
  }
  .spk-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.13);
    border-color: #bfdbfe;
  }

  /* Photo */
  .spk-photo-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 4/3;
    background: linear-gradient(135deg, #eff6ff, #e0e7ff);
    overflow: hidden;
  }
  .spk-photo {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.35s ease;
  }
  .spk-card:hover .spk-photo {
    transform: scale(1.05);
  }
  .spk-photo-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: 4rem;
    font-weight: 800;
    color: #2563eb;
    background: linear-gradient(135deg, #dbeafe, #e0e7ff);
  }
  .spk-sessions-badge {
    position: absolute;
    top: 0.75rem; right: 0.75rem;
    background: #2563eb;
    color: white;
    border-radius: 9999px;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(37,99,235,0.4);
  }

  /* Info */
  .spk-info {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .spk-name {
    font-size: 1.15rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 0.35rem 0;
  }
  .spk-role {
    font-size: 0.875rem;
    color: #2563eb;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }
  .spk-company {
    color: #6b7280;
    font-weight: 400;
  }
  .spk-bio {
    font-size: 0.85rem;
    color: #6b7280;
    line-height: 1.6;
    margin: 0 0 0.75rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }

  /* Socials */
  .spk-socials {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 0.875rem;
    padding-top: 0.75rem;
    border-top: 1px solid #f3f4f6;
  }
  .spk-social-tag {
    padding: 0.2rem 0.6rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
  }
  .spk-linkedin { background: #dbeafe; color: #1d4ed8; }
  .spk-twitter  { background: #dbeafe; color: #0284c7; }
  .spk-web      { background: #d1fae5; color: #065f46; }

  /* Footer card */
  .spk-card-footer {
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 1px solid #f3f4f6;
  }
  .spk-voir-profil {
    font-size: 0.875rem;
    color: #2563eb;
    font-weight: 600;
    transition: letter-spacing 0.2s;
  }
  .spk-card:hover .spk-voir-profil {
    letter-spacing: 0.02em;
  }

  @keyframes spkFadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;