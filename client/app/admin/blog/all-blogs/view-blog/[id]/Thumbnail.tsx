import { useState } from "react";
import Image from "next/image";
import { MdModeEdit } from "react-icons/md";
import Addimage from "./Addimage.png";

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
      <div className="flex items-center gap-4">
        <label
          className={`relative ${
            !isEdit ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <Image
            src={preview ?? Addimage}
            alt=""
            width={400}
            height={300}
            className="h-40 w-40 rounded-lg object-contain border border-gray-400"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={!isEdit}
          />

          {isEdit && (
            <MdModeEdit className="absolute bottom-2 right-2 text-[2em] opacity-80 hover:opacity-100" />
          )}
        </label>
      </div>
    </div>
  );
};

export default Thumbnail;
