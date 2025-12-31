"use client";

import React from "react";

import { toast } from "sonner";
import {
  ICreateProductPayload,
  ICreateVariableProductPayload,
  ISimpleProductPayloadAttribute,
} from "@/types/product";
import { IProductAttribute } from "@/types/product-attribute";

import Attributes from "./Attributes";
import VariationCards, { TVariationRow } from "./VariationCards";

interface VariationsProps {
  formData: ICreateProductPayload;
  productAttributes: IProductAttribute[];
  variableAttributes: ISimpleProductPayloadAttribute[];
  setFormData: React.Dispatch<React.SetStateAction<ICreateProductPayload>>;
  setVariableAttributes: React.Dispatch<
    React.SetStateAction<ISimpleProductPayloadAttribute[]>
  >;
}

const Variations: React.FC<VariationsProps> = ({
  formData,
  productAttributes,
  variableAttributes,
  setFormData,
  setVariableAttributes,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-[24px] font-semibold text-white">
        Attributes and variations
      </h3>
      <Attributes
        attributeData={productAttributes}
        onProductAttributeChange={(attributes) =>
          setVariableAttributes(attributes)
        }
      />
      <div className="flex gap-3">
        <button
          onClick={() => {
            // Generate variations from selected attributes
            const enabled = variableAttributes.filter(
              (a) => a.selectedVariations && a.selectedVariations.length > 0
            );
            if (!enabled.length) {
              toast.error("Select at least one attribute value");
              return;
            }
            // Cartesian product
            const attrLists = enabled.map((a) => ({
              attribute: a.attribute,
              values: a.selectedVariations,
            }));
            const cartesian: string[][] = attrLists.reduce((acc, cur) => {
              if (acc.length === 0) return cur.values.map((v) => [v]);
              const next: string[][] = [];
              acc.forEach((row) => {
                cur.values.forEach((v) => next.push([...row, v]));
              });
              return next;
            }, [] as string[][]);

            const title = formData.title || "";
            const defPrice = 0;
            const defDiscount = 0;
            const defQty = 0;
            const newVariations: TVariationRow[] = cartesian.map((vals) => {
              // Use client payload attribute shape; we'll normalize on submit
              const normalizedAttrs = vals.map((val, idx) => ({
                attribute: attrLists[idx].attribute,
                selectedVariations: val,
              })) as TVariationRow["attributes"];

              return {
                sku: `${title}`.trim()
                  ? `${title}-${vals.join("-")}`
                      .toUpperCase()
                      .replace(/\s+/g, "-")
                  : vals.join("-").toUpperCase(),
                attributes: normalizedAttrs,
                price: defPrice,
                discountPrice: defDiscount,
                quantity: defQty,
                variantImageIndexes:
                  formData.type === "variable" &&
                  (formData as ICreateVariableProductPayload).variantImages
                    .length > 0
                    ? [0]
                    : [],
              };
            });

            setFormData((prev) => {
              if (prev.type !== "variable") return prev;
              return {
                ...prev,
                variations: newVariations,
              } as ICreateVariableProductPayload;
            });
          }}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm"
        >
          Generate variations
        </button>

        <button
          onClick={() =>
            setFormData((prev) => {
              if (prev.type !== "variable") return prev;
              return {
                ...prev,
                variations: [],
              } as ICreateVariableProductPayload;
            })
          }
          className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white text-sm"
        >
          Clear variations
        </button>
      </div>

      {formData.type === "variable" && (
        <VariationCards
          variations={(formData as ICreateVariableProductPayload).variations}
          onChange={(variations) =>
            setFormData((prev) => {
              if (prev.type !== "variable") return prev;
              return {
                ...prev,
                variations,
              } as ICreateVariableProductPayload;
            })
          }
          variantImages={
            (formData as ICreateVariableProductPayload).variantImages
          }
        />
      )}
    </div>
  );
};

export default Variations;
