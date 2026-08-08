type Props = {
  active: "code" | "preview";
  setActive: (tab: "code" | "preview") => void;
};

export default function PreviewTabs({
  active,
  setActive,
}: Props) {
  return (
    <div className="flex gap-2 mb-4">

      <button
        onClick={() => setActive("code")}
        className={`px-5 py-2 rounded-lg ${
          active === "code"
            ? "bg-blue-600 text-white"
            : "bg-slate-200"
        }`}
      >
        💻 Code
      </button>

      <button
        onClick={() => setActive("preview")}
        className={`px-5 py-2 rounded-lg ${
          active === "preview"
            ? "bg-blue-600 text-white"
            : "bg-slate-200"
        }`}
      >
        👁 Preview
      </button>

    </div>
  );
}