// components/MetaKeywordsInput.tsx
"use client";

import { useState, KeyboardEvent } from "react";

interface MetaKeywordsInputProps {
  selectedKeywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  maxKeywords?: number;
  placeholder?: string;
  isEdit: boolean;
}

const MetaKeywordsInput = ({
  selectedKeywords,
  onKeywordsChange,
  maxKeywords = 10,
  placeholder = "Add meta keywords...",
  isEdit
}: MetaKeywordsInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddKeyword = () => {
    const keyword = inputValue.trim();
    if (
      keyword &&
      !selectedKeywords.includes(keyword) &&
      selectedKeywords.length < maxKeywords
    ) {
      onKeywordsChange([...selectedKeywords, keyword]);
      setInputValue("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const newKeywords = selectedKeywords.filter((_, i) => i !== index);
    onKeywordsChange(newKeywords);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedKeywords.map((keyword, index) => (
          <span
            key={index}
            className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm text-red-800"
          >
            {keyword}
            <button
              type="button"
              onClick={() => handleRemoveKeyword(index)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`${placeholder} (Press Enter to add)`}
        className="w-full rounded-3xl border-[#70BDD1] border p-2"
        disabled={(selectedKeywords.length >= maxKeywords) || isEdit}
      />
      
      
      
      <div className="text-sm text-gray-500">
        {selectedKeywords.length}/{maxKeywords} keywords
      </div>
    </div>
  );
};

export default MetaKeywordsInput;