"use client";

import { useState, useEffect } from "react";
import QuestionItem from "./QuestionItem";

type Props = {
  questions?: any[];
  onUpvote?: (questionId: number) => void;
  onEdit?: (questionId: number, newContent: string) => void;
  onDelete?: (questionId: number) => void;
};

export default function QuestionList({
  questions = [],
  onUpvote,
  onEdit,
  onDelete,
}: Props) {
  const [localQuestions, setLocalQuestions] = useState<any[]>(questions);

  // Mettre à jour quand les props changent
  useEffect(() => {
    setLocalQuestions(questions);
  }, [questions]);

  async function handleUpvote(questionId: number) {
    try {
      const response = await fetch(`/api/questions/${questionId}/upvote`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
      }

      const updatedQuestion = await response.json();

      setLocalQuestions((previous) =>
        previous.map((question) =>
          question.id === questionId
            ? { ...question, upvotes: updatedQuestion.upvotes || question.upvotes + 1 }
            : question
        )
      );

      if (onUpvote) {
        onUpvote(questionId);
      }
    } catch (error) {
      console.error("Erreur upvote:", error);
    }
  }

  // Gestion de la modification (transmise à QuestionItem)
  const handleEdit = (questionId: number, newContent: string) => {
    setLocalQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, content: newContent } : q
      )
    );
    if (onEdit) onEdit(questionId, newContent);
  };

  // Gestion de la suppression (transmise à QuestionItem)
  const handleDelete = (questionId: number) => {
    setLocalQuestions((prev) => prev.filter((q) => q.id !== questionId));
    if (onDelete) onDelete(questionId);
  };

  if (!localQuestions || localQuestions.length === 0) {
    return (
      <p style={{ color: "#6b7280", fontStyle: "italic", padding: "0.5rem 0" }}>
        Aucune question pour le moment.
      </p>
    );
  }

  return (
    <div className="questions-list">
      {localQuestions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          onUpvote={handleUpvote}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}