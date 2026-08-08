import AIResponse from "./AIResponse";
import MarkdownRenderer from "./MarkdownRenderer";

type CodeFile = {
  name: string;
  language: string;
  code: string;
};

type CodeResponse = {
  project?: string;
  files: CodeFile[];
  explanation?: string;
  run?: string[] | string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string | CodeResponse;
};

type Props = {
  messages: ChatMessage[];
};

export default function Chatbot({ messages }: Props) {
  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-5 py-4 shadow-md ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              }`}
            >
              {message.role === "assistant" ? (
                typeof message.content === "object" &&
                message.content !== null &&
                "files" in message.content ? (
                  <AIResponse response={message.content} />
                ) : (
                  <MarkdownRenderer
                    content={String(message.content)}
                  />
                )
              ) : (
                <p className="whitespace-pre-wrap">
                  {String(message.content)}
                </p>
              )}
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="flex min-h-[65vh] items-center justify-center">
            <div className="max-w-xl text-center">

              <div className="mb-5 text-5xl">
                ✨
              </div>

              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Welcome to Lumina AI
              </h1>

              <p className="mt-4 text-slate-500 dark:text-slate-400">
                Upload a PDF, ask questions, summarize documents,
                analyze images, or generate complete code projects.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  📄
                  <p className="mt-2 text-sm font-medium">
                    PDF Analysis
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  💬
                  <p className="mt-2 text-sm font-medium">
                    Q&A
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  💻
                  <p className="mt-2 text-sm font-medium">
                    Code Generation
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}