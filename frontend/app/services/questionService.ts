// frontend/app/services/questionService.ts
const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

const API_URL = `${getBaseUrl()}/api`;

type CreateQuestionPayload = {
  content: string;
  authorName?: string;
};

export async function createQuestion(sessionId: number, payload: CreateQuestionPayload) {
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || "Erreur lors de la création de la question");
    }

    return response.json();
  } catch (error) {
    console.error("Erreur createQuestion:", error);
    throw error;
  }
}

export async function upvoteQuestion(questionId: number) {
  try {
    // ✅ Utiliser la bonne URL
    const response = await fetch(`${API_URL}/questions/${questionId}/upvote`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Upvote réussi:", data);
    
    // ✅ Retourner les données de la question mise à jour
    return data;
  } catch (error) {
    console.error("Erreur upvoteQuestion:", error);
    throw error;
  }
}