import {
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import {
  Send,
  Paperclip,
  Mic,
  X,
  FileText,
} from "lucide-react";

import api from "../services/api";

type Document = {
  id: string;
  filename: string;
};

type Props = {
  onSend: (question: string) => void;

  onUploadSuccess: (
    documentId: string,
    filename: string
  ) => void;

  activeDocument: Document | null;

  onClearDocument: () => void;
};

export default function ChatInput({
  onSend,
  onUploadSuccess,
  activeDocument,
  onClearDocument,
}: Props) {

  const [message, setMessage] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  // --------------------------------------------------
  // Send message
  // --------------------------------------------------

  const handleSend = () => {
    const trimmedMessage =
      message.trim();

    if (!trimmedMessage) {
      return;
    }

    onSend(trimmedMessage);

    setMessage("");
  };

  // --------------------------------------------------
  // Keyboard
  // --------------------------------------------------

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSend();
    }
  };

  // --------------------------------------------------
  // Open file picker
  // --------------------------------------------------

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // --------------------------------------------------
  // Upload PDF
  // --------------------------------------------------

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // Check PDF
    const isPDF =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPDF) {
      alert(
        "Please upload a PDF file."
      );

      event.target.value = "";

      return;
    }

    setUploading(true);

    try {

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      console.log(
        "Uploading PDF:",
        file.name
      );

      const response =
        await api.post(
          "/upload",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      console.log(
        "Upload response:",
        response.data
      );

      /*
       * Expected backend response:
       *
       * {
       *   document_id: "...",
       *   filename: "resume.pdf"
       * }
       */

      const documentId =
        response.data.document_id ||
        response.data.id;

      const filename =
        response.data.filename ||
        file.name;

      if (!documentId) {
        throw new Error(
          "Backend did not return document ID."
        );
      }

      onUploadSuccess(
        documentId,
        filename
      );

    } catch (error) {

      console.error(
        "PDF upload failed:",
        error
      );

      alert(
        "Failed to upload PDF. Please try again."
      );

    } finally {

      setUploading(false);

      // Allows same PDF to be uploaded again
      event.target.value = "";
    }
  };

  // --------------------------------------------------
  // Remove active PDF from current chat
  // --------------------------------------------------

  const handleClearDocument = () => {

    console.log(
      "Removing PDF from current chat:",
      activeDocument?.filename
    );

    onClearDocument();
  };

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950">

      <div className="mx-auto max-w-5xl">

        {/* ================================================= */}
        {/* ACTIVE PDF */}
        {/* ================================================= */}

        {activeDocument && (

          <div className="mb-3 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950/40">

            <div className="flex min-w-0 items-center gap-3">

              {/* PDF Icon */}

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">

                <FileText size={18} />

              </div>

              {/* PDF Name */}

              <div className="min-w-0">

                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Currently chatting about
                </p>

                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {activeDocument.filename}
                </p>

              </div>

            </div>

            {/* X BUTTON */}

            <button
              type="button"
              onClick={
                handleClearDocument
              }
              className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950"
              title="Remove PDF from current chat"
            >
              <X size={18} />
            </button>

          </div>
        )}

        {/* ================================================= */}
        {/* INPUT */}
        {/* ================================================= */}

        <div className="relative flex items-end gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900">

          {/* Hidden PDF input */}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Upload button */}

          <button
            type="button"
            onClick={
              handleFileButtonClick
            }
            disabled={uploading}
            className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800"
            title="Upload PDF"
          >
            <Paperclip size={20} />
          </button>

          {/* Text input */}

          <textarea
            value={message}
            onChange={(event) =>
              setMessage(
                event.target.value
              )
            }
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={uploading}
            placeholder={
              uploading
                ? "Uploading PDF..."
                : activeDocument
                ? `Ask anything about ${activeDocument.filename}...`
                : "Ask Lumina AI anything..."
            }
            className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-white"
          />

          {/* Microphone */}

          <button
            type="button"
            className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
            title="Voice input"
          >
            <Mic size={20} />
          </button>

          {/* Send */}

          <button
            type="button"
            onClick={handleSend}
            disabled={
              !message.trim() ||
              uploading
            }
            className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            title="Send"
          >
            <Send size={19} />
          </button>

        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <p className="mt-2 text-center text-xs text-slate-400">

          {activeDocument
            ? `Questions will use ${activeDocument.filename}`
            : "Lumina AI can answer questions, analyze PDFs, and generate code."}

        </p>

      </div>

    </div>
  );
}