"use client";
import { useState } from "react";
import QuestionItem from "./QuestionItem";
type Props = {
  initialQuestions: any[];
};
export default function QuestionList({
  initialQuestions,
}: Props) {
  const [questions, setQuestions] =
    useState(initialQuestions);
  async function handleUpvote(
    questionId: number
  ) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}/upvote`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error(
          "Erreur upvote"
        );
      }
      setQuestions((previous) =>
        previous.map((question) =>
          question.id === questionId
            ? {
                ...question,
                upvotes:
                  question.upvotes + 1,
              }
            : question
        )
      );
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="questions-list">
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          onUpvote={handleUpvote}
        />
      ))}
    </div>
  );
}
