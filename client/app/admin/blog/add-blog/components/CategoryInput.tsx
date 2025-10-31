import { useState, useEffect } from "react";

interface CategoryInputProps {
  onCategoriesChange: (categories: string[]) => void;
  initialCategories?: string[];
  isEdit?: boolean;
}

const CategoryInput = ({
  onCategoriesChange,
  initialCategories = [],
  isEdit
}: CategoryInputProps) => {
  // Sample static categories - replace with your desired categories
  const staticCategories = [
    "News",
    "Events",
    "Announcements",
    "School Life",
    "Academic",
    "Sports",
    "Arts",
    "Community"
  ];

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(true);

  useEffect(() => {
    setSelectedCategories(initialCategories);
  }, [initialCategories]);

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newCategories);
    onCategoriesChange(newCategories);
  };

  // Filter categories based on search input
  const filteredCategories = staticCategories.filter(cat =>
    cat.toLowerCase().includes(inputValue.toLowerCase()) &&
    !selectedCategories.includes(cat)
  );

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-[#201F31]">Blog Categories</h2>

      <div className="relative w-full">
        {/* Selected categories */}
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
            >
              {category}
              <button
                onClick={() => toggleCategory(category)}
                className="ml-2 text-green-800 hover:text-green-900 focus:outline-none"
              >
                ✖
              </button>
            </span>
          ))}
        </div>

        {/* Search input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder="Enter category..."
          className="w-full rounded-3xl border-[#4796A9] border p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-shown:[text-indent:5%]"
          disabled={isEdit}
        />

        <div>
          <h2 className="text-xl font-semibold mt-[20px] text-[#201F31]">All categories</h2>
        </div>

        {/* Category dropdown */}
        {showDropdown && (
          <div className="mt-2 rounded-lg border border-[#70BDD1] h-[200px] overflow-auto">
            {filteredCategories.map((category) => (
              <label
                key={category}
                className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isEdit}
                />
                {category}
              </label>
            ))}

            {filteredCategories.length === 0 && (
              <div className="px-4 py-2 text-gray-500">
                {inputValue ? "No categories found" : "No categories available"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryInput;