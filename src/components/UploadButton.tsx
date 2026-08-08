import { Paperclip, Loader2 } from "lucide-react";
import { uploadPDF } from "../services/ragService";

interface Props {
  uploading: boolean;
  setUploading: (value: boolean) => void;
}

export default function UploadButton({
  uploading,
  setUploading,
}: Props) {
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const response = await uploadPDF(file);

      console.log(response);

      alert("✅ PDF uploaded successfully!");
    } catch (err) {
      console.error(err);

      alert("❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        id="upload"
        type="file"
        hidden
        accept=".pdf"
        onChange={handleUpload}
      />

      <label
        htmlFor="upload"
        className="cursor-pointer p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800"
      >
        {uploading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Paperclip />
        )}
      </label>
    </>
  );
}