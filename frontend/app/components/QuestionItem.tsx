"use client";

import { useEffect, useState } from "react";

import { upvoteQuestion } from "@/app/services/questionService";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

type Answer = {
  id: number;
  content: string;
};

type QuestionItemProps = {
  question: {
    id: number;
    content: string;
    authorName: string | null;
    upvotes: number;
    answers?: Answer[];
  };
};

export default function QuestionItem({
  question,
}: QuestionItemProps) {
  const [upvotes, setUpvotes] = useState(
    question.upvotes
  );

  const [alreadyVoted, setAlreadyVoted] =
    useState(false);

  useEffect(() => {
    const votedQuestions = JSON.parse(
      localStorage.getItem("votedQuestions") || "[]"
    );

    if (votedQuestions.includes(question.id)) {
      setAlreadyVoted(true);
    }
  }, [question.id]);

  async function handleUpvote() {
    if (alreadyVoted) return;

    try {
      const updated =
        await upvoteQuestion(question.id);

      setUpvotes(updated.upvotes);

      const votedQuestions = JSON.parse(
        localStorage.getItem("votedQuestions") || "[]"
      );

      votedQuestions.push(question.id);

      localStorage.setItem(
        "votedQuestions",
        JSON.stringify(votedQuestions)
      );

      setAlreadyVoted(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <li className="fb-question-card">
      <div className="fb-question-main">
        <div className="fb-avatar">
          {(question.authorName || "A")[0]}
        </div>

        <div className="fb-question-bubble">
          <strong>
            {question.authorName || "Anonyme"}
          </strong>

          <p>{question.content}</p>
        </div>
      </div>

      <div className="fb-question-actions">
        <button
          onClick={handleUpvote}
          disabled={alreadyVoted}
          className={`fb-like-btn ${
            alreadyVoted ? "liked" : ""
          }`}
        >
          <FontAwesomeIcon icon={faThumbsUp} />

          {upvotes}
        </button>
      </div>

      {question.answers &&
        question.answers.length > 0 && (
          <div className="fb-answers">
            {question.answers.map((answer) => (
              <div
                key={answer.id}
                className="fb-answer"
              >
                <div className="fb-avatar admin">
                  A
                </div>

                <div className="fb-answer-bubble">
                  <strong>Admin EventSync</strong>

                  <p>{answer.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
    </li>
  );
}