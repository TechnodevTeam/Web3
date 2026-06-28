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

  useEffect(() => {
    setLocalQuestions(questions);
  }, [questions]);

  function handleUpvote(questionId: number) {
    setLocalQuestions((prev) =>
      [...prev].sort((a: any, b: any) => (b.upvotes || 0) - (a.upvotes || 0))
    );
    if (onUpvote) onUpvote(questionId);
  }

  const handleEdit = (questionId: number, newContent: string) => {
    setLocalQuestions((prev) =>
      prev.map((q) => q.id === questionId ? { ...q, content: newContent } : q)
    );
    if (onEdit) onEdit(questionId, newContent);
  };

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