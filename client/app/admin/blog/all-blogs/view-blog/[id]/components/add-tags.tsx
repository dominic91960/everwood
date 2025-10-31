import React, { useState } from "react";
import Updatebutton1 from './Updatebutton1'
import { X } from "lucide-react";
interface AddTagFormProps {
  onSubmit: (name: string, description: string) => void;
  onClose: () => void; // Close function passed as prop
}

const AddTagForm: React.FC<AddTagFormProps> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, description);
  };

  return (
    <div className="fixed inset-0 bg-[#00000040] backdrop-blur-sm flex items-center justify-center z-50">


    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-lg z-50 ">
      {/* Close Icon */}
      <button
        onClick={onClose}
        className="absolute right-1 top-1 border rounded-full p-2 bg-gray-200 text-gray-500 hover:text-gray-700"
      >
        <X size={20} />
      </button>

      <h2 className="text-[32px] font-bold text-[#000000] mb-4">Add New Tags</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-1/2 p-1 border border-[#4796A9] rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-[#4796A9] rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Updatebutton1 identifier="add-category" buttonText="Update" onClick={handleSubmit} />
      </div>
    </form>
  </div>

  );
};

export default AddTagForm;
