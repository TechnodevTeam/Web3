// frontend/app/events/[id]/sessions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendarDays, faDoorOpen, faUser } from "@fortawesome/free-solid-svg-icons";
import BackButton from '@/app/components/BackButton';
import QuestionList from "@/app/components/QuestionList";
import QuestionForm from "@/app/components/QuestionForm";

interface Session {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  roomName: string;
  eventTitle: string;
  live: boolean;
  speakers: any[];
}

export default function EventSessionsPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Record<number, any[]>>({});

  useEffect(() => {
    if (!eventId) {
      setError("ID d'événement invalide");
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/sessions`);
        
        if (!response.ok) {
          throw new Error("Erreur chargement des sessions");
        }
        
        const data = await response.json();
        setSessions(Array.isArray(data) ? data : []);
        
        // Charger les questions pour les sessions live
        const questionsPromises = data.map(async (session: Session) => {
          if (session.live) {
            try {
              const qResponse = await fetch(`/api/sessions/${session.id}/questions`);
              if (qResponse.ok) {
                const qData = await qResponse.json();
                return { sessionId: session.id, questions: qData };
              }
            } catch (e) {
              console.error("Erreur chargement questions:", e);
            }
          }
          return { sessionId: session.id, questions: [] };
        });
        
        const questionsResults = await Promise.all(questionsPromises);
        const questionsMap: Record<number, any[]> = {};
        questionsResults.forEach(({ sessionId, questions }) => {
          questionsMap[sessionId] = questions;
        });
        setQuestions(questionsMap);
        
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger les sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [eventId]);

  // ✅ Fonction pour ajouter une question immédiatement
  const handleQuestionAdded = (sessionId: number, newQuestion: any) => {
    setQuestions((prev) => ({
      ...prev,
      [sessionId]: [newQuestion, ...(prev[sessionId] || [])]
    }));
  };

  const handleUpvote = (questionId: number) => {
    setQuestions((prev) => {
      const newQuestions = { ...prev };
      for (const sessionId in newQuestions) {
        if (newQuestions[sessionId].some(q => q.id === questionId)) {
          newQuestions[sessionId] = newQuestions[sessionId].map(q =>
            q.id === questionId ? { ...q, upvotes: (q.upvotes || 0) + 1 } : q
          );
          break;
        }
      }
      return newQuestions;
    });
  };

  if (loading) {
    return (
      <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <p>Chargement des sessions...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h1>Erreur</h1>
        <p>{error}</p>
        <BackButton fallbackUrl="/events" title="" />
      </main>
    );
  }

  if (sessions.length === 0) {
    return (
      <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h1>Événement</h1>
        <p>Aucune session disponible pour cet événement.</p>
        <BackButton fallbackUrl="/events" title="" />
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <BackButton fallbackUrl="/events" title="" />
      
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem", marginTop: "1rem" }}>
        Sessions de l'événement
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
        {sessions.length} session{sessions.length > 1 ? 's' : ''} disponible{sessions.length > 1 ? 's' : ''}
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {sessions.map((session) => (
          <div
            key={session.id}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              marginBottom: '0.75rem'
            }}>
              <Link 
                href={`/sessions/${session.id}`}
                style={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  flex: 1
                }}
              >
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  margin: 0,
                  color: '#1a202c'
                }}>
                  {session.title}
                </h2>
              </Link>
              {session.live && (
                <span style={{ 
                  background: '#ff4444', 
                  color: 'white', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  marginLeft: '0.5rem'
                }}>
                  🔴 LIVE
                </span>
              )}
            </div>

            <p style={{ color: '#4b5563', marginBottom: '0.75rem' }}>
              {session.description || "Aucune description"}
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.75rem'
            }}>
              <p style={{ margin: 0 }}>
                <FontAwesomeIcon icon={faClock} style={{ marginRight: '0.5rem' }} />
                {new Date(session.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p style={{ margin: 0 }}>
                <FontAwesomeIcon icon={faDoorOpen} style={{ marginRight: '0.5rem' }} />
                {session.roomName || "Salle non définie"}
              </p>
              <p style={{ margin: 0 }}>
                <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: '0.5rem' }} />
                {new Date(session.startTime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
              </p>
            </div>

            {session.speakers && session.speakers.length > 0 && (
              <div style={{ marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '0.5rem' }} />
                  {session.speakers.map(s => s.fullName).join(', ')}
                </p>
              </div>
            )}

            {
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6', color: '#3b82f6', fontSize: '0.875rem' }}>
                Appuyer sur le titre pour voir les détails de la session.
              </div>
            }

            {session.live && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Questions
                </h3>
                
                {/* ✅ QuestionForm avec onQuestionAdded */}
                <QuestionForm 
                  sessionId={session.id} 
                  onQuestionAdded={(newQuestion) => handleQuestionAdded(session.id, newQuestion)}
                />
                
                <QuestionList 
                  questions={questions[session.id] || []} 
                  onUpvote={handleUpvote}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}