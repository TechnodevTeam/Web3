const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type CreateQuestionPayload = {
  content: string;
  authorName?: string;
};

export async function createQuestion(
  sessionId: number,
  payload: CreateQuestionPayload
) {
  const response = await fetch(
    `${API_URL}/sessions/${sessionId}/questions`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message);
  }

  return response.json();
}

export async function upvoteQuestion(questionId: number) {
  const response = await fetch(
    `${API_URL}/questions/${questionId}/upvote`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de l'upvote");
  }

  return response.json();
}