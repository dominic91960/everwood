"use client";

import React, { useState, useEffect } from 'react'
import AddButton from './AddButton'
import { categoryApi, Category as ApiCategory } from '../../Category/api/categoryApi'

// Define Category type for this component
type Category = {
  id: string;
  categoryName: string;
  description: string;
};

interface PublishingMetadataProps {
  onPublishingDataChange: (data: {
    status: string;
    selectedCategories: string[];
  }) => void;
  onSubmit?: () => void;
  loading?: boolean;
}

const PublishingMetadata: React.FC<PublishingMetadataProps> = ({ onPublishingDataChange, onSubmit, loading = false }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [status, setStatus] = useState('Draft');
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert API Category to Component Category format
  const convertApiToComponent = (apiCategory: ApiCategory): Category => ({
    id: apiCategory._id,
    categoryName: apiCategory.name,
    description: apiCategory.description,
  });

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  // Notify parent component when data changes
  useEffect(() => {
    onPublishingDataChange({
      status,
      selectedCategories
    });
  }, [status, selectedCategories, onPublishingDataChange]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const apiData = await categoryApi.getCategories();
      const convertedData = apiData.map(convertApiToComponent);
      setCategories(convertedData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Handle category selection
  const handleCategoryToggle = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelectedCategories);
  };

  // Handle status change
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  return (
    <div className="space-y-4">
      {/* Publish Section */}
      <div className=" p-4 rounded-3xl border border-[#172D6D] bg-black/30 backdrop-blur-[500px]">
        <h3 className=" font-medium text-[#FFFFFF] text-[17px] mb-4">Publish</h3>
        <div className="space-y-4">
          <div>
            <select 
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-3 rounded-lg border border-[#172D6D]  focus:outline-none  focus:ring-blue-500 focus:border-[#172D6D] text-white placeholder:text-sm text-sm  bg-black/30 backdrop-blur-[500px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="Private">Private</option>
              <option value="Public">Public</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <AddButton 
            identifier="add-product-btn" 
            buttonText="Add Product" 
            onClick={onSubmit}
            loading={loading}
            disabled={loading}
          />
        </div>
      </div>

      {/* Category Section */}
      <div className="border border-[#172D6D] bg-black/30 backdrop-blur-[500px] p-4 rounded-3xl">
        <h3 className="text-lg font-medium text-white mb-4">Category</h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-lg font-medium text-white mb-3">All categories</h4>
            <div className="border border-[#172D6D]  p-4 rounded-lg">
              <div className="max-h-32 overflow-y-auto">
                {categoriesLoading ? (
                  <div className="text-center text-gray-400 text-sm">Loading categories...</div>
                ) : error ? (
                  <div className="text-center text-red-400 text-sm">Error: {error}</div>
                ) : categories.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm">No categories found</div>
                ) : (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                          disabled={loading}
                          className="w-4 h-4 text-white bg-transparent border border-white rounded focus:ring-white focus:ring-1 appearance-none checked:bg-white checked:after:content-['✓'] checked:after:text-black checked:after:absolute checked:after:text-xs checked:after:font-bold checked:after:leading-none checked:after:top-0.5 checked:after:left-0.5 relative disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-white">
                          {category.categoryName}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublishingMetadata 