import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  language: string;
  code: string;
  fileName?: string;
};

export default function CodeBlock({
  language,
  code,
  fileName,
}: Props) {
  const [copied, setCopied] = useState(false);

  const dark =
    document.documentElement.classList.contains("dark");

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-slate-700">

      <div className="flex items-center justify-between bg-slate-900 px-4 py-3">

        <span className="text-sm font-medium text-slate-300">
          {fileName || language.toUpperCase()}
        </span>

        <button
          onClick={copyCode}
          className="flex items-center gap-2 rounded-lg px-3 py-1 text-sm text-white hover:bg-slate-700 transition"
        >
          {copied ? (
            <>
              <Check size={16} />
              Copied
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy
            </>
          )}
        </button>

      </div>

      <SyntaxHighlighter
        language={language}
        style={dark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "15px",
          padding: "20px",
        }}
      >
        {code}
      </SyntaxHighlighter>

    </div>
  );
}