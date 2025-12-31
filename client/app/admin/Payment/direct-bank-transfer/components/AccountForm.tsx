"use client";

import React from "react";

interface AccountFormProps {
  title: string;
  onTitleChange: (value: string) => void;
}

export default function AccountForm({ title, onTitleChange }: AccountFormProps) {
  return (
    <>
      {/* Title input */}
      <div className="mb-8">
        <label className="block text-white text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-4 py-3 border border-[#028EFC] rounded-lg text-sm bg-transparent text-white placeholder:text-[#AEB9E1]"
          placeholder="Direct bank transfer"
        />
      </div>
    </>
  );
}
