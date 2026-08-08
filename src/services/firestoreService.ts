import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

// =====================================================
// TYPES
// =====================================================

export type StoredMessage = {
  role: "user" | "assistant";
  content: any;
};

export type StoredChat = {
  id: string;
  userId: string;
  title: string;
  documentId?: string | null;
  documentName?: string | null;
  messages: StoredMessage[];
  createdAt?: any;
  updatedAt?: any;
};

export type StoredDocument = {
  id: string;
  filename: string;
  userId: string;
  createdAt?: any;
};

// =====================================================
// USER PROFILE
// =====================================================

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
};

// =====================================================
// SAVE USER PROFILE
// =====================================================

export const saveUserProfile = async (
  userId: string,
  name: string,
  email: string
) => {
  await setDoc(
    doc(db, "users", userId),
    {
      uid: userId,
      name,
      email,
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
};

// =====================================================
// GET USER PROFILE
// =====================================================

export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  const snapshot = await getDoc(
    doc(db, "users", userId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
};

// =====================================================
// CHATS
// =====================================================

// Create new chat
export const createChat = async (
  userId: string,
  title: string,
  documentId: string | null = null,
  documentName: string | null = null
): Promise<string> => {
  const chatRef = await addDoc(
    collection(db, "chats"),
    {
      userId,

      title:
        title?.trim() ||
        "New Chat",

      documentId:
        documentId || null,

      documentName:
        documentName || null,

      messages: [],

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    }
  );

  return chatRef.id;
};

// =====================================================
// UPDATE CHAT
// =====================================================

export const updateChat = async (
  chatId: string,
  data: Partial<StoredChat>
) => {
  await updateDoc(
    doc(db, "chats", chatId),
    {
      ...data,
      updatedAt:
        serverTimestamp(),
    }
  );
};

// =====================================================
// DELETE CHAT
// =====================================================

export const deleteChat = async (
  chatId: string
) => {
  await deleteDoc(
    doc(db, "chats", chatId)
  );
};

// =====================================================
// GET USER CHATS
// =====================================================
//
// IMPORTANT:
// No orderBy() is used here.
// Therefore no composite Firestore index
// is required.
//
// We sort the chats locally instead.
// =====================================================

export const getUserChats = async (
  userId: string
): Promise<StoredChat[]> => {
  const chatsQuery = query(
    collection(db, "chats"),
    where(
      "userId",
      "==",
      userId
    )
  );

  const snapshot =
    await getDocs(chatsQuery);

  const chats: StoredChat[] =
    snapshot.docs.map((item) => {
      const data =
        item.data();

      return {
        id: item.id,

        userId:
          data.userId ||
          userId,

        title:
          data.title ||
          "New Chat",

        documentId:
          data.documentId ||
          null,

        documentName:
          data.documentName ||
          null,

        messages:
          Array.isArray(
            data.messages
          )
            ? data.messages
            : [],

        createdAt:
          data.createdAt,

        updatedAt:
          data.updatedAt,
      };
    });

  // ===================================================
  // SORT LOCALLY
  // ===================================================

  chats.sort((a, b) => {
    const timeA =
      a.updatedAt?.seconds ||
      a.createdAt?.seconds ||
      0;

    const timeB =
      b.updatedAt?.seconds ||
      b.createdAt?.seconds ||
      0;

    return timeB - timeA;
  });

  return chats;
};

// =====================================================
// GET SINGLE CHAT
// =====================================================

export const getChat = async (
  chatId: string
): Promise<StoredChat | null> => {
  const snapshot =
    await getDoc(
      doc(db, "chats", chatId)
    );

  if (!snapshot.exists()) {
    return null;
  }

  const data =
    snapshot.data();

  return {
    id: snapshot.id,

    userId:
      data.userId,

    title:
      data.title ||
      "New Chat",

    documentId:
      data.documentId ||
      null,

    documentName:
      data.documentName ||
      null,

    messages:
      Array.isArray(
        data.messages
      )
        ? data.messages
        : [],

    createdAt:
      data.createdAt,

    updatedAt:
      data.updatedAt,
  };
};

// =====================================================
// DOCUMENTS
// =====================================================

// Save uploaded PDF
export const saveDocument = async (
  userId: string,
  documentId: string,
  filename: string
) => {
  await setDoc(
    doc(
      db,
      "users",
      userId,
      "documents",
      documentId
    ),
    {
      id: documentId,

      filename,

      userId,

      createdAt:
        serverTimestamp(),
    },
    {
      merge: true,
    }
  );
};

// =====================================================
// GET USER DOCUMENTS
// =====================================================

export const getUserDocuments = async (
  userId: string
): Promise<StoredDocument[]> => {
  const snapshot =
    await getDocs(
      collection(
        db,
        "users",
        userId,
        "documents"
      )
    );

  const documents: StoredDocument[] =
    snapshot.docs.map((item) => {
      const data =
        item.data();

      return {
        id:
          data.id ||
          item.id,

        filename:
          data.filename ||
          "Uploaded PDF",

        userId:
          data.userId ||
          userId,

        createdAt:
          data.createdAt,
      };
    });

  // Newest documents first
  documents.sort((a, b) => {
    const timeA =
      a.createdAt?.seconds ||
      0;

    const timeB =
      b.createdAt?.seconds ||
      0;

    return timeB - timeA;
  });

  return documents;
};

// =====================================================
// DELETE USER DOCUMENT
// =====================================================

export const deleteUserDocument = async (
  userId: string,
  documentId: string
) => {
  await deleteDoc(
    doc(
      db,
      "users",
      userId,
      "documents",
      documentId
    )
  );
};