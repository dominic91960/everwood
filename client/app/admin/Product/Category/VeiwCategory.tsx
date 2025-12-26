import React from "react";
import { X } from "lucide-react";

interface Category {
  id: string;
  categoryName: string;
  description: string;
}

interface ViewCategoryProps {
  onClose: () => void;
  category: Category;
}

const ViewCategory: React.FC<ViewCategoryProps> = ({ onClose, category }) => {
  return (
    <div className="fixed inset-0 bg-[#00000033] flex items-center justify-center z-[10000]">
      <div className="relative w-full max-w-2xl rounded-3xl bg-black/20 border border-[#172D6D] backdrop-blur-[500px] p-6 shadow-lg z-[9999]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-1 top-1 border-[#028EFC]/20 rounded-full p-2 bg-[#028EFC]/20 text-white"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-[34px] font-bold mb-5 text-[#FFFFFF]">View Category</h2>

        {/* Category Details */}
        <div className="space-y-4">
          {/* Name Display */}
          <div className="space-y-2">
            <label className="block text-[17px] font-medium text-[#FFFFFF]">Name</label>
            <div className="mt-1 block w-full rounded-lg border border-[#172D6D] p-3 text-sm bg-transparent text-white">
              {category.categoryName}
            </div>
          </div>

          {/* Description Display */}
          <div className="space-y-2">
            <label className="block text-[17px] font-medium text-[#FFFFFF]">Description</label>
            <div className="mt-1 block w-full rounded-sm border border-[#172D6D] p-3 text-sm h-24 bg-transparent text-white overflow-y-auto">
              {category.description}
            </div>
          </div>

          
         
        </div>

        {/* Action Buttons */}
       
      </div>
    </div>
  );
};

export default ViewCategory;
