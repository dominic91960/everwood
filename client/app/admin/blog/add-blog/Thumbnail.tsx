import { useState, useEffect } from "react";
import Addimage from "./Addimage.png";
import Image from "next/image";

interface ThumbnailProps {
  onThumbnailUpload: (url: string) => void;
  initialThumbnail?: string;
  isEdit?: boolean;
}

const Thumbnail = ({ onThumbnailUpload, initialThumbnail, isEdit }: ThumbnailProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(initialThumbnail || "");
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
      // Create a local preview URL immediately (no Firebase)
      const localUrl = URL.createObjectURL(file);
      setThumbnailUrl(localUrl);
      onThumbnailUpload(localUrl);
      setUploadProgress("Image selected.");
      setTimeout(() => setUploadProgress(""), 1500);
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {thumbnailUrl && (
        <div className="relative group">
          <Image
            src={thumbnailUrl}
            alt="Thumbnail preview"
            width={400}
            height={300}
            className="w-full max-w-md h-auto rounded-lg shadow-lg border border-gray-200"
          />
          {!isEdit && (
            <div className="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex items-center justify-center rounded-lg">
              <span className="text-white text-sm">Click to change image</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className={`cursor-pointer ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <Image src={Addimage} alt="Add image" className="w-20 h-20 object-cover rounded-lg" />
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
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-blue-600 text-sm">Uploading...</span>
            </div>
          )}
          {uploadProgress && (
            <span className={`text-sm ${uploadProgress.includes('successful') ? 'text-green-600' : uploadProgress.includes('failed') ? 'text-red-600' : 'text-blue-600'}`}>
              {uploadProgress}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Thumbnail;