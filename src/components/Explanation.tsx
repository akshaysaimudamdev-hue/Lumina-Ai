type Props = {
  text: string;
};

export default function Explanation({
  text,
}: Props) {
  if (!text.trim()) return null;

  return (
    <div className="my-8 rounded-xl border border-slate-300 dark:border-slate-700 p-6">

      <h2 className="mb-4 text-xl font-bold">
        Explanation
      </h2>

      <p className="leading-8 whitespace-pre-wrap">
        {text}
      </p>

    </div>
  );
}