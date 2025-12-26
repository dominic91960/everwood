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
    <div className="fixed inset-0 bg-[#00000033] flex items-center justify-center z-[10000]">
      <div className="relative w-full max-w-2xl rounded-3xl bg-black/20 border border-[#172D6D] backdrop-blur-[500px]  p-6 shadow-lg z-[9999] ">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-1 top-1 border-[#028EFC]/20 rounded-full p-2 bg-[#028EFC]/20 text-white "
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-[34px] font-bold mb-5 text-[#FFFFFF]">Add New Category</h2>

        {/* Form */}
        <div className="space-y-4">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-[17px] font-medium text-[#FFFFFF]">Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-[#172D6D] p-2 text-sm"
            
              disabled={loading}
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="block text-[17px] font-medium text-[#FFFFFF]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-sm border border-[#172D6D] p-2 text-sm h-24 "
            
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
