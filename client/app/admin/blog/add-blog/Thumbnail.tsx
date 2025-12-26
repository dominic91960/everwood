import { useState } from "react";
import Addimage from "./Addimage.png";
import Image from "next/image";

interface ThumbnailProps {
  onChange: (file: File) => void;
  currentThumbnail?: string;
  isEdit?: boolean;
}

const Thumbnail = ({ onChange, currentThumbnail, isEdit }: ThumbnailProps) => {
  const [preview, setPreview] = useState(currentThumbnail ?? null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    onChange(file);

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  return (
    <div className="space-y-4">
      {preview && (
        <div className="group relative">
          <Image
            src={preview}
            alt=""
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
          className={`cursor-pointer ${
            isEdit ? "cursor-not-allowed opacity-50" : ""
          }`}
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
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default Thumbnail;
