// frontend/app/components/QuestionItem.tsx
"use client";

import { useEffect, useState } from "react";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { upvoteQuestion } from "../services/questionService";

type Props = {
  question: any;
  onUpvote?: (questionId: number) => void;
};

export default function QuestionItem({ question, onUpvote }: Props) {
  const [upvotes, setUpvotes] = useState(question?.upvotes || 0);
  const [loading, setLoading] = useState(false);
  const [alreadyUpvoted, setAlreadyUpvoted] = useState(false);

  useEffect(() => {
    if (question?.id) {
      const saved = localStorage.getItem(`upvoted-${question.id}`);
      if (saved) {
        setAlreadyUpvoted(true);
      }
    }
  }, [question?.id]);

  async function handleUpvote() {
    if (alreadyUpvoted || loading || !question?.id) {
      return;
    }

    try {
      setLoading(true);
      const updatedQuestion = await upvoteQuestion(question.id);
      
      setUpvotes(updatedQuestion.upvotes || updatedQuestion.upvotes_count || upvotes + 1);
      
      localStorage.setItem(`upvoted-${question.id}`, "true");
      setAlreadyUpvoted(true);
      
      if (onUpvote) {
        onUpvote(question.id);
      }
    } catch (error) {
      console.error("Erreur upvote:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(value: string) {
    if (!value) return "";
    return new Date(value).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  // ✅ Vérification de sécurité
  if (!question) {
    return null;
  }

  return (
    <div className="question-facebook-card">
      <div className="question-main">
        <div className="question-bubble">
          <div className="question-meta">
            <strong>{question.authorName || "Anonyme"}</strong>
            <span>•</span>
            <span>{formatDate(question.createdAt)}</span>
          </div>
          <p>{question.content}</p>
        </div>
      </div>

      <div className="question-actions">
        <button
          className={`upvote-button ${alreadyUpvoted ? "upvoted" : ""}`}
          onClick={handleUpvote}
          disabled={loading || alreadyUpvoted}
        >
          <FontAwesomeIcon icon={faArrowUp} />
          <span>
            {alreadyUpvoted ? "Déjà voté" : "Upvote"} • {upvotes}
          </span>
        </button>
      </div>

      {question.answers && question.answers.length > 0 && (
        <div className="answers-list">
          {question.answers.map((answer: any) => (
            <div className="answer-card" key={answer.id}>
              <div className="answer-header">
                <strong>Admin</strong>
                <span>{formatDate(answer.createdAt)}</span>
              </div>
              <p>{answer.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}