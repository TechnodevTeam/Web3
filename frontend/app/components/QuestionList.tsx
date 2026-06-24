// frontend/app/components/QuestionList.tsx
"use client";

import { useState, useEffect } from "react";
import QuestionItem from "./QuestionItem";

type Props = {
  questions?: any[]; // ✅ Rendre optionnel
  onUpvote?: (questionId: number) => void;
};

export default function QuestionList({ questions = [], onUpvote }: Props) {
  const [localQuestions, setLocalQuestions] = useState<any[]>(questions || []);

  // ✅ Mettre à jour quand les props changent
  useEffect(() => {
    setLocalQuestions(questions || []);
  }, [questions]);

  async function handleUpvote(questionId: number) {
    try {
      const response = await fetch(`/api/questions/${questionId}/upvote`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
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

  // ✅ Vérification de sécurité
  if (!localQuestions || localQuestions.length === 0) {
    return (
      <p style={{ color: '#6b7280', fontStyle: 'italic', padding: '0.5rem 0' }}>
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
        />
      ))}
    </div>
  );
}