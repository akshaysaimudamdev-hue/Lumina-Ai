type Props = {
  html: string;
  css: string;
  js: string;
};

export default function LivePreview({
  html,
  css,
  js,
}: Props) {

  const srcDoc = `
<!DOCTYPE html>
<html>
<head>

<style>

${css}

</style>

</head>

<body>

${html}

<script>

${js}

</script>

</body>
</html>
`;

  return (
    <iframe
      title="preview"
      srcDoc={srcDoc}
      className="w-full h-[550px] rounded-xl border bg-white"
      sandbox="allow-scripts"
    />
  );
}