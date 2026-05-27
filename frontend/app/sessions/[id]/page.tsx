"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMars, faVenus } from "@fortawesome/free-solid-svg-icons";
import QuestionList from "@/app/components/QuestionList";
import QuestionForm from "@/app/components/QuestionForm";
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

// Heuristic to pick a gender icon from the speaker's first name.
// This is a best-effort approach: it checks the first given name
// against a small female name set and a simple vowel/ending heuristic.
const getSpeakerGenderIcon = (fullName: string) => {
  if (!fullName) return faUser;
  const first = fullName.split(" ")[0].toLowerCase();
  const femaleNames = new Set([
    "mialy",
    "marie",
    "maria",
    "ana",
    "anna",
    "sarah",
    "emma",
    "laura",
    "sophie",
    "julie",
  ]);

  if (femaleNames.has(first)) return faVenus;

  // Simple suffix rule: many female Malagasy and international names end with 'a' or 'y'
  if (first.endsWith("a") || first.endsWith("y")) return faVenus;

  // Default to male symbol
  return faMars;
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

  if (loading) {
    return (
      <main style={{ padding: "2rem" }}>
        <p>Chargement de la session...</p>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Erreur</h1>
        <p>{error || "Session introuvable"}</p>
        <Link href="/planning" style={{ textDecoration: "none", color: "#0070f3", marginBottom: "1rem", display: "inline-block" }}>
          ← Retour au planning
        </Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <Link href="/planning" style={{ textDecoration: "none", color: "#0070f3", marginBottom: "1rem", display: "inline-block" }}>
        ← Retour au planning
      </Link>

      <div style={{ background: "#f8f9fa", padding: "2rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
          <div>
            <h1 style={{ margin: "0 0 0.5rem 0" }}>{session.title}</h1>
            <p style={{ margin: "0.5rem 0", color: "#666" }}>
              📍 {session.roomName} | 📅 {session.eventTitle}
            </p>
          </div>
          {session.live && (
            <span style={{ 
              background: "#ff4444", 
              color: "white", 
              padding: "0.5rem 1rem", 
              borderRadius: "4px",
              fontSize: "0.9rem"
            }}>
              🔴 LIVE
            </span>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <p style={{ margin: "0.5rem 0", fontWeight: "bold" }}>🕒 Horaire</p>
          <p style={{ margin: "0.5rem 0" }}>
            {formatHour(session.startTime)} - {formatHour(session.endTime)} | {formatDate(session.startTime)}
          </p>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <p style={{ margin: "0.5rem 0", fontWeight: "bold" }}>📝 Description</p>
          <p style={{ margin: "0.5rem 0", lineHeight: "1.6" }}>{session.description}</p>
        </div>

        {session.speakers && session.speakers.length > 0 && (
          <div>
            <p style={{ margin: "0.5rem 0", fontWeight: "bold" }}>👥 Speakers</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
              {session.speakers.map((speaker) => (
                <div key={speaker.id} style={{ 
                  background: "white", 
                  padding: "1rem", 
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  textAlign: "center"
                }}>
                  <div style={{
                    width: "80px",
                    height: "80px",
                    background: "#eff6ff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem auto",
                    fontSize: "2.5rem",
                    color: "#2563eb"
                  }}>
                    <FontAwesomeIcon icon={getSpeakerGenderIcon(speaker.fullName)} title={speaker.fullName} />
                  </div>
                  <p style={{ margin: "0.5rem 0", fontWeight: "bold" }}>{speaker.fullName}</p>
                  {speaker.bio && (
                    <p style={{ margin: "0.5rem 0", fontSize: "0.9rem", color: "#666" }}>{speaker.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {session.live && (
        <div style={{ marginBottom: "2rem" }}>
          <h2>Questions</h2>
          <QuestionForm sessionId={Number(sessionId)} />
          <QuestionList initialQuestions={questions} />
        </div>
      )}
    </main>
  );
}
