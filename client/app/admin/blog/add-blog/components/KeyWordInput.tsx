import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios-instance";

interface KeywordInputProps {
  onKeywordsChange: (keywords: string[]) => void;
  initialKeywords?: string[];
  placeholder: string;
}

const KeywordInput = ({ onKeywordsChange, initialKeywords = [], placeholder }: KeywordInputProps) => {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [inputValue, setInputValue] = useState("");
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (inputValue.trim()) {
      fetchSuggestions(inputValue);
      setShowDropdown(true);
    } else {
      setSuggestedKeywords([]);
      setShowDropdown(false);
    }
  }, [inputValue]);

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await axiosInstance.get("/keywords/suggest", {
        params: { query },
      });

      setSuggestedKeywords(
        Array.isArray(response.data)
          ? response.data.map((keyword: { name: string }) => keyword.name)
          : []
      );
    } catch (error) {
      console.error("Error fetching keyword suggestions:", error);
      setSuggestedKeywords([]);
    }
  };

  const addKeyword = async (newKeyword: string) => {
    if (!keywords.includes(newKeyword)) {
      const newKeywords = [...keywords, newKeyword];

      try {
        await axiosInstance.post("/keywords", { name: newKeyword });
      } catch (error) {
        console.error("Error adding new keyword:", error);
      }

      setKeywords(newKeywords);
      onKeywordsChange(newKeywords);
    }

    setInputValue("");
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      addKeyword(inputValue.trim());
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(newKeywords);
    onKeywordsChange(newKeywords);
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showDropdown && suggestedKeywords.length > 0 && (
        <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
          {suggestedKeywords.map((suggestedKeyword, index) => (
            <div
              key={index}
              onClick={() => addKeyword(suggestedKeyword)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestedKeyword}
            </div>
          ))}
          <div
            onClick={() => setShowDropdown(false)}
            className="px-4 py-2 text-gray-500 hover:bg-gray-100 cursor-pointer"
          >
            Close
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {keyword}
            <button
              onClick={() => removeKeyword(index)}
              className="ml-2 text-blue-800 hover:text-blue-900 focus:outline-none"
            >
              ✖
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default KeywordInput;