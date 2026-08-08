import { Terminal } from "lucide-react";

type Props = {
  commands: string[] | string;
};

export default function RunCommands({
  commands,
}: Props) {

  const commandList =
    Array.isArray(commands)
      ? commands
      : commands
          .split("\n")
          .filter(Boolean);

  if (commandList.length === 0) return null;

  return (
    <div className="space-y-2">

      <h3 className="font-semibold">
        Run Commands
      </h3>

      {commandList.map((cmd, index) => (
        <pre
          key={index}
          className="rounded-lg bg-slate-900 p-3 text-green-400 overflow-x-auto"
        >
          {cmd}
        </pre>
      ))}

    </div>
  );
}