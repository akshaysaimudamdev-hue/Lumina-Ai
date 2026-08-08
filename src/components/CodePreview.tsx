import { useState } from "react";
import PreviewTabs from "./PreviewTabs";
import LivePreview from "./LivePreview";

type Props = {
  html: string;
  css: string;
  js: string;
  children: React.ReactNode;
};

export default function CodePreview({
  html,
  css,
  js,
  children,
}: Props) {

  const [tab, setTab] = useState<"code" | "preview">("code");

  return (
    <>

      <PreviewTabs
        active={tab}
        setActive={setTab}
      />

      {tab === "code"
        ? children
        : (
          <LivePreview
            html={html}
            css={css}
            js={js}
          />
        )}

    </>
  );
}