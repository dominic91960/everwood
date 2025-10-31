import { useState, useEffect } from "react";

interface TagInputProps {
  onTagsChange: (tags: string[]) => void;
  initialTags?: string[];
  placeholder: string;
  isEdit: boolean;
}

const TagInput = ({
  onTagsChange,
  initialTags = [],
  placeholder,
  isEdit,
}: TagInputProps) => {
  // Sample static tags - replace with your desired tags
  const staticTags = [
    "School",
    "Education",
    "Students",
    "Teachers",
    "Activities",
    "Learning",
    "Development",
    "Community",
    "Events",
    "News"
  ];

  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  const addNewTag = (newTag: string) => {
    const trimmedTag = newTag.trim();
    if (!trimmedTag) return;

    if (!tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      onTagsChange(newTags);
    }
    
    setInputValue("");
    setShowDropdown(false);
  };

  const toggleTag = (tag: string) => {
    const newTags = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];

    setTags(newTags);
    onTagsChange(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewTag(inputValue.trim());
    }
  };

  // Filter tags based on input
  const filteredTags = staticTags.filter(tag =>
    tag.toLowerCase().includes(inputValue.toLowerCase()) &&
    !tags.includes(tag)
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Tags</h2>
      <div className="space-y-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full rounded-3xl placeholder-shown:[text-indent:5%] border border-[#70BDD1] p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isEdit}
        />

        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
            >
              {tag}
              <button
                onClick={() => toggleTag(tag)}
                className="ml-2 text-blue-800 hover:text-blue-900 focus:outline-none"
              >
                ✖
              </button>
            </span>
          ))}
        </div>

        {/* Dropdown with checkboxes */}
        {showDropdown && (
          <div className="mt-2 rounded-lg border border-[#70BDD1] h-[200px] overflow-auto">
            {filteredTags.map((tag) => (
              <label
                key={tag}
                className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={tags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isEdit}
                />
                <span>{tag}</span>
              </label>
            ))}
            
            {filteredTags.length === 0 && inputValue && (
              <div className="px-4 py-2 text-gray-500">
                Press Enter to create &quot;<strong>{inputValue}</strong>&quot;
              </div>
            )}
            
            <div
              onClick={() => setShowDropdown(false)}
              className="sticky bottom-0 cursor-pointer px-4 py-2 text-gray-500 hover:bg-gray-100 bg-white border-t"
            >
              Close
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagInput;