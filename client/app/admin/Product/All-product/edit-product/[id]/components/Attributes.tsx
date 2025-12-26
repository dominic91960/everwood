"use client";

import React, { useState, useEffect } from 'react'

// API functions for attributes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const attributeAPI = {
  getAttributes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/attribute`);
      if (!response.ok) throw new Error('Failed to fetch attributes');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching attributes:', error);
      throw error;
    }
  },
};

interface AttributesProps {
  initialAttributes: Record<string, { enabled: boolean; selectedValues: string[] }>;
  onAttributesChange: (attributes: Record<string, { enabled: boolean; selectedValues: string[] }>) => void;
}

const Attributes = ({ initialAttributes, onAttributesChange }: AttributesProps) => {
  const [attributes, setAttributes] = useState(initialAttributes);
  const [availableAttributes, setAvailableAttributes] = useState<Array<{ _id: string; name: string; variations: string[] }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update local state when initialAttributes changes
  useEffect(() => {
    setAttributes(initialAttributes);
  }, [initialAttributes]);

  // Fetch attributes from API
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        setLoading(true);
        const attributesData = await attributeAPI.getAttributes();
        setAvailableAttributes(attributesData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch attributes');
        console.error('Error fetching attributes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttributes();
  }, []);

  // Handle attribute value changes
  const handleAttributeChange = (attributeId: string, value: string, checked: boolean) => {
    const currentAttribute = attributes[attributeId] || { enabled: true, selectedValues: [] };
    const newSelectedValues = checked
      ? [...currentAttribute.selectedValues, value]
      : currentAttribute.selectedValues.filter(v => v !== value);

    const newAttributes = {
      ...attributes,
      [attributeId]: {
        ...currentAttribute,
        selectedValues: newSelectedValues
      }
    };

    setAttributes(newAttributes);
    onAttributesChange(newAttributes);
  };

  // Handle attribute enable/disable
  const handleAttributeToggle = (attributeId: string, enabled: boolean) => {
    const newAttributes = {
      ...attributes,
      [attributeId]: {
        ...attributes[attributeId],
        enabled
      }
    };

    setAttributes(newAttributes);
    onAttributesChange(newAttributes);
  };

  return (
    <div>
      <h3 className="text-white text-[24px] font-semibold mb-6 break-words">Attributes</h3>
      <div className="rounded-3xl border border-[#172D6D] bg-black/30 backdrop-blur-[500px] p-6 overflow-hidden">
        {loading ? (
          <div className="text-center text-gray-400 text-sm">Loading attributes...</div>
        ) : error ? (
          <div className="text-center text-red-400 text-sm">Error: {error}</div>
        ) : availableAttributes.length === 0 ? (
          <div className="text-center text-gray-400 text-sm">No attributes available</div>
        ) : (
          <div className="space-y-6">
            {availableAttributes.map((attr) => {
              const currentAttribute = attributes[attr._id] || { enabled: true, selectedValues: [] };
              
              return (
                <div key={attr._id}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-white text-sm font-medium">
                      {attr.name}
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={currentAttribute.enabled}
                        onChange={(e) => handleAttributeToggle(attr._id, e.target.checked)}
                        className="w-4 h-4 text-white bg-transparent border border-white rounded focus:ring-white focus:ring-1 appearance-none checked:bg-white checked:after:content-['✓'] checked:after:text-black checked:after:absolute checked:after:text-xs checked:after:font-bold checked:after:leading-none checked:after:top-0.5 checked:after:left-0.5 relative"
                      />
                      <span className="ml-2 text-xs text-gray-400">Enable</span>
                    </div>
                  </div>
                  
                  {currentAttribute.enabled && (
                    <div className="grid grid-cols-2 gap-2">
                      {attr.variations && attr.variations.length > 0 ? (
                        // Remove duplicates and map with unique keys
                        [...new Set(attr.variations)].map((value, index) => (
                          <div key={`${attr._id}-${value}-${index}`} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`${attr._id}-${value}-${index}`}
                              checked={currentAttribute.selectedValues.includes(value)}
                              onChange={(e) => handleAttributeChange(attr._id, value, e.target.checked)}
                              className="w-4 h-4 text-white bg-transparent border border-white rounded focus:ring-white focus:ring-1 appearance-none checked:bg-white checked:after:content-['✓'] checked:after:text-black checked:after:absolute checked:after:text-xs checked:after:font-bold checked:after:leading-none checked:after:top-0.5 checked:after:left-0.5 relative"
                            />
                            <label htmlFor={`${attr._id}-${value}-${index}`} className="ml-2 text-sm text-white">
                              {value}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm col-span-2">No variations available for this attribute</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Attributes 