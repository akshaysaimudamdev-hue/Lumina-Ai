import {
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { auth } from "./firebase";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Chatbot from "./components/Chatbot";
import ChatInput from "./components/ChatInput";
import Loader from "./components/Loader";
import Login from "./components/Login";

import { askQuestion } from "./services/ragService";

import {
  getUserChats,
  createChat,
  updateChat,
  deleteChat,
  getUserDocuments,
  saveDocument,
  getUserProfile,
  saveUserProfile,
  type StoredChat,
} from "./services/firestoreService";

// =====================================================
// TYPES
// =====================================================

export type CodeFile = {
  name: string;
  language: string;
  code: string;
};

export type CodeResponse = {
  project?: string;
  files: CodeFile[];
  explanation?: string;
  run?: string[] | string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string | CodeResponse;
};

export type Document = {
  id: string;
  filename: string;
};

export type Chat = {
  id: string;
  title: string;
  documentId?: string | null;
  documentName?: string | null;
  messages: ChatMessage[];
};

// =====================================================
// APP
// =====================================================

export default function App() {
  // ===================================================
  // AUTH
  // ===================================================

  const [user, setUser] =
    useState<User | null>(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  // ===================================================
  // USER NAME
  // ===================================================

  const [userName, setUserName] =
    useState("");

  // ===================================================
  // CHATS
  // ===================================================

  const [chats, setChats] =
    useState<Chat[]>([]);

  const [activeChatId, setActiveChatId] =
    useState<string | null>(null);

  // ===================================================
  // MESSAGES
  // ===================================================

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  // ===================================================
  // UI
  // ===================================================

  const [loading, setLoading] =
    useState(false);

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  // ===================================================
  // DOCUMENTS
  // ===================================================

  const [documents, setDocuments] =
    useState<Document[]>([]);

  const [activeDocument, setActiveDocument] =
    useState<Document | null>(null);

  // ===================================================
  // AUTH LISTENER
  // ===================================================

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {
          setUser(currentUser);
          setAuthLoading(false);

          // ==========================================
          // LOGOUT
          // ==========================================

          if (!currentUser) {
            setUserName("");
            setChats([]);
            setMessages([]);
            setDocuments([]);
            setActiveChatId(null);
            setActiveDocument(null);

            return;
          }

          console.log(
            "================================"
          );

          console.log(
            "Logged in:",
            currentUser.email
          );

          console.log(
            "User UID:",
            currentUser.uid
          );

          console.log(
            "================================"
          );

          try {
            // ========================================
            // LOAD USER PROFILE
            // ========================================

            const profile =
              await getUserProfile(
                currentUser.uid
              );

            /*
             * Priority:
             *
             * 1. Firestore saved name
             * 2. Google/Firebase displayName
             * 3. Email username
             * 4. User
             */

            const name =
              profile?.name?.trim() ||
              currentUser.displayName?.trim() ||
              currentUser.email
                ?.split("@")[0]
                ?.trim() ||
              "User";

            setUserName(name);

            // ========================================
            // SAVE PROFILE
            // ========================================

            await saveUserProfile(
              currentUser.uid,
              name,
              currentUser.email || ""
            );

            // ========================================
            // LOAD CHATS
            // ========================================

            const storedChats =
              await getUserChats(
                currentUser.uid
              );

            const formattedChats: Chat[] =
              storedChats.map(
                (chat: StoredChat) => ({
                  id: chat.id,

                  title:
                    chat.title ||
                    "New Chat",

                  documentId:
                    chat.documentId ||
                    null,

                  documentName:
                    chat.documentName ||
                    null,

                  messages:
                    Array.isArray(
                      chat.messages
                    )
                      ? (chat.messages as ChatMessage[])
                      : [],
                })
              );

            setChats(formattedChats);

            // ========================================
            // LOAD DOCUMENTS
            // ========================================

            const storedDocuments =
              await getUserDocuments(
                currentUser.uid
              );

            const formattedDocuments: Document[] =
              storedDocuments.map(
                (item) => ({
                  id: item.id,

                  filename:
                    item.filename ||
                    "Uploaded PDF",
                })
              );

            setDocuments(
              formattedDocuments
            );

            // ========================================
            // RESTORE ACTIVE CHAT
            // ========================================

            const storageKey =
              `lumina_active_chat_${currentUser.uid}`;

            const savedChatId =
              localStorage.getItem(
                storageKey
              );

            /*
             * First try the previously active chat.
             *
             * If it doesn't exist anymore,
             * use the newest chat.
             */

            const restoredChat =
              formattedChats.find(
                (chat) =>
                  chat.id ===
                  savedChatId
              ) ||
              formattedChats[0];

            // ========================================
            // RESTORE CHAT
            // ========================================

            if (restoredChat) {
              setActiveChatId(
                restoredChat.id
              );

              setMessages(
                restoredChat.messages || []
              );

              localStorage.setItem(
                storageKey,
                restoredChat.id
              );

              // ======================================
              // RESTORE PDF
              // ======================================

              if (
                restoredChat.documentId
              ) {
                const matchingDocument =
                  formattedDocuments.find(
                    (document) =>
                      document.id ===
                      restoredChat.documentId
                  );

                setActiveDocument({
                  id:
                    restoredChat.documentId,

                  filename:
                    matchingDocument?.filename ||
                    restoredChat.documentName ||
                    "Uploaded PDF",
                });
              } else {
                setActiveDocument(null);
              }
            } else {
              // ======================================
              // NO CHATS
              // ======================================

              setActiveChatId(null);

              setMessages([]);

              setActiveDocument(null);

              localStorage.removeItem(
                storageKey
              );
            }
          } catch (error) {
            console.error(
              "Failed to load user data:",
              error
            );
          }
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  // ===================================================
  // NEW CHAT
  // ===================================================

  const handleNewChat = async () => {
    if (!user) {
      return;
    }

    try {
      console.log(
        "Creating new chat..."
      );

      const chatId =
        await createChat(
          user.uid,
          "New Chat",
          null,
          null
        );

      const newChat: Chat = {
        id: chatId,

        title: "New Chat",

        documentId: null,

        documentName: null,

        messages: [],
      };

      setChats((previous) => [
        newChat,
        ...previous,
      ]);

      setActiveChatId(chatId);

      setMessages([]);

      setActiveDocument(null);

      // Save active chat
      localStorage.setItem(
        `lumina_active_chat_${user.uid}`,
        chatId
      );

      console.log(
        "New chat created:",
        chatId
      );
    } catch (error) {
      console.error(
        "Failed to create chat:",
        error
      );
    }
  };

  // ===================================================
  // SELECT CHAT
  // ===================================================

  const handleSelectChat = (
    chat: Chat
  ) => {
    if (!user) {
      return;
    }

    console.log(
      "Selecting chat:",
      chat.id
    );

    setActiveChatId(chat.id);

    setMessages(
      chat.messages || []
    );

    // Save active chat
    localStorage.setItem(
      `lumina_active_chat_${user.uid}`,
      chat.id
    );

    // ================================================
    // RESTORE DOCUMENT
    // ================================================

    if (chat.documentId) {
      const matchingDocument =
        documents.find(
          (document) =>
            document.id ===
            chat.documentId
        );

      setActiveDocument({
        id: chat.documentId,

        filename:
          matchingDocument?.filename ||
          chat.documentName ||
          "Uploaded PDF",
      });
    } else {
      setActiveDocument(null);
    }
  };

  // ===================================================
  // SELECT DOCUMENT
  // ===================================================

  const handleSelectDocument = (
    document: Document
  ) => {
    console.log(
      "Selected PDF:",
      document.filename
    );

    setActiveDocument(document);

    // Find chat associated with PDF
    const documentChat =
      chats.find(
        (chat) =>
          chat.documentId ===
          document.id
      );

    if (documentChat) {
      handleSelectChat(
        documentChat
      );

      return;
    }

    // If no chat exists for PDF
    setMessages([]);

    setActiveChatId(null);
  };

  // ===================================================
  // DELETE CHAT
  // ===================================================

  const handleDeleteChat = async (
    chatId: string
  ) => {
    if (!user) {
      return;
    }

    try {
      console.log(
        "Deleting chat:",
        chatId
      );

      await deleteChat(chatId);

      const remainingChats =
        chats.filter(
          (chat) =>
            chat.id !== chatId
        );

      setChats(
        remainingChats
      );

      // ==============================================
      // IF ACTIVE CHAT WAS DELETED
      // ==============================================

      if (
        activeChatId ===
        chatId
      ) {
        const nextChat =
          remainingChats[0];

        if (nextChat) {
          handleSelectChat(
            nextChat
          );
        } else {
          setActiveChatId(null);

          setMessages([]);

          setActiveDocument(null);

          localStorage.removeItem(
            `lumina_active_chat_${user.uid}`
          );
        }
      }
    } catch (error) {
      console.error(
        "Failed to delete chat:",
        error
      );
    }
  };

  // ===================================================
  // PDF UPLOAD SUCCESS
  // ===================================================

  const handleUploadSuccess =
    async (
      documentId: string,
      filename: string
    ) => {
      if (!user) {
        return;
      }

      try {
        console.log(
          "================================"
        );

        console.log(
          "PDF UPLOAD SUCCESS"
        );

        console.log(
          "Document ID:",
          documentId
        );

        console.log(
          "Filename:",
          filename
        );

        console.log(
          "================================"
        );

        // ============================================
        // DOCUMENT OBJECT
        // ============================================

        const document: Document = {
          id: documentId,
          filename,
        };

        // ============================================
        // SAVE DOCUMENT TO FIRESTORE
        // ============================================

        await saveDocument(
          user.uid,
          documentId,
          filename
        );

        // ============================================
        // UPDATE DOCUMENT LIST
        // ============================================

        setDocuments(
          (previous) => {
            const exists =
              previous.some(
                (item) =>
                  item.id ===
                  documentId
              );

            if (exists) {
              return previous.map(
                (item) =>
                  item.id ===
                  documentId
                    ? document
                    : item
              );
            }

            return [
              document,
              ...previous,
            ];
          }
        );

        // ============================================
        // CREATE CHAT FOR PDF
        // ============================================

        const title =
          filename
            .replace(
              /\.pdf$/i,
              ""
            )
            .slice(0, 40);

        const chatId =
          await createChat(
            user.uid,
            title || "PDF Chat",
            documentId,
            filename
          );

        const newChat: Chat = {
          id: chatId,

          title:
            title ||
            "PDF Chat",

          documentId,

          documentName:
            filename,

          messages: [],
        };

        // ============================================
        // ADD CHAT TO SIDEBAR
        // ============================================

        setChats(
          (previous) => [
            newChat,
            ...previous,
          ]
        );

        // ============================================
        // MAKE CHAT ACTIVE
        // ============================================

        setActiveChatId(
          chatId
        );

        setActiveDocument(
          document
        );

        setMessages([]);

        // ============================================
        // SAVE ACTIVE CHAT
        // ============================================

        localStorage.setItem(
          `lumina_active_chat_${user.uid}`,
          chatId
        );

        console.log(
          "PDF chat created:",
          chatId
        );
      } catch (error) {
        console.error(
          "Failed to save uploaded PDF:",
          error
        );

        alert(
          "PDF uploaded, but failed to save it to your account."
        );
      }
    };

  // ===================================================
  // CLEAR ACTIVE PDF
  // ===================================================

  const handleClearActiveDocument =
    async () => {
      console.log(
        "Removing active PDF from current chat:",
        activeDocument?.filename
      );

      setActiveDocument(null);

      setMessages([]);

      /*
       * IMPORTANT:
       *
       * We do NOT delete the PDF from Firebase.
       * It remains available in the sidebar.
       */
    };

  // ===================================================
  // SEND MESSAGE
  // ===================================================

  const handleSend = async (
    question: string
  ) => {
    if (
      !question.trim() ||
      !user
    ) {
      return;
    }

    // ================================================
    // USER MESSAGE
    // ================================================

    const userMessage: ChatMessage = {
      role: "user",
      content: question,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(
      updatedMessages
    );

    setLoading(true);

    try {
      console.log(
        "================================"
      );

      console.log(
        "CHAT REQUEST"
      );

      console.log(
        "User:",
        userName
      );

      console.log(
        "UID:",
        user.uid
      );

      console.log(
        "Question:",
        question
      );

      console.log(
        "PDF:",
        activeDocument?.filename ||
          "None"
      );

      console.log(
        "Document ID:",
        activeDocument?.id ||
          "None"
      );

      console.log(
        "================================"
      );

      // ==============================================
      // CREATE CHAT IF NECESSARY
      // ==============================================

      let chatId =
        activeChatId;

      if (!chatId) {
        chatId =
          await createChat(
            user.uid,

            question
              .trim()
              .slice(0, 40),

            activeDocument?.id ||
              null,

            activeDocument?.filename ||
              null
          );

        const newChat: Chat = {
          id: chatId,

          title:
            question
              .trim()
              .slice(0, 40),

          documentId:
            activeDocument?.id ||
            null,

          documentName:
            activeDocument?.filename ||
            null,

          messages: [],
        };

        setChats(
          (previous) => [
            newChat,
            ...previous,
          ]
        );

        setActiveChatId(
          chatId
        );

        localStorage.setItem(
          `lumina_active_chat_${user.uid}`,
          chatId
        );
      }

      // ==============================================
      // ASK BACKEND
      // ==============================================

      const response =
        await askQuestion(
          question,

          activeDocument?.id ||
            null,

          userName,

          user.uid
        );

      console.log(
        "API Response:",
        response
      );

      // ==============================================
      // ASSISTANT MESSAGE
      // ==============================================

      const assistantMessage:
        ChatMessage = {
        role: "assistant",

        content:
          response.answer,
      };

      const finalMessages = [
        ...updatedMessages,
        assistantMessage,
      ];

      setMessages(
        finalMessages
      );

      // ==============================================
      // CHAT TITLE
      // ==============================================

      const currentChat =
        chats.find(
          (chat) =>
            chat.id ===
            chatId
        );

      const chatTitle =
        currentChat?.title ||
        (
          activeDocument?.filename
            ? activeDocument.filename
                .replace(
                  /\.pdf$/i,
                  ""
                )
                .slice(0, 40)
            : question
                .trim()
                .slice(0, 40)
        ) ||
        "New Chat";

      // ==============================================
      // SAVE CHAT
      // ==============================================

      await updateChat(
        chatId,
        {
          messages:
            finalMessages,

          documentId:
            activeDocument?.id ||
            null,

          documentName:
            activeDocument?.filename ||
            null,

          title:
            chatTitle,
        }
      );

      // ==============================================
      // UPDATE LOCAL CHAT
      // ==============================================

      setChats(
        (previous) =>
          previous.map(
            (chat) =>
              chat.id ===
              chatId
                ? {
                    ...chat,

                    title:
                      chatTitle,

                    messages:
                      finalMessages,

                    documentId:
                      activeDocument?.id ||
                      null,

                    documentName:
                      activeDocument?.filename ||
                      null,
                  }
                : chat
          )
      );

      // Keep this chat as active
      localStorage.setItem(
        `lumina_active_chat_${user.uid}`,
        chatId
      );
    } catch (error) {
      console.error(
        "Chat request failed:",
        error
      );

      const errorMessage:
        ChatMessage = {
        role: "assistant",

        content:
          "Something went wrong while generating the response. Please try again.",
      };

      setMessages(
        (previous) => [
          ...previous,
          errorMessage,
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // AUTH LOADING
  // ===================================================

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="mb-3 text-2xl">
            ✦
          </div>

          <p className="text-sm text-slate-500">
            Loading Lumina AI...
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // LOGIN
  // ===================================================

  if (!user) {
    return <Login />;
  }

  // ===================================================
  // MAIN UI
  // ===================================================

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-slate-950">

      {/* ============================================= */}
      {/* NAVBAR */}
      {/* ============================================= */}

      <Navbar
        sidebarOpen={
          sidebarOpen
        }

        setSidebarOpen={
          setSidebarOpen
        }

        userName={
          userName
        }
      />

      {/* ============================================= */}
      {/* MAIN */}
      {/* ============================================= */}

      <div className="flex flex-1 overflow-hidden">

        {/* =========================================== */}
        {/* SIDEBAR */}
        {/* =========================================== */}

        <Sidebar
          documents={
            documents
          }

          activeDocument={
            activeDocument
          }

          chats={
            chats
          }

          activeChatId={
            activeChatId
          }

          onSelect={
            handleSelectDocument
          }

          onSelectChat={
            handleSelectChat
          }

          onNewChat={
            handleNewChat
          }

          onDeleteChat={
            handleDeleteChat
          }

          open={
            sidebarOpen
          }
        />

        {/* =========================================== */}
        {/* CHAT AREA */}
        {/* =========================================== */}

        <div className="flex min-w-0 flex-1 flex-col">

          {/* ========================================= */}
          {/* MESSAGES */}
          {/* ========================================= */}

          <div className="flex-1 overflow-hidden overflow-y-auto px-4 py-6">

            <Chatbot
              messages={
                messages
              }
            />

          </div>

          {/* ========================================= */}
          {/* LOADER */}
          {/* ========================================= */}

          {loading && (
            <div className="px-4">
              <Loader />
            </div>
          )}

          {/* ========================================= */}
          {/* CHAT INPUT */}
          {/* ========================================= */}

          <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">

            <ChatInput
              onSend={
                handleSend
              }

              onUploadSuccess={
                handleUploadSuccess
              }

              activeDocument={
                activeDocument
              }

              onClearDocument={
                handleClearActiveDocument
              }
            />

          </div>

        </div>
      </div>
    </div>
  );
}