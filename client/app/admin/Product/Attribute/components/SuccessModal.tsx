"use client";

import React from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="bg-[#1a1a2e] border border-[#6E6E6E] rounded-2xl p-8 max-w-md mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <IoCheckmarkCircle className="w-16 h-16 text-green-500" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white text-center mb-4">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-300 text-center mb-8">
          {message}
        </p>

        {/* OK button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-[#028EFC] hover:bg-[#0270CC] text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
