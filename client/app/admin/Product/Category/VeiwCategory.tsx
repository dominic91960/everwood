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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
      <div className="relative z-[9999] w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-1 top-1 rounded-full border border-gray-200 bg-white p-2 text-gray-600 hover:text-gray-900"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="mb-5 text-[34px] font-bold text-gray-900">View Category</h2>

        {/* Category Details */}
        <div className="space-y-4">
          {/* Name Display */}
          <div className="space-y-2">
            <label className="block text-[17px] font-medium text-gray-700">Name</label>
            <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900">
              {category.categoryName}
            </div>
          </div>

          {/* Description Display */}
          <div className="space-y-2">
            <label className="block text-[17px] font-medium text-gray-700">Description</label>
            <div className="mt-1 block h-24 w-full overflow-y-auto rounded-sm border border-gray-300 bg-white p-3 text-sm text-gray-900">
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
