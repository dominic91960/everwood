"use client";

import React, { useState, useEffect } from 'react';
import SaveButton from './SaveButton';
import SuccessModal from './SuccessModal';

interface AttributesTabProps {
  onSaveAttributes: (attributes: Array<{ id: string; name: string; values: string[] }>) => void;
  onDeleteAttribute?: (attributeId: string) => Promise<boolean>;
  savedAttributes?: Array<{ id: string; name: string; values: string[] }>;
  attributeUsage?: Record<string, { isInUse: boolean; productCount: number; products: Array<{ id: string; title: string }> }>;
}

const AttributesTab: React.FC<AttributesTabProps> = ({ onSaveAttributes, onDeleteAttribute, savedAttributes = [], attributeUsage = {} }) => {
  const [attributes, setAttributes] = useState<Array<{ id: string; name: string; values: string[] }>>(savedAttributes);
  const [inputFields, setInputFields] = useState<Array<{ id: string; value: string }>>([]);
  const [nextId, setNextId] = useState(1); // Start from 1

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Update local attributes when savedAttributes prop changes
  useEffect(() => {
    setAttributes(savedAttributes);
  }, [savedAttributes]);

  const addAttribute = () => {
    const validInputs = inputFields.filter(input => input.value.trim());
    if (validInputs.length > 0) {
      const newAttributes = validInputs.map(input => ({
        id: `temp_${nextId}_${Date.now()}`, // Use temp_ prefix for new attributes
        name: input.value,
        values: []
      }));
      setAttributes([...attributes, ...newAttributes]);
      setNextId(nextId + validInputs.length);
      setInputFields([]);

      // Show success popup with small delay
      const attributeNames = validInputs.map(input => input.value).join(', ');
      setTimeout(() => {
        setSuccessTitle('Attributes Added!');
        setSuccessMessage(`Attributes "${attributeNames}" added successfully! Click "Save Changes" to save permanently.`);
        setShowSuccessModal(true);
      }, 100);
    }
  };

  const removeAttribute = async (id: string) => {
    console.log('Attempting to remove attribute:', id);
    console.log('onDeleteAttribute prop:', onDeleteAttribute);

    // Check if this is a temporary attribute (not yet saved to API)
    if (id.startsWith('temp_')) {
      // Just remove from local state for temporary attributes
      const updatedAttributes = attributes.filter(attr => attr.id !== id);
      setAttributes(updatedAttributes);
      console.log('Removed temporary attribute:', id);
      return;
    }

    // For existing attributes, use the delete handler from parent
    if (onDeleteAttribute) {
      console.log('Using onDeleteAttribute handler for:', id);
      try {
        const success = await onDeleteAttribute(id);
        console.log('Delete result:', success);
        if (success) {
          // Remove from local state after successful API deletion
          const updatedAttributes = attributes.filter(attr => attr.id !== id);
          setAttributes(updatedAttributes);
          console.log('Attribute permanently removed:', id);
          setTimeout(() => {
            setSuccessTitle('Attribute Removed!');
            setSuccessMessage('Attribute removed successfully!');
            setShowSuccessModal(true);
          }, 100);
        } else {
          console.error('Delete operation returned false');
          alert('Failed to remove attribute. Please try again.');
        }
      } catch (error) {
        console.error('Error removing attribute:', error);
        alert('Failed to remove attribute. Please try again.');
      }
    } else {
      console.log('No onDeleteAttribute handler, using fallback method');
      // Fallback: just remove from local state and save
      const updatedAttributes = attributes.filter(attr => attr.id !== id);
      setAttributes(updatedAttributes);
      await onSaveAttributes(updatedAttributes);
      console.log('Attribute removed (fallback method):', id);
    }
  };

  const handleAddClick = () => {
    const newInputField = {
      id: `input_${Date.now()}_${Math.random()}`,
      value: ''
    };
    setInputFields([...inputFields, newInputField]);
  };

  const updateInputValue = (id: string, value: string) => {
    setInputFields(inputFields.map(input =>
      input.id === id ? { ...input, value } : input
    ));
  };

  const removeInputField = (id: string) => {
    setInputFields(inputFields.filter(input => input.id !== id));
  };

  const handleSaveChanges = async () => {
    // Process any pending attributes from input fields
    const validInputs = inputFields.filter(input => input.value.trim());
    const newAttributes = validInputs.map((input, index) => ({
      id: `temp_${nextId + index}_${Date.now()}`, // Ensure unique IDs
      name: input.value,
      values: []
    }));

    // Combine existing attributes with new ones
    const allAttributes = [...attributes, ...newAttributes];

    // Check if there are any changes to save
    if (validInputs.length === 0) {
      console.log('No new attributes to save');
      return;
    }

    // Save all attributes
    try {
      await onSaveAttributes(allAttributes);

      // Update local state and clear input fields
      setAttributes(allAttributes);
      setNextId(nextId + validInputs.length);
      setInputFields([]);

      // Show success popup with small delay
      const attributeNames = validInputs.map(input => input.value).join(', ');
      setTimeout(() => {
        setSuccessTitle('Attributes Saved!');
        setSuccessMessage(`Attributes "${attributeNames}" saved successfully!`);
        setShowSuccessModal(true);
      }, 100);

      console.log('Saved attributes:', allAttributes);
    } catch (error) {
      console.error('Error saving attributes:', error);
      alert('Error saving attributes. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#E5E5E5]">Attributes</h2>
          <button
            onClick={handleAddClick}
            className="bg-[#028EFC] text-white px-3 py-1   transition-colors"
          >
            Add
          </button>
        </div>

        {/* Display existing attributes */}
        {attributes.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">Existing Attributes:</h3>
            {attributes.map((attr) => {
              const usage = attributeUsage[attr.id];
              const isInUse = usage?.isInUse || false;
              const productCount = usage?.productCount || 0;

              return (
                <div key={attr.id} className="flex items-center justify-between p-3 rounded-md">
                  <div className="flex flex-col">
                    <span className="text-white">{attr.name}</span>
                    {isInUse && (
                      <span className="text-yellow-400 text-xs">
                        Used by {productCount} product{productCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeAttribute(attr.id)}
                    disabled={isInUse}
                    className={`text-sm px-3 py-1 rounded ${
                      isInUse
                        ? 'text-gray-500 bg-gray-700 cursor-not-allowed'
                        : 'text-red-500 hover:text-red-400 hover:bg-red-900/20'
                    }`}
                    title={isInUse ? `Cannot delete: Used by ${productCount} product${productCount !== 1 ? 's' : ''}` : 'Remove attribute'}
                  >
                    {isInUse ? 'In Use' : 'Remove'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Add New Attributes:</h3>
          {inputFields.map((input, index) => (
            <div key={input.id} className="flex items-center space-x-2">
              <input
                type="text"
                value={input.value}
                onChange={(e) => updateInputValue(input.id, e.target.value)}

                className="px-3 py-1 border border-[#6E6E6E] rounded-md  text-white flex-1"
                placeholder="Enter attribute name"
              />
              <button
                onClick={() => removeInputField(input.id)}
                className="text-red-500 hover:text-red-700 px-2 py-2"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-end pt-6">
        <SaveButton identifier="save-attributes-btn" buttonText="Save Changes" onClick={handleSaveChanges} />
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

export default AttributesTab;
