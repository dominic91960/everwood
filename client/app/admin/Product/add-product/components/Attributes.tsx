"use client";

import React, { useState, useEffect } from "react";
import { IProductAttribute } from "@/types/product-attribute";
import { ISimpleProductPayloadAttribute } from "@/types/product";

interface AttributesProps {
  attributeData: IProductAttribute[];
  onProductAttributeChange: (
    attributeData: ISimpleProductPayloadAttribute[]
  ) => void;
}

const Attributes: React.FC<AttributesProps> = ({
  attributeData,
  onProductAttributeChange,
}) => {
  const [enabledAttributes, setEnabledAttributes] = useState<
    Record<string, boolean>
  >({});
  const [selectedValues, setSelectedValues] = useState<
    Record<string, string[]>
  >({});
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".multi-select-container")) {
        setOpenDropdowns({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper function to toggle attribute enabled state
  const toggleAttribute = (attributeId: string) => {
    const newEnabledAttributes = {
      ...enabledAttributes,
      [attributeId]: !enabledAttributes[attributeId],
    };
    setEnabledAttributes(newEnabledAttributes);
    notifyParent(newEnabledAttributes, selectedValues);
  };

  // Helper function to toggle selected value in multi-select
  const toggleSelectedValue = (attributeId: string, value: string) => {
    const currentValues = selectedValues[attributeId] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    const newSelectedValues = {
      ...selectedValues,
      [attributeId]: newValues,
    };
    setSelectedValues(newSelectedValues);
    notifyParent(enabledAttributes, newSelectedValues);
  };

  // Helper function to remove a selected value
  const removeSelectedValue = (attributeId: string, value: string) => {
    const currentValues = selectedValues[attributeId] || [];
    const newValues = currentValues.filter((v) => v !== value);

    const newSelectedValues = {
      ...selectedValues,
      [attributeId]: newValues,
    };
    setSelectedValues(newSelectedValues);
    notifyParent(enabledAttributes, newSelectedValues);
  };

  // Helper function to toggle dropdown
  const toggleDropdown = (attributeId: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [attributeId]: !prev[attributeId],
    }));
  };

  // Helper function to select all values for an attribute
  const selectAllValues = (attributeId: string) => {
    const attribute = attributeData.find((attr) => attr._id === attributeId);
    if (attribute) {
      const newSelectedValues = {
        ...selectedValues,
        [attributeId]: [...attribute.variations],
      };
      setSelectedValues(newSelectedValues);
      notifyParent(enabledAttributes, newSelectedValues);
    }
  };

  // Helper function to deselect all values for an attribute
  const deselectAllValues = (attributeId: string) => {
    const newSelectedValues = {
      ...selectedValues,
      [attributeId]: [],
    };
    setSelectedValues(newSelectedValues);
    notifyParent(enabledAttributes, newSelectedValues);
  };

  // Helper function to check if all values are selected
  const areAllValuesSelected = (attributeId: string) => {
    const attribute = attributeData.find((attr) => attr._id === attributeId);
    if (!attribute) return false;
    const currentValues = selectedValues[attributeId] || [];
    return currentValues.length === attribute.variations.length;
  };

  // Notify parent component of changes
  const notifyParent = (
    enabled: Record<string, boolean>,
    selected: Record<string, string[]>
  ) => {
    const data: ISimpleProductPayloadAttribute[] = attributeData
      .filter((attr) => enabled[attr._id])
      .map((attr) => ({
        attribute: attr._id,
        selectedVariations: selected[attr._id] || [],
      }));
    onProductAttributeChange(data);
  };

  return (
    <div>
      <h3 className="mb-6 text-[24px] font-semibold wrap-break-word text-white">
        Attributes
      </h3>
      <div className="rounded-3xl border border-[#6E6E6E] bg-black/30 p-6 backdrop-blur-[500px]">
        <div className="space-y-6">
          {/* Display all attributes with toggle switches */}
          {attributeData.map((attribute) => (
            <div key={attribute._id}>
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm font-medium text-white">
                  {attribute.name}
                </label>
                {/* Toggle Switch for all attributes */}
                <button
                  onClick={() => toggleAttribute(attribute._id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enabledAttributes[attribute._id]
                      ? "bg-blue-500"
                      : "border border-[#6E6E6E] bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enabledAttributes[attribute._id]
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {enabledAttributes[attribute._id] && (
                <div className="multi-select-container relative">
                  {/* Multi-select container */}
                  <div
                    className="min-h-12 w-full cursor-pointer rounded-lg border border-[#6E6E6E] bg-black/30 px-4 py-3 text-white transition-colors focus-within:border-[#3B82F6]"
                    onClick={() => toggleDropdown(attribute._id)}
                  >
                    {/* Selected tags */}
                    <div className="mb-2 flex flex-wrap gap-2">
                      {(selectedValues[attribute._id] || []).map(
                        (value, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1 text-sm text-white"
                          >
                            {value}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSelectedValue(attribute._id, value);
                              }}
                              className="ml-1 rounded-full p-0.5 hover:bg-blue-600"
                            >
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </span>
                        )
                      )}
                    </div>

                    {/* Placeholder or dropdown trigger */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {(selectedValues[attribute._id] || []).length === 0
                          ? `Select ${attribute.name}`
                          : `${
                              (selectedValues[attribute._id] || []).length
                            } selected`}
                      </span>
                      <svg
                        className={`h-4 w-4 text-white transition-transform ${
                          openDropdowns[attribute._id] ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Dropdown menu */}
                  {openDropdowns[attribute._id] && (
                    <div className="z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-[#6E6E6E] bg-black/90 shadow-lg backdrop-blur-sm">
                      {/* Select All / Deselect All option */}
                      <div
                        className="flex cursor-pointer items-center justify-between border-b border-gray-600 px-4 py-3 transition-colors hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (areAllValuesSelected(attribute._id)) {
                            deselectAllValues(attribute._id);
                          } else {
                            selectAllValues(attribute._id);
                          }
                        }}
                      >
                        <span className="text-sm font-medium text-white">
                          {areAllValuesSelected(attribute._id)
                            ? "Deselect All"
                            : "Select All"}
                        </span>
                        {areAllValuesSelected(attribute._id) && (
                          <svg
                            className="h-4 w-4 text-blue-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Individual options */}
                      {attribute.variations.map((variation, index) => {
                        const isSelected = (
                          selectedValues[attribute._id] || []
                        ).includes(variation);
                        return (
                          <div
                            key={index}
                            className={`flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-gray-700 ${
                              isSelected ? "bg-blue-500/20" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelectedValue(attribute._id, variation);
                            }}
                          >
                            <span className="text-sm text-white">
                              {variation}
                            </span>
                            {isSelected && (
                              <svg
                                className="h-4 w-4 text-blue-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Show message if no attributes found */}
          {attributeData.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">
                No attributes found. Please create attributes first in the
                Attributes management page.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attributes;
