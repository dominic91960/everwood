"use client";

import React from "react";

import { IUpdateVariableProductPayload } from "@/types/product";
import VariationCards from "./VariationCards";

interface VariationsProps {
  formData: IUpdateVariableProductPayload;
  setFormData: React.Dispatch<
    React.SetStateAction<IUpdateVariableProductPayload>
  >;
}

const Variations: React.FC<VariationsProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-[24px] font-semibold text-white">Variations</h3>

      <VariationCards
        variations={formData.variations}
        onChange={(variations) =>
          setFormData((prev) => {
            type AnyAttr = { attribute: string } & (
              | { selectedVariation: string }
              | { selectedVariations: string }
            );
            const normalized = variations.map((v) => ({
              ...v,
              attributes: v.attributes.map((a: AnyAttr) => ({
                attribute: a.attribute,
                selectedVariation:
                  "selectedVariation" in a
                    ? a.selectedVariation
                    : a.selectedVariations,
              })),
              retainedVariantImages: v.retainedVariantImages || [],
              variantImageIndexes: v.variantImageIndexes || [],
            }));
            return { ...prev, variations: normalized };
          })
        }
        variantImages={formData.newVariantImages}
      />
    </div>
  );
};

export default Variations;
