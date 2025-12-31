"use client";

import React from "react";
import { FiTrash2, FiX } from "react-icons/fi";

type BankAccount = {
  _id: string;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  branchName: string;
};

interface DeleteUserModalProps {
  isOpen: boolean;
  data: BankAccount | undefined;
  onRemoveAccount: (id: string) => void;
  onClose: () => void;
}

const DeleteModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  data,
  onRemoveAccount,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleSubmit = async () => {
    await onRemoveAccount(data?._id ?? "");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-md rounded-xl border border-[#6E6E6E] bg-[#0000004D]/90 p-6 backdrop-blur-[500px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] transition-colors hover:text-white"
        >
          <FiX size={20} />
        </button>

        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-500 bg-red-500/20">
            <FiTrash2 size={32} className="text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-center text-xl font-bold text-[#E5E5E5]">
          Delete Account
        </h3>

        {/* Message */}
        <p className="mb-6 text-center text-[#94A3B8]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">
            {data?.accountNumber ?? ""}
          </span>
          ? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-md bg-[#334155] px-4 py-2 text-white transition-colors hover:bg-[#475569] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            <>
              <FiTrash2 size={16} />
              Delete
            </>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
