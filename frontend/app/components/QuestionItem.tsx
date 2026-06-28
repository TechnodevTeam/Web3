"use client";

import { useEffect, useState } from "react";
import { faArrowUp, faPen, faTrash, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { upvoteQuestion } from "../services/questionService";

type Props = {
  question: any;
  onUpvote?: (questionId: number) => void;
  onEdit?: (questionId: number, newContent: string) => void;
  onDelete?: (questionId: number) => void;
};

export default function QuestionItem({
  question,
  onUpvote,
  onEdit,
  onDelete,
}: Props) {
  const [upvotes, setUpvotes] = useState(question?.upvotes || 0);
  const [loading, setLoading] = useState(false);
  const [alreadyUpvoted, setAlreadyUpvoted] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(question?.content || "");
  const [isSaving, setIsSaving] = useState(false);

  const hasAnswers = question?.answers && question.answers.length > 0;

  useEffect(() => {
    if (question?.id) {
      const alreadyVoted = document.cookie.includes(`upvoted-${question.id}=true`)
      if (alreadyVoted) setAlreadyUpvoted(true)
    }
  }, [question?.id])

  async function handleUpvote() {
    if (alreadyUpvoted || loading || !question?.id) return;
    try {
      setLoading(true);
      const updated = await upvoteQuestion(question.id);

      // ← utilise la valeur réelle retournée par l'API
      setUpvotes(updated.upvotes);

      // Cookie au lieu de localStorage
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()
      document.cookie = `upvoted-${question.id}=true; expires=${expires}; path=/`

      setAlreadyUpvoted(true);
      if (onUpvote) onUpvote(question.id);
    } catch (error) {
      console.error("Erreur upvote:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveEdit() {
    if (!editContent.trim() || !question?.id) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/questions/${question.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent.trim() }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erreur lors de la modification");
      }
      const updated = await response.json();
      if (onEdit) onEdit(question.id, updated.content);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Erreur modification:", error);
      alert(error.message || "Impossible de modifier la question");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Voulez-vous vraiment supprimer cette question ?")) return;
    try {
      const response = await fetch(`/api/questions/${question.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erreur lors de la suppression");
      }
      if (onDelete) onDelete(question.id);
    } catch (error: any) {
      console.error("Erreur suppression:", error);
      alert(error.message || "Impossible de supprimer la question");
    }
  }

  function formatDate(value: string) {
    if (!value) return "";
    return new Date(value).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  if (!question) return null;

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        padding: "1rem",
        marginBottom: "1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)")}
    >
      <div style={{ marginBottom: "0.75rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
            flexWrap: "wrap",
            gap: "0.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <strong style={{ fontSize: "0.9rem", color: "#1a202c" }}>
              {question.authorName || "Anonyme"}
            </strong>
            <span style={{ color: "#9ca3af" }}>•</span>
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              {formatDate(question.createdAt)}
            </span>
            {hasAnswers && (
              <span
                style={{
                  fontSize: "0.7rem",
                  backgroundColor: "#dbeafe",
                  color: "#2563eb",
                  padding: "0.1rem 0.5rem",
                  borderRadius: "9999px",
                  fontWeight: "500",
                }}
              >
                Répondu
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.25rem" }}>
            {!hasAnswers && !isEditing && (
              <button
                onClick={() => {
                  setEditContent(question.content);
                  setIsEditing(true);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.color = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#6b7280";
                }}
                title="Modifier la question"
              >
                <FontAwesomeIcon icon={faPen} style={{ fontSize: "0.75rem" }} />
              </button>
            )}
            {!isEditing && (
              <button
                onClick={handleDelete}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#fee2e2";
                  e.currentTarget.style.color = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#6b7280";
                }}
                title="Supprimer la question"
              >
                <FontAwesomeIcon icon={faTrash} style={{ fontSize: "0.75rem" }} />
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #2563eb",
                borderRadius: "8px",
                fontSize: "1rem",
                minHeight: "80px",
                fontFamily: "inherit",
                resize: "vertical",
                backgroundColor: "#f8fafc",
              }}
              autoFocus
            />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving || !editContent.trim()}
                style={{
                  padding: "0.4rem 1rem",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  cursor: isSaving || !editContent.trim() ? "not-allowed" : "pointer",
                  opacity: isSaving || !editContent.trim() ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FontAwesomeIcon icon={faCheck} />
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button
                onClick={() => {
                  setEditContent(question.content);
                  setIsEditing(false);
                }}
                style={{
                  padding: "0.4rem 1rem",
                  backgroundColor: "#f3f4f6",
                  color: "#4b5563",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
              >
                <FontAwesomeIcon icon={faTimes} />
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: "1rem", color: "#1a202c", lineHeight: "1.5" }}>
            {question.content}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          borderTop: "1px solid #f3f4f6",
          paddingTop: "0.75rem",
        }}
      >
        <button
          onClick={handleUpvote}
          disabled={loading || alreadyUpvoted}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.4rem 1rem",
            backgroundColor: alreadyUpvoted ? "#dbeafe" : "#f3f4f6",
            color: alreadyUpvoted ? "#2563eb" : "#4b5563",
            border: "none",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: "500",
            cursor: alreadyUpvoted || loading ? "default" : "pointer",
            transition: "all 0.2s ease",
            opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!alreadyUpvoted && !loading) {
              e.currentTarget.style.backgroundColor = "#e5e7eb";
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (!alreadyUpvoted && !loading) {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
        >
          <FontAwesomeIcon
            icon={faArrowUp}
            style={{
              fontSize: "0.875rem",
              color: alreadyUpvoted ? "#2563eb" : "#6b7280",
              transition: "color 0.2s",
            }}
          />
          <span>
            {loading ? "Envoi..." : alreadyUpvoted ? "👍 Déjà voté" : "Upvote"}
          </span>
          <span
            style={{
              backgroundColor: alreadyUpvoted ? "#bfdbfe" : "#e5e7eb",
              padding: "0.1rem 0.5rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: "bold",
              color: alreadyUpvoted ? "#1d4ed8" : "#4b5563",
            }}
          >
            {upvotes}
          </span>
        </button>

        {question.answers && question.answers.length > 0 && (
          <span
            style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              marginLeft: "auto",
            }}
          >
            💬 {question.answers.length} réponse{question.answers.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {question.answers && question.answers.length > 0 && (
        <div style={{
          marginTop: '0.75rem',
          borderTop: '1px solid #f3f4f6',
          paddingTop: '0.75rem',
        }}>
          <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#2563eb', margin: '0 0 0.5rem' }}>
            Réponses de l'organisateur :
          </p>
          {question.answers.map((answer: any) => (
            <div key={answer.id} style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              color: '#1e40af',
            }}>
              <p style={{ margin: '0 0 0.25rem' }}>{answer.content}</p>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {answer.createdAt ? new Date(answer.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}