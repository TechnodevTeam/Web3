"use client";

import { useState } from "react";
import { createQuestion } from "@/app/services/questionService";

type QuestionFormProps = {
  sessionId: number;
};

export default function QuestionForm({
  sessionId,
}: QuestionFormProps) {
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await createQuestion(sessionId, {
        content,
        authorName,
      });

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

  return (
    <form
      onSubmit={handleSubmit}
      className="question-form"
    >
      <h4>Poser une question</h4>

      <textarea
        placeholder="Votre question..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Votre nom (optionnel)"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Envoi..." : "Envoyer"}
      </button>

      {success && (
        <p className="success-message">{success}</p>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}
    </form>
  );
}