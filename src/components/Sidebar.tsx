import React from "react";

export type Document = {
  id: string;
  filename: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: any;
};

export type Chat = {
  id: string;
  title: string;
  documentId?: string | null;
  documentName?: string | null;
  messages: ChatMessage[];
};

type SidebarProps = {
  documents: Document[];
  activeDocument: Document | null;

  chats: Chat[];
  activeChatId: string | null;

  onSelect: (document: Document) => void;

  onSelectChat: (chat: Chat) => void;

  onNewChat: () => void;

  onDeleteChat: (chatId: string) => void;

  open: boolean;
};

export default function Sidebar({
  documents,
  activeDocument,
  chats,
  activeChatId,
  onSelect,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  open,
}: SidebarProps) {
  if (!open) {
    return null;
  }

  return (
    <aside className="flex h-full w-72 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">

      {/* ================================================= */}
      {/* NEW CHAT */}
      {/* ================================================= */}

      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          <span className="text-lg">+</span>
          New Chat
        </button>
      </div>


      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="flex-1 overflow-y-auto px-3 pb-4">

        {/* ================================================= */}
        {/* CHATS */}
        {/* ================================================= */}

        <div className="mb-6">

          <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Chats
          </h3>


          {chats.length === 0 ? (

            <div className="px-2 py-3 text-sm text-gray-500">
              No chats yet.
            </div>

          ) : (

            <div className="space-y-1">

              {chats.map((chat) => {

                const isActive =
                  activeChatId === chat.id;

                return (
                  <div
                    key={chat.id}
                    className={`group flex items-center gap-1 rounded-xl transition ${
                      isActive
                        ? "bg-gray-200 dark:bg-gray-800"
                        : "hover:bg-gray-100 dark:hover:bg-gray-900"
                    }`}
                  >

                    {/* CHAT BUTTON */}

                    <button
                      type="button"
                      onClick={() =>
                        onSelectChat(chat)
                      }
                      className="min-w-0 flex-1 px-3 py-2.5 text-left"
                    >

                      <div className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                        {chat.title || "New Chat"}
                      </div>


                      {/* PDF NAME */}

                      {chat.documentName && (
                        <div className="mt-0.5 truncate text-xs text-gray-500">
                          📄 {chat.documentName}
                        </div>
                      )}

                    </button>


                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        const confirmed =
                          window.confirm(
                            "Delete this chat?"
                          );

                        if (confirmed) {
                          onDeleteChat(chat.id);
                        }
                      }}
                      className="mr-2 hidden rounded-lg px-2 py-1 text-gray-400 hover:bg-gray-300 hover:text-red-500 group-hover:block dark:hover:bg-gray-700"
                      title="Delete chat"
                    >
                      ×
                    </button>

                  </div>
                );
              })}

            </div>
          )}

        </div>


        {/* ================================================= */}
        {/* UPLOADED PDFs */}
        {/* ================================================= */}

        <div>

          <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Uploaded PDFs
          </h3>


          {documents.length === 0 ? (

            <div className="px-2 py-3 text-sm text-gray-500">
              No PDFs uploaded.
            </div>

          ) : (

            <div className="space-y-1">

              {documents.map((document) => {

                const isActive =
                  activeDocument?.id ===
                  document.id;

                return (
                  <button
                    key={document.id}
                    type="button"
                    onClick={() =>
                      onSelect(document)
                    }
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
                    }`}
                  >

                    {/* PDF ICON */}

                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-sm dark:bg-red-950">
                      📄
                    </div>


                    {/* FILE NAME */}

                    <div className="min-w-0 flex-1">

                      <div className="truncate text-sm font-medium">
                        {document.filename}
                      </div>


                      {isActive && (
                        <div className="mt-0.5 text-xs text-blue-600 dark:text-blue-400">
                          Active document
                        </div>
                      )}

                    </div>

                  </button>
                );
              })}

            </div>
          )}

        </div>

      </div>


      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <div className="border-t border-gray-200 p-3 dark:border-gray-800">

        <div className="rounded-xl bg-gray-100 px-3 py-2 text-xs text-gray-500 dark:bg-gray-900">
          <div className="font-medium text-gray-700 dark:text-gray-300">
            Lumina AI
          </div>

          <div className="mt-1">
            Your conversations are saved automatically.
          </div>
        </div>

      </div>

    </aside>
  );
}