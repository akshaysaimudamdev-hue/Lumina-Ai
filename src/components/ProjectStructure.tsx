import { FolderTree } from "lucide-react";

type Props = {
  structure: string;
};

export default function ProjectStructure({ structure }: Props) {
  if (!structure.trim()) return null;

  return (
    <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden">

      <div className="flex items-center gap-2 border-b border-slate-700 px-5 py-3">

        <FolderTree size={20} className="text-blue-400" />

        <h2 className="font-semibold text-white">
          Project Structure
        </h2>

      </div>

      <pre className="overflow-x-auto p-5 text-sm text-slate-300 whitespace-pre-wrap font-mono">
        {structure}
      </pre>

    </div>
  );
}