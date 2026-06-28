// frontend/app/sessions/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMars, faVenus, faClock } from "@fortawesome/free-solid-svg-icons";
import QuestionForm from "@/app/components/QuestionForm";
import QuestionItem from "@/app/components/QuestionItem";
import BackButton from '@/app/components/BackButton';
import "@/app/styles/index.module.css";

interface Speaker {
  id: number;
  fullName: string;
  bio?: string;
  imageUrl?: string;
}

interface Session {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  roomName: string;
  eventTitle: string;
  live: boolean;
  speakers: Speaker[];
}

const formatHour = (value: string | null | undefined): string => {
  if (!value) return "--:--";
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return "--:--";
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "--:--";
  }
};

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};



export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params?.id as string;
  const [session, setSession] = useState<Session | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("ID de session invalide");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        // Récupérer la session
        const response = await fetch(`/api/sessions/${sessionId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.id) {
          throw new Error("Session non trouvée");
        }

        setSession(data);
        setError(null);

        // Récupérer les questions
        const questionsResponse = await fetch(`/api/sessions/${sessionId}/questions`);
        if (questionsResponse.ok) {
          const questionsData = await questionsResponse.json();
          setQuestions(Array.isArray(questionsData) ? questionsData : []);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);



  const handleQuestionAdded = (newQuestion: any) => {
    setQuestions((prev) => [newQuestion, ...prev]);
  };

  const handleEditQuestion = (questionId: number, newContent: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, content: newContent } : q
      )
    );
  };

  const handleDeleteQuestion = (questionId: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  if (loading) {
    return (
      <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <p>Chargement de la session...</p>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h1>Erreur</h1>
        <p>{error || "Session introuvable"}</p>
        <BackButton fallbackUrl="/planning" title="← Retour au planning" />
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
      {/* ✅ BackButton avec fallback vers /planning */}
      <BackButton fallbackUrl="/planning" title="" />

      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem", marginTop: "1rem" }}>
        {session.title}
      </h1>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: "1rem",
        padding: "1rem",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        border: "1px solid #e5e7eb"
      }}>
        <div>
          <p style={{ margin: "0.25rem 0", fontWeight: "500" }}>
            {session.roomName} | {session.eventTitle}
          </p>
          <p style={{ margin: "0.25rem 0", color: "#6b7280" }}>
            <FontAwesomeIcon icon={faClock} />
            {formatHour(session.startTime)} - {formatHour(session.endTime)} | {formatDate(session.startTime)}
          </p>
        </div>
        {session.live && (
          <span style={{
            background: "#ff4444",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            fontSize: "0.9rem",
            fontWeight: "bold"
          }}>
            🔴 LIVE
          </span>
        )}
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>Description</h2>
        <p style={{ color: "#4b5563", lineHeight: "1.6" }}>{session.description || "Aucune description disponible."}</p>
      </div>

      {/* Intervenants */}
      {session.speakers && session.speakers.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.75rem" }}>Intervenants</h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {session.speakers.map((speaker) => (
              <Link
                key={speaker.id}
                href={`/speakers/${speaker.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e5e7eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                }}
              >
                <span style={{ fontWeight: "500" }}>{speaker.fullName}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Section Questions */}
      <div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.75rem" }}>Questions</h2>

        {session.live ? (
          <>
            {/* ✅ QuestionForm existant */}
            <QuestionForm sessionId={session.id} />

            {/* ✅ Liste des questions avec QuestionItem existant */}
            {questions.length === 0 ? (
              <p style={{ color: "#6b7280", fontStyle: "italic" }}>
                Aucune question pour le moment. Soyez le premier à poser une question !
              </p>
            ) : (
              <div style={{ marginTop: "1rem" }}>
                {questions.map((question) => (
                  <QuestionItem
                    key={question.id}
                    question={question}
                    onEdit={handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <p style={{ color: "#6b7280", fontStyle: "italic" }}>
            Les questions ne sont disponibles que lorsque la session est en direct (live).
          </p>
        )}
      </div>
    </main>
  );
}