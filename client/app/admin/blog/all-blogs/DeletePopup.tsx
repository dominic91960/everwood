"use client";

import { RiDeleteBin6Line } from "react-icons/ri";

interface DeletePopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeletePopup({ open, onClose, onConfirm, loading }: DeletePopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 shadow-lg w-80 text-center relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-gray-900">
          ✖
        </button>

        {/* Trash Icon */}
        <div className="flex justify-center text-red-500">
          <RiDeleteBin6Line size={50} />
        </div>

        {/* Confirmation Message */}
        <h2 className="text-lg font-semibold mt-3">
        Are you sure you want to delete
        </h2>

        {/* Action Buttons */}
        <div className="mt-4 grid gap-2">
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded-xl w-full hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button 
            className="text-gray-600 px-4 py-2 rounded-xl w-full hover:bg-gray-100"
            onClick={onClose}
            disabled={loading}
          >
            Keep Data
          </button>
        </div>
      </div>
    </div>
  );
} 