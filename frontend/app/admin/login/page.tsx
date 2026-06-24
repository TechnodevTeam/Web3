'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './login.css';
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.user) {
        if (data.user.role === 'admin') {
          localStorage.setItem('user', JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: `${data.user.firstName} ${data.user.lastName}`,
            role: data.user.role
          }));
          router.push('/admin');
        } else {
          setError('Accès refusé : vous n\'avez pas les droits administrateur.');
        }
      } else {
        setError(data.error || 'Email ou mot de passe incorrect.');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="admin-login-title">Administration</h1>
          <p className="admin-login-subtitle">Accès réservé aux gestionnaires</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-login-input-group">
            <label className="admin-login-label">Email</label>
            <div className="admin-login-input-wrapper">
              <svg className="admin-login-icon-input" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 7L2 7" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                className="admin-login-input"
                required
              />
            </div>
          </div>
          <div className="admin-login-input-group">
            <label className="admin-login-label">Mot de passe</label>
            <div className="admin-login-input-wrapper">
              <svg className="admin-login-icon-input" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                className="admin-login-input"
                required
              />
            </div>
          </div>
          {error && (
            <div className="admin-login-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} className="admin-login-button">
            {loading ? (
              <>
                <svg className="admin-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a10 10 0 1 0 10 10" />
                </svg>
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
        <div className="admin-login-footer">
          <Link href="/">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
