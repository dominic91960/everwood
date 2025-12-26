import { useState, useEffect } from "react";
import Addimage from "./Addimage.png";
import Image from "next/image";

interface ThumbnailProps {
  onThumbnailUpload: (url: string) => void;
  initialThumbnail?: string;
  isEdit?: boolean;
}

const Thumbnail = ({
  onThumbnailUpload,
  initialThumbnail,
  isEdit,
}: ThumbnailProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    initialThumbnail || "",
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  useEffect(() => {
    if (initialThumbnail) {
      setThumbnailUrl(initialThumbnail);
    }
  }, [initialThumbnail]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress("Uploading to Supabase...");
      try {
        // Optimistic local preview
        const localUrl = URL.createObjectURL(file);
        setThumbnailUrl(localUrl);

        const publicUrl = "abdkf";
        setThumbnailUrl(publicUrl);
        onThumbnailUpload(publicUrl);
        setUploadProgress("Upload successful.");
      } catch (err) {
        console.error("Upload failed:", err);
        const msg =
          err instanceof Error
            ? err.message
            : typeof err === "string"
              ? err
              : "Please check bucket name and storage policies.";
        setUploadProgress(`Upload failed: ${msg}`);
      } finally {
        setIsUploading(false);
        setTimeout(() => setUploadProgress(""), 1800);
      }
    }
  };

  return (
    <div className="space-y-4">
      {thumbnailUrl && (
        <div className="group relative">
          <Image
            src={thumbnailUrl}
            alt="Thumbnail preview"
            width={400}
            height={300}
            className="h-auto w-full max-w-md rounded-lg border border-gray-200 shadow-lg"
          />
          {!isEdit && (
            <div className="bg-opacity-50 absolute inset-0 hidden items-center justify-center rounded-lg bg-black group-hover:flex">
              <span className="text-sm text-white">Click to change image</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <label
          className={`cursor-pointer ${isEdit ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <Image
            src={Addimage}
            alt="Add image"
            className="h-20 w-20 rounded-lg object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading || isEdit}
            className="hidden"
          />
        </label>

        <div className="flex flex-col">
          {isUploading && (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-600">Uploading...</span>
            </div>
          )}
          {uploadProgress && (
            <span
              className={`text-sm ${uploadProgress.includes("successful") ? "text-green-600" : uploadProgress.includes("failed") ? "text-red-600" : "text-blue-600"}`}
            >
              {uploadProgress}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Thumbnail;
