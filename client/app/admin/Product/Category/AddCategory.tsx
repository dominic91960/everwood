import React, { useState } from "react";
import { X } from "lucide-react";
import Updatebutton from "./Updatebutton";
import { categoryApi, Category } from "./api/categoryApi";

interface AddCategoryProps {
  onClose: () => void;
  onCategoryAdded: (newCategory: Category) => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({ onClose, onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      alert("Category name is required!");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Call the real API
      const newCategory = await categoryApi.createCategory({
        name: categoryName,
        description,
      });

      setCategoryName("");
      setDescription("");
      onCategoryAdded(newCategory);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
      <div className="relative z-[9999] w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-xl ">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-1 top-1 rounded-full border border-gray-200 bg-white p-2 text-gray-600 hover:text-gray-900"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="mb-5 text-[34px] font-bold text-gray-900">Add New Category</h2>

        {/* Form */}
        <div className="space-y-4">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-[17px] font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-900"

              disabled={loading}
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="block text-[17px] font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block h-24 w-full rounded-sm border border-gray-300 bg-white p-2 text-sm text-gray-900 "

              disabled={loading}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end">
          <Updatebutton identifier="add-category" buttonText={loading ? "Adding..." : "Add Category"} onClick={handleSubmit} disabled={loading} />
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
