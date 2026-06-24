"use client";

import { useState, useEffect } from "react";
import { createQuestion } from "@/app/services/questionService";

type QuestionFormProps = {
  sessionId: number;
  onQuestionAdded?: (question: any) => void;
};

export default function QuestionForm({
  sessionId,
  onQuestionAdded,
}: QuestionFormProps) {
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [hasAlreadyAsked, setHasAlreadyAsked] = useState(false);

  // Vérifier si l'utilisateur a déjà posé une question pour cette session
  useEffect(() => {
    const key = `asked-${sessionId}`;
    const asked = localStorage.getItem(key);
    if (asked === "true") {
      setHasAlreadyAsked(true);
    }
  }, [sessionId]);

  // ✅ Réinitialiser le statut (pour les tests)
  const resetQuestionStatus = () => {
    const key = `asked-${sessionId}`;
    localStorage.removeItem(key);
    setHasAlreadyAsked(false);
    setSuccess("");
    setError("");
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (hasAlreadyAsked) {
      setError("Vous avez déjà posé une question pour cette session.");
      return;
    }

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const newQuestion = await createQuestion(sessionId, {
        content,
        authorName: authorName || undefined,
      });

      const key = `asked-${sessionId}`;
      localStorage.setItem(key, "true");
      setHasAlreadyAsked(true);

      if (onQuestionAdded) {
        onQuestionAdded(newQuestion);
      }

      setSuccess("Question envoyée avec succès");
      setContent("");
      setAuthorName("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (hasAlreadyAsked) {
    return (
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#fef3c7",
          border: "1px solid #f59e0b",
          borderRadius: "8px",
          color: "#92400e",
          marginBottom: "1rem",
        }}
      >
        <p style={{ margin: 0, fontWeight: "500" }}>
          ✅ Vous avez déjà posé une question pour cette session.
        </p>
        <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>
          Vous pouvez voter pour les autres questions ci-dessous.
        </p>
        <button
          onClick={resetQuestionStatus}
          style={{
            marginTop: "0.5rem",
            padding: "0.25rem 0.75rem",
            backgroundColor: "#92400e",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.75rem",
            cursor: "pointer",
          }}
        >
          Réinitialiser (test)
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="question-form">
      <h4 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Poser une question</h4>

      <div style={{ marginBottom: "0.75rem" }}>
        <textarea
          placeholder="Votre question..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "1rem",
            minHeight: "80px",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <input
          type="text"
          placeholder="Votre nom (optionnel)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "1rem",
            fontFamily: "inherit",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          fontFamily: "inherit",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.backgroundColor = "#1d4ed8";
        }}
        onMouseLeave={(e) => {
          if (!loading) e.currentTarget.style.backgroundColor = "#2563eb";
        }}
      >
        {loading ? "Envoi..." : "Envoyer"}
      </button>

      {success && (
        <p style={{ color: "#16a34a", marginTop: "0.75rem", fontSize: "0.9rem" }}>
          ✅ {success}
        </p>
      )}
      {error && (
        <p style={{ color: "#dc2626", marginTop: "0.75rem", fontSize: "0.9rem" }}>
          ❌ {error}
        </p>
      )}
    </form>
  );
}