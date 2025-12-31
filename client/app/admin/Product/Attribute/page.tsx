"use client";

import React, { useState, useEffect } from 'react';
import AttributesTab from './components/AttributesTab';
import VariationsTab from './components/VariationsTab';
import SuccessModal from './components/SuccessModal';
import { attributeApi, AttributeUsageInfo, VariationUsageInfo } from '@/lib/api/attributeApi';

// Use the imported attributeApi

function AttributePage() {
  const [activeTab, setActiveTab] = useState('attributes');
  const [savedAttributes, setSavedAttributes] = useState<Array<{ id: string; name: string; values: string[] }>>([]);
  const [savedVariations, setSavedVariations] = useState<Record<string, { values: string[] }>>({});
  const [loading, setLoading] = useState(false);
  const [attributeUsage, setAttributeUsage] = useState<Record<string, AttributeUsageInfo>>({});
  const [variationUsage, setVariationUsage] = useState<Record<string, VariationUsageInfo>>({});

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Listen for product deletion events to refresh usage data
  useEffect(() => {
    const handleProductDeleted = () => {
      console.log('Product deleted, refreshing attribute usage...');
      // Refresh usage data for all attributes
      const refreshUsage = async () => {
        try {
          const usagePromises = savedAttributes.map(async (attr) => {
            try {
              const usage = await attributeApi.checkAttributeUsage(attr.id);
              return { attributeId: attr.id, usage };
            } catch (error) {
              console.error(`Error checking usage for attribute ${attr.id}:`, error);
              return { attributeId: attr.id, usage: { isInUse: false, productCount: 0, products: [] } };
            }
          });

          const usageResults = await Promise.all(usagePromises);
          const usageMap: Record<string, AttributeUsageInfo> = {};
          usageResults.forEach(({ attributeId, usage }) => {
            usageMap[attributeId] = usage;
          });
          setAttributeUsage(usageMap);
        } catch (error) {
          console.error('Error refreshing usage data:', error);
        }
      };

      refreshUsage();
    };

    window.addEventListener('productDeleted', handleProductDeleted);

    return () => {
      window.removeEventListener('productDeleted', handleProductDeleted);
    };
  }, [savedAttributes]);

  // Load data from API on component mount
  useEffect(() => {
    const loadDataFromAPI = async () => {
      setLoading(true);
      try {
        const attributes = await attributeApi.getAttributes();

        // Transform API data to match our frontend structure
        const transformedAttributes = attributes.map((attr: { _id: string; name: string; variations?: string[] }) => ({
          id: attr._id,
          name: attr.name,
          values: attr.variations || []
        }));

        setSavedAttributes(transformedAttributes);

        // Transform variations data
        const variationsData: Record<string, { values: string[] }> = {};
        transformedAttributes.forEach((attr: { id: string; name: string; values: string[] }) => {
          variationsData[attr.id] = { values: attr.values };
        });
        setSavedVariations(variationsData);

        // Check usage for each attribute
        const usagePromises = transformedAttributes.map(async (attr) => {
          try {
            const usage = await attributeApi.checkAttributeUsage(attr.id);
            return { attributeId: attr.id, usage };
          } catch (error) {
            console.error(`Error checking usage for attribute ${attr.id}:`, error);
            return { attributeId: attr.id, usage: { isInUse: false, productCount: 0, products: [] } };
          }
        });

        const usageResults = await Promise.all(usagePromises);
        const usageMap: Record<string, AttributeUsageInfo> = {};
        usageResults.forEach(({ attributeId, usage }) => {
          usageMap[attributeId] = usage;
        });
        setAttributeUsage(usageMap);

        console.log('Loaded data from API:', { attributes: transformedAttributes, variations: variationsData, usage: usageMap });
      } catch (error) {
        console.error('Error loading data from API:', error);
        // Fallback to localStorage if API fails
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const savedAttrs = localStorage.getItem('savedAttributes');
        const savedVars = localStorage.getItem('savedVariations');

        if (savedAttrs) {
          setSavedAttributes(JSON.parse(savedAttrs));
        }

        if (savedVars) {
          setSavedVariations(JSON.parse(savedVars));
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    };

    loadDataFromAPI();
  }, []);

  const tabs = [
    { id: 'attributes', label: 'Attributes' },
    { id: 'variations', label: 'Variations' }
  ];

  const handleSaveAttributes = async (attributes: Array<{ id: string; name: string; values: string[] }>) => {
    // Check if there are any attributes to save
    if (attributes.length === 0) {
      console.log('No attributes to save - skipping API call');
      return;
    }

    setLoading(true);
    try {
      // Save to API
      for (const attr of attributes) {
        if (attr.id && attr.id.startsWith('temp_')) {
          // New attribute - create it
          await attributeApi.createAttribute({
            name: attr.name,
            variations: attr.values
          });
        } else if (attr.id) {
          // Existing attribute - update it
          await attributeApi.updateAttribute(attr.id, {
            name: attr.name,
            variations: attr.values
          });
        }
      }

      // Reload data from API
      const apiAttributes = await attributeApi.getAttributes();
      const transformedAttributes = apiAttributes.map((attr: { _id: string; name: string; variations?: string[] }) => ({
        id: attr._id,
        name: attr.name,
        values: attr.variations || []
      }));

      setSavedAttributes(transformedAttributes);
      console.log('Attributes saved to API:', transformedAttributes);

      // Show success popup
      const newAttributeCount = attributes.filter(attr => attr.id.startsWith('temp_')).length;
      if (newAttributeCount > 0) {
        setTimeout(() => {
          setSuccessTitle('Attributes Created!');
          setSuccessMessage(`${newAttributeCount} attribute(s) created successfully!`);
          setShowSuccessModal(true);
        }, 100);
      }

      // Also save to localStorage as backup
      localStorage.setItem('savedAttributes', JSON.stringify(transformedAttributes));
    } catch (error) {
      console.error('Error saving to API:', error);
      // Fallback to localStorage only
      setSavedAttributes(attributes);
      localStorage.setItem('savedAttributes', JSON.stringify(attributes));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVariations = async (variations: Record<string, { values: string[] }>) => {
    setLoading(true);
    try {
      // Update all attributes in parallel instead of sequentially
      const updatePromises = Object.entries(variations).map(async ([attrId, variationData]) => {
        const attribute = savedAttributes.find(attr => attr.id === attrId);
        if (attribute) {
          return attributeApi.updateAttribute(attrId, {
            name: attribute.name,
            variations: variationData.values
          });
        }
        return null;
      });

      // Wait for all updates to complete in parallel
      await Promise.all(updatePromises);

      // Update local state immediately
      setSavedVariations(variations);

      // Update savedAttributes to reflect the new variations
      const updatedAttributes = savedAttributes.map(attr => ({
        ...attr,
        values: variations[attr.id]?.values || []
      }));
      setSavedAttributes(updatedAttributes);

      console.log('Variations saved to API:', variations);

      // Show success popup
      setTimeout(() => {
        setSuccessTitle('Variations Saved!');
        setSuccessMessage('All variations have been saved successfully!');
        setShowSuccessModal(true);
      }, 100);

      // Also save to localStorage as backup
      localStorage.setItem('savedVariations', JSON.stringify(variations));
      localStorage.setItem('savedAttributes', JSON.stringify(updatedAttributes));
    } catch (error) {
      console.error('Error saving variations to API:', error);
      // Fallback to localStorage only
      setSavedVariations(variations);
      localStorage.setItem('savedVariations', JSON.stringify(variations));
    } finally {
      setLoading(false);
    }
  };

  // Handle attribute deletion
  const handleDeleteAttribute = async (attributeId: string) => {
    console.log('handleDeleteAttribute called with ID:', attributeId);
    try {
      console.log('Calling API to delete attribute:', attributeId);
      // Delete from API
      const result = await attributeApi.deleteAttribute(attributeId);
      console.log('API delete result:', result);

      // Remove from local state
      const updatedAttributes = savedAttributes.filter(attr => attr.id !== attributeId);
      setSavedAttributes(updatedAttributes);
      console.log('Updated local attributes:', updatedAttributes);

      // Update variations data
      const updatedVariations = { ...savedVariations };
      delete updatedVariations[attributeId];
      setSavedVariations(updatedVariations);

      // Update usage data
      const updatedUsage = { ...attributeUsage };
      delete updatedUsage[attributeId];
      setAttributeUsage(updatedUsage);

      // Update localStorage
      localStorage.setItem('savedAttributes', JSON.stringify(updatedAttributes));
      localStorage.setItem('savedVariations', JSON.stringify(updatedVariations));

      console.log('Attribute deletion completed successfully');
      return true; // Success
    } catch (error) {
      console.error('Error deleting attribute:', error);
      return false; // Failed
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Loading...</div>
        </div>
      );
    }

    switch (activeTab) {
      case 'attributes':
        return <AttributesTab onSaveAttributes={handleSaveAttributes} onDeleteAttribute={handleDeleteAttribute} savedAttributes={savedAttributes} attributeUsage={attributeUsage} />;
      case 'variations':
        return <VariationsTab
          savedAttributes={savedAttributes}
          onSaveVariations={handleSaveVariations}
          savedVariations={savedVariations}
          variationUsage={variationUsage}
          onCheckVariationUsage={async (attributeId: string, variation: string) => {
            try {
              const usage = await attributeApi.checkVariationUsage(attributeId, variation);
              setVariationUsage(prev => ({
                ...prev,
                [`${attributeId}-${variation}`]: usage
              }));
              return usage;
            } catch (error) {
              console.error('Error checking variation usage:', error);
              return { isInUse: false, productCount: 0, products: [] };
            }
          }}
          onVariationUsageUpdate={(usageMap) => {
            setVariationUsage(prev => ({
              ...prev,
              ...usageMap
            }));
          }}
        />;
      default:
        return <AttributesTab onSaveAttributes={handleSaveAttributes} savedAttributes={savedAttributes} attributeUsage={attributeUsage} />;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto container">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Left Navigation Panel */}
          <div className="lg:col-span-2">
            <div className="bg-[#0000004D]/30 backdrop-blur-[50px] rounded-3xl p-6 border border-[#6E6E6E]">

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-2 rounded-md 2xl:text-[20px] text-[16px] transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-[#028EFC] text-white shadow-lg'
                        : 'text-[#E5E5E5]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Content Panel */}
          <div className="lg:col-span-4">
            <div className="bg-[#0000004D]/30 backdrop-blur-[50px] rounded-3xl p-8 border border-[#6E6E6E]">
              {renderContent()}
            </div>
          </div>
        </div>
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
}

export default AttributePage;
