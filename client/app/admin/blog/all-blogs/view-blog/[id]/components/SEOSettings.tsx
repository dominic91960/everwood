// components/SEOSettings.tsx
"use client";

import React from "react";
import MetaKeywordsInput from "./MetaKeywordsInput ";

interface SEOSettingsProps {
  seoTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  onSeoTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onMetaKeywordsChange: (keywords: string[]) => void;
  isEdit: boolean;
}

const SEOSettings = ({
  seoTitle,
  metaDescription,
  metaKeywords,
  onSeoTitleChange,
  onMetaDescriptionChange,
  onMetaKeywordsChange,
  isEdit,
}: SEOSettingsProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xl font-medium mb-2">
            SEO Title ({seoTitle.length}/60)
          </label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => onSeoTitleChange(e.target.value)}
            className="w-full p-1 border rounded-3xl border-[#70BDD1]"
            maxLength={60}
            disabled={isEdit}
          />
        </div>

        <div>
          <label className="block text-xl text-[#000000]  mb-2">
            Meta Description ({metaDescription.length}/160)
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            className="w-full p-1 border border-[#70BDD1] rounded-lg h-32"
            maxLength={160}
            disabled={isEdit}
          />
        </div>

        <div>
          <label className="block text-xl text-[#000000] mb-2">
            Meta Keywords
          </label>
          <MetaKeywordsInput
            selectedKeywords={metaKeywords}
            onKeywordsChange={onMetaKeywordsChange}
            maxKeywords={10}
            placeholder="Add SEO keywords..."
            isEdit={isEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default SEOSettings;