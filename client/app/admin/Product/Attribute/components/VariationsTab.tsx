"use client";

import React, { useState, useEffect, useRef } from 'react';
import SaveButton from './SaveButton';
import SuccessModal from './SuccessModal';

interface VariationsTabProps {
  savedAttributes: Array<{ id: string; name: string; values: string[] }>;
  onSaveVariations?: (variations: Record<string, { values: string[] }>) => void;
  savedVariations?: Record<string, { values: string[] }>;
  variationUsage?: Record<string, { isInUse: boolean; productCount: number; products: Array<{ id: string; title: string }> }>;
  onCheckVariationUsage?: (attributeId: string, variation: string) => Promise<{ isInUse: boolean; productCount: number; products: Array<{ id: string; title: string }> }>;
  onVariationUsageUpdate?: (usageMap: Record<string, { isInUse: boolean; productCount: number; products: Array<{ id: string; title: string }> }>) => void;
}

const VariationsTab: React.FC<VariationsTabProps> = ({ savedAttributes, onSaveVariations, savedVariations = {}, variationUsage = {}, onCheckVariationUsage, onVariationUsageUpdate }) => {
  console.log('VariationsTab received attributes:', savedAttributes);
  console.log('VariationsTab received saved variations:', savedVariations);

  const [variations, setVariations] = useState<Record<string, { values: string[] }>>(savedVariations);
  const [editingType, setEditingType] = useState<string | null>(null);
  const [newValue, setNewValue] = useState('');
  const variationsRef = useRef(variations);

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Update ref when variations change
  useEffect(() => {
    variationsRef.current = variations;
  }, [variations]);

  // Update variations state when savedAttributes changes
  useEffect(() => {
    const initialVariations: Record<string, { values: string[] }> = {};
    savedAttributes.forEach(attr => {
      // Preserve existing variations for attributes that already exist
      if (variationsRef.current[attr.id]) {
        initialVariations[attr.id] = variationsRef.current[attr.id];
      } else {
        initialVariations[attr.id] = { values: attr.values };
      }
    });
    setVariations(initialVariations);
    console.log('Updated variations state:', initialVariations);
  }, [savedAttributes]);

  // Check usage for variations only when component loads (not on every change)
  useEffect(() => {
    const checkInitialVariationUsage = async () => {
      if (!onCheckVariationUsage) return;

      const usagePromises: Array<Promise<{ key: string; usage: any }>> = [];

      // Check usage for each variation of each attribute (only on initial load)
      Object.entries(variations).forEach(([attrId, variationData]) => {
        variationData.values.forEach(variation => {
          const key = `${attrId}-${variation}`;
          // Only check if we don't already have usage data for this variation
          if (!variationUsage[key]) {
            usagePromises.push(
              onCheckVariationUsage(attrId, variation)
                .then(usage => ({ key, usage }))
                .catch(error => {
                  console.error(`Error checking usage for variation ${variation}:`, error);
                  return { key, usage: { isInUse: false, productCount: 0, products: [] } };
                })
            );
          }
        });
      });

      if (usagePromises.length > 0) {
        try {
          const results = await Promise.all(usagePromises);
          const usageMap: Record<string, any> = {};
          results.forEach(({ key, usage }) => {
            usageMap[key] = usage;
          });

          // Update the parent component's variation usage state
          if (onVariationUsageUpdate) {
            onVariationUsageUpdate(usageMap);
          }
          console.log('Checked initial variation usage:', usageMap);
        } catch (error) {
          console.error('Error checking variation usage:', error);
        }
      }
    };

    // Only run on initial load, not on every variation change
    checkInitialVariationUsage();
  }, []); // Empty dependency array - only run once on mount

  const addVariation = (id: string) => {
    setEditingType(id);
    setNewValue('');
  };

  const closeInput = () => {
    setEditingType(null);
    setNewValue('');
  };

  const handleSubmit = async (id: string) => {
    if (newValue.trim()) {
      const currentVariations = variations[id] || { values: [] };
      const updatedVariations = {
        ...variations,
        [id]: {
          values: [...currentVariations.values, newValue.trim()]
        }
      };
      setVariations(updatedVariations);
      console.log('Added variation for attribute', id, ':', newValue.trim());
      console.log('Current variations for this attribute:', currentVariations.values);
      console.log('Updated variations:', updatedVariations);

      // Close input first
      closeInput();

      // Show success popup with small delay to ensure state is updated
      setTimeout(() => {
        setSuccessTitle('Variation Added!');
        setSuccessMessage(`Variation "${newValue.trim()}" added successfully! Click "Save Changes" to save permanently.`);
        setShowSuccessModal(true);
      }, 100);
    }
  };

  const removeVariation = async (id: string, value: string) => {
    // Check if variation is in use before removing (use cached data if available)
    const usageKey = `${id}-${value}`;
    const cachedUsage = variationUsage[usageKey];

    if (cachedUsage && cachedUsage.isInUse) {
      console.log(`Cannot remove variation "${value}" - it is being used by ${cachedUsage.productCount} product${cachedUsage.productCount !== 1 ? 's' : ''}`);
      return;
    }

    // If no cached data, check usage (but don't block removal if check fails)
    if (!cachedUsage && onCheckVariationUsage) {
      try {
        const usage = await onCheckVariationUsage(id, value);
        if (usage.isInUse) {
          console.log(`Cannot remove variation "${value}" - it is being used by ${usage.productCount} product${usage.productCount !== 1 ? 's' : ''}`);
          return;
        }
      } catch (error) {
        console.error('Error checking variation usage:', error);
        // Continue with removal if check fails
      }
    }

    const updatedVariations = {
      ...variations,
      [id]: {
        ...variations[id],
        values: variations[id].values.filter(v => v !== value)
      }
    };
    setVariations(updatedVariations);
    console.log('Removed variation for attribute', id, ':', value);

    // Save immediately to make removal permanent
    if (onSaveVariations) {
      try {
        await onSaveVariations(updatedVariations);
        console.log('Variation removed permanently from API');

        // Show success popup with small delay
        setTimeout(() => {
          setSuccessTitle('Variation Removed!');
          setSuccessMessage(`Variation "${value}" removed successfully!`);
          setShowSuccessModal(true);
        }, 100);
      } catch (error) {
        console.error('Error saving variation removal:', error);
        // Show error message to user
        alert('Error removing variation. Please try again.');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSubmit(id);
    }
  };

  const handleSaveChanges = async () => {
    console.log('Saving variations...', variations);

    let hasChanges = false;
    let updatedVariations = { ...variations };

    // If there's a variation being entered, add it first
    if (editingType && newValue.trim()) {
      const currentVariations = variations[editingType] || { values: [] };
      updatedVariations = {
        ...variations,
        [editingType]: {
          values: [...currentVariations.values, newValue.trim()]
        }
      };
      setVariations(updatedVariations);
      console.log('Added variation from input field:', newValue.trim());

      // Clear the input field
      setNewValue('');
      setEditingType(null);
      hasChanges = true;
    }

    // Check if there are any variations to save
    const hasVariations = Object.values(updatedVariations).some(v => v.values.length > 0);

    if (!hasVariations) {
      console.log('No variations to save');
      return;
    }

    // Always save current state to ensure consistency
    if (onSaveVariations) {
      try {
        await onSaveVariations(updatedVariations);
        console.log('Variations saved');
        setSuccessTitle('Variations Saved!');
        setSuccessMessage('All variations have been saved successfully!');
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Error saving variations:', error);
        alert('Error saving variations. Please try again.');
      }
    }

    console.log('Variations saved:', updatedVariations);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#E5E5E5]">Variations</h2>

      <div className="space-y-6">
        {savedAttributes.map((attribute) => {
          const currentVariations = variations[attribute.id] || { values: [] };
          console.log(`Rendering attribute ${attribute.name} with variations:`, currentVariations);

          return (
            <div key={attribute.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-lg font-medium text-white">{attribute.name}</label>
                <button
                  onClick={() => addVariation(attribute.id)}
                  className="bg-[#028EFC] text-white px-3 py-2  transition-colors"
                >
                  Add
                </button>
              </div>
              {editingType === attribute.id && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder={`Enter ${attribute.name.toLowerCase()} variation`}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, attribute.id)}
                    className="flex-1 px-4 py-2 border border-[#6E6E6E] rounded-xl text-white placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#3B82F6] transition-colors"
                    autoFocus
                  />
                  <button
                    onClick={closeInput}
                    className="text-red-500 hover:text-red-400 transition-colors p-2"
                  >
                    ✕
                  </button>
                </div>
              )}
              {currentVariations.values.map((value, index) => {
                const usageKey = `${attribute.id}-${value}`;
                const usage = variationUsage[usageKey];
                const isInUse = usage?.isInUse || false;
                const productCount = usage?.productCount || 0;

                return (
                  <div key={index} className="flex items-center justify-between ml-4">
                    <div className="flex flex-col">
                      <span className="text-white">{value}</span>
                      {isInUse && (
                        <span className="text-yellow-400 text-xs">
                          Used by {productCount} product{productCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeVariation(attribute.id, value)}
                      disabled={isInUse}
                      className={`text-sm px-3 py-1 rounded ${
                        isInUse
                          ? 'text-gray-500 bg-gray-700 cursor-not-allowed'
                          : 'text-red-500 hover:text-red-400 hover:bg-red-900/20'
                      }`}
                      title={isInUse ? `Cannot delete: Used by ${productCount} product${productCount !== 1 ? 's' : ''}` : 'Remove variation'}
                    >
                      {isInUse ? 'In Use' : 'Remove'}
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-end pt-6">
        <SaveButton identifier="save-variations-btn" buttonText="Save Changes" onClick={handleSaveChanges} />
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successTitle}
        message={successMessage}
      />
    </div>
  );
};

export default VariationsTab;
