"use client";

import React from "react";
import Image from "next/image";

export type TVariationRow = {
  sku: string;
  attributes: Array<
    | { attribute: string; selectedVariations: string }
    | { attribute: string; selectedVariation: string }
  >;
  price: number;
  discountPrice: number;
  quantity: number;
  retainedVariantImages?: string[];
  variantImageIndexes?: number[];
};

interface VariationCardsProps {
  variations: TVariationRow[];
  onChange: (variations: TVariationRow[]) => void;
  variantImages: File[];
}

const VariationCards: React.FC<VariationCardsProps> = ({
  variations,
  onChange,
  variantImages,
}) => {
  const updateRow = (index: number, patch: Partial<TVariationRow>) => {
    const next = variations.map((v, i) =>
      i === index ? { ...v, ...patch } : v
    );
    onChange(next);
  };

  const toggleVariantImageIndex = (index: number, imageIndex: number) => {
    const current = variations[index].variantImageIndexes || [];
    const exists = current.includes(imageIndex);
    const nextIndexes = exists
      ? current.filter((i) => i !== imageIndex)
      : [...current, imageIndex];
    updateRow(index, { variantImageIndexes: nextIndexes });
  };

  if (!variations.length) {
    return (
      <div className="text-gray-300">
        No variations generated yet. Select attribute values and click
        &quot;Generate variations&quot;.
      </div>
    );
  }

  type VariationAttr =
    | { attribute: string; selectedVariations: string }
    | { attribute: string; selectedVariation: string };

  const getSelected = (a: VariationAttr) =>
    "selectedVariation" in a ? a.selectedVariation : a.selectedVariations;

  return (
    <div className="space-y-4">
      {variations.map((row, idx) => (
        <div
          key={idx}
          className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-[#6E6E6E] bg-black/20"
        >
          <div className="col-span-2">
            <div className="flex flex-wrap gap-2  text-white">
              {row.attributes.map((a, i) => (
                <span
                  key={i}
                  className="rounded-full bg-blue-600/30 border border-blue-400 px-2 py-0.5"
                >
                  {getSelected(a as VariationAttr)}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">SKU</label>
            <input
              value={row.sku}
              onChange={(e) => updateRow(idx, { sku: e.target.value })}
              placeholder="SKU"
              className="w-full px-2 py-1 rounded border border-[#6E6E6E] bg-black/30 text-white "
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">
              Price
            </label>
            <input
              type="number"
              min={0}
              value={row.price}
              onChange={(e) =>
                updateRow(idx, { price: Number(e.target.value) })
              }
              className="w-full px-2 py-1 rounded border border-[#6E6E6E] bg-black/30 text-white "
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">
              Discount
            </label>
            <input
              type="number"
              min={0}
              value={row.discountPrice}
              onChange={(e) =>
                updateRow(idx, { discountPrice: Number(e.target.value) })
              }
              className="w-full px-2 py-1 rounded border border-[#6E6E6E] bg-black/30 text-white "
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Qty</label>
            <input
              type="number"
              min={0}
              value={row.quantity}
              onChange={(e) =>
                updateRow(idx, { quantity: Number(e.target.value) })
              }
              className="w-full px-2 py-1 rounded border border-[#6E6E6E] bg-black/30 text-white "
            />
          </div>

          <div className="col-span-2">
            <div className="max-h-28 overflow-auto gap-2 grid grid-cols-6 pr-1">
              {variantImages.length === 0 ? (
                <div className="text-gray-400 col-span-full">
                  Upload variant images first
                </div>
              ) : (
                variantImages.map((f, i) => {
                  const checked = (row.variantImageIndexes || []).includes(i);
                  return (
                    <div
                      key={`${f.name}-${i}`}
                      className="p-1 aspect-square rounded border border-[#6E6E6E] overflow-hidden flex"
                    >
                      <label className=" text-white relative grow rounded cursor-pointer hover:brightness-125 transition-all duration-300">
                        <Image
                          src={URL.createObjectURL(f)}
                          alt=""
                          fill
                          className="object-contain"
                        />
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleVariantImageIndex(idx, i)}
                          className="w-4 h-4 absolute top-1 left-1"
                        />
                      </label>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VariationCards;
