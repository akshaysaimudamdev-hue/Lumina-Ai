import FileCard from "./FileCard";
import ProjectStructure from "./ProjectStructure";
import RunCommands from "./RunCommands";
import Explanation from "./Explanation";

type CodeFile = {
  name?: string;
  filename?: string;
  language?: string;
  code?: string;
  content?: string;
};

type CodeResponse = {
  project?: string;
  files?: CodeFile[];
  explanation?: string;
  run?: string[] | string;
};

type Props = {
  response: CodeResponse;
};

export default function AIResponse({
  response,
}: Props) {

  const files = Array.isArray(response?.files)
    ? response.files
    : [];

  return (
    <div className="space-y-5">

      {/* Project name */}
      {response?.project && (
        <ProjectStructure
          structure={response.project}
        />
      )}

      {/* Files */}
      {files.map((file, index) => {

        const name =
          file.name ||
          file.filename ||
          `file-${index + 1}`;

        const code =
          file.code ||
          file.content ||
          "";

        const language =
          file.language ||
          "text";

        return (
          <FileCard
            key={`${name}-${index}`}
            name={name}
            language={language}
            code={code}
          />
        );
      })}

      {/* Explanation */}
      {response?.explanation && (
        <Explanation
          text={response.explanation}
        />
      )}

      {/* Run commands */}
      {response?.run && (
        <RunCommands
          commands={response.run}
        />
      )}

    </div>
  );
}