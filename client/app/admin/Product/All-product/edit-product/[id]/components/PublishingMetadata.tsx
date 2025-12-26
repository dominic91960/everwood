"use client";

import React, { useState, useEffect } from 'react'
import AddButton from './AddButton'
import { categoryApi, Category } from '../../../../Category/api/categoryApi'

interface PublishingMetadataProps {
  initialData: {
    status: string;
    selectedCategories: string[];
  };
  onPublishingDataChange: (data: {
    status: string;
    selectedCategories: string[];
  }) => void;
  onSubmit: () => void;
  loading: boolean;
  buttonText: string;
}

const PublishingMetadata = ({ 
  initialData, 
  onPublishingDataChange, 
  onSubmit, 
  loading, 
  buttonText 
}: PublishingMetadataProps) => {
  const [status, setStatus] = useState(initialData.status);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData.selectedCategories);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Update local state when initialData changes
  useEffect(() => {
    console.log('PublishingMetadata - initialData received:', initialData);
    console.log('PublishingMetadata - status from initialData:', initialData.status);
    setStatus(initialData.status);
    setSelectedCategories(initialData.selectedCategories);
  }, [initialData]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const categoriesData = await categoryApi.getCategories();
        setCategories(categoriesData);
        setCategoriesError(null);
      } catch (err) {
        setCategoriesError(err instanceof Error ? err.message : 'Failed to fetch categories');
        console.error('Error fetching categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle status change
  const handleStatusChange = (newStatus: string) => {
    console.log('PublishingMetadata - Status changed to:', newStatus);
    setStatus(newStatus);
    onPublishingDataChange({
      status: newStatus,
      selectedCategories
    });
  };

  // Handle category selection
  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newCategories);
    onPublishingDataChange({
      status,
      selectedCategories: newCategories
    });
  };

  return (
    <div className="space-y-4">
      {/* Publish Section */}
      <div className="p-4 rounded-3xl border border-[#172D6D] bg-black/30 backdrop-blur-[500px]">
        <h3 className="font-medium text-[#FFFFFF] text-[17px] mb-4">Publish</h3>
        <div className="space-y-4">
          <div>
            <select 
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-3 rounded-lg border border-[#172D6D] focus:outline-none focus:ring-blue-500 focus:border-[#172D6D] text-white text-sm bg-black/30 backdrop-blur-[500px]"
            >
              <option value="Draft">Draft</option>
              <option value="Private">Private</option>
              <option value="Public">Public</option>
            </select>
          </div>
          {/* <div className="p-2 bg-yellow-900/20 border border-yellow-500/30 rounded">
            <p className="text-xs text-yellow-400">
              ⚠️ Note: Status field is not supported by the backend. The dropdown shows "Public" for existing products, but changes won't be saved. Other fields will update successfully.
            </p>
          </div> */}
          <AddButton 
            identifier="update-product-btn" 
            buttonText={buttonText}
            onClick={onSubmit}
            loading={loading}
          />
        </div>
      </div>

      {/* Category Section */}
      <div className="border border-[#172D6D] bg-black/30 backdrop-blur-[500px] p-4 rounded-3xl">
        <h3 className="text-lg font-medium text-white mb-4">Category</h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-lg font-medium text-white mb-3">All categories</h4>
            <div className="border border-[#172D6D] p-4 rounded-lg">
              <div className="max-h-32 overflow-y-auto">
                {categoriesLoading ? (
                  <div className="text-center text-gray-400 text-sm">Loading categories...</div>
                ) : categoriesError ? (
                  <div className="text-center text-red-400 text-sm">Error: {categoriesError}</div>
                ) : categories.length > 0 ? (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category._id}`}
                          checked={selectedCategories.includes(category._id)}
                          onChange={() => handleCategoryToggle(category._id)}
                          className="w-4 h-4 text-white bg-transparent border border-white rounded focus:ring-white focus:ring-1 appearance-none checked:bg-white checked:after:content-['✓'] checked:after:text-black checked:after:absolute checked:after:text-xs checked:after:font-bold checked:after:leading-none checked:after:top-0.5 checked:after:left-0.5 relative"
                        />
                        <label htmlFor={`category-${category._id}`} className="ml-2 text-sm text-white">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No categories available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      {/* <div className="border border-[#172D6D] bg-black/30 backdrop-blur-[500px] p-4 rounded-3xl">
        <h3 className="text-lg font-medium text-white mb-4">Tags</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Enter Tag..."
            className="w-full px-3 py-3 text-sm  border border-[#172D6D] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 placeholder:text-sm"
          />
          <div>
            <h4 className="text-lg font-medium text-white mb-3">All tags</h4>
            <div className="border border-[#172D6D]  p-4 rounded-lg">
              <div className="max-h-32 overflow-y-auto">
                <div className="space-y-2">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`tag-${i}`}
                        className="w-4 h-4 text-white bg-transparent border border-white rounded focus:ring-white focus:ring-1 appearance-none checked:bg-white checked:after:content-['✓'] checked:after:text-black checked:after:absolute checked:after:text-xs checked:after:font-bold checked:after:leading-none checked:after:top-0.5 checked:after:left-0.5 relative"
                      />
                      <label htmlFor={`tag-${i}`} className="ml-2 text-sm text-white">
                        Hip hop
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* SEO Settings */}
      {/* <div className="border border-[#172D6D] bg-black/30 backdrop-blur-[500px] p-4 rounded-3xl">
        <h3 className="text-lg font-medium text-white mb-4">SEO Setting</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
              SEO Title
            </label>
            <input
              type="text"
              className="w-full px-3  py-3 text-sm  border border-[#172D6D]  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 placeholder:text-sm"
              placeholder="Enter SEO title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
              Meta keyword
            </label>
            <input
              type="text"
              className="w-full px-3  py-3 text-sm    border border-[#172D6D]  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 placeholder:text-sm"
              placeholder="Enter meta keywords"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
              Meta description
            </label>
            <textarea
              rows={3}
              className="w-full px-3  py-3 text-sm   border border-[#172D6D]  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 placeholder:text-sm resize-none"
              placeholder="Enter meta description"
            />
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default PublishingMetadata 