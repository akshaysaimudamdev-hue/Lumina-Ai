import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import CodeBlock from "./CodeBlock";

type Props = {
  content: string;
};

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            if (!inline && match) {
              return (
                <CodeBlock
                  language={match[1]}
                  code={String(children).replace(/\n$/, "")}
                />
              );
            }

            return (
              <code
                className="rounded bg-slate-200 dark:bg-slate-800 px-1 py-0.5"
                {...props}
              >
                {children}
              </code>
            );
          },

          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-4">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-6 mb-3">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-5 mb-2">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="leading-8 mb-4">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4">
              {children}
            </ol>
          ),

          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4">
              {children}
            </blockquote>
          ),

          table: ({ children }) => (
            <table className="table-auto border-collapse border border-slate-500 my-5">
              {children}
            </table>
          ),

          th: ({ children }) => (
            <th className="border border-slate-500 px-4 py-2">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border border-slate-500 px-4 py-2">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>

    </div>
  );
}