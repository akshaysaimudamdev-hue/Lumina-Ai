import api from "./api";


// =====================================================
// ASK QUESTION
// =====================================================

export const askQuestion = async (
  question: string,
  documentId?: string | null,
  userName?: string | null,
  userId?: string | null
) => {

  console.log(
    "========== RAG REQUEST =========="
  );

  console.log(
    "Question:",
    question
  );

  console.log(
    "Document:",
    documentId
  );

  console.log(
    "User:",
    userName
  );

  console.log(
    "User ID:",
    userId
  );

  console.log(
    "================================="
  );


  const response =
    await api.post(
      "/chat",
      {
        question,

        document_id:
          documentId || null,

        user_name:
          userName || null,

        user_id:
          userId || null,
      }
    );


  return response.data;
};