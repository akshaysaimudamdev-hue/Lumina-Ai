import { useState } from "react";

type Props = {
  name: string;
  language: string;
  code: string;
};

export default function FileCard({
  name,
  language,
  code,
}: Props) {

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {

    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-4 py-3">

        <div className="flex items-center gap-3">

          <span className="text-sm font-medium text-white">
            {name}
          </span>

          <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
            {language}
          </span>

        </div>

        <button
          onClick={handleCopy}
          className="rounded-md px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>

      </div>

      {/* Code */}
      <div className="overflow-x-auto">

        <pre className="p-5 text-sm leading-6 text-slate-200">

          <code>
            {code}
          </code>

        </pre>

      </div>

    </div>
  );
}