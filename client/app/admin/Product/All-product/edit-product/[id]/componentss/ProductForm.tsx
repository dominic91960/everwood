"use client";

import React, { useState, useCallback, useEffect } from "react";

import api from "@/lib/axios-instance";
import { toast } from "sonner";
import { productApi } from "@/lib/api/productApi";
import { getErrorMessage } from "@/lib/utils";

import {
  TProduct,
  IUpdateProductPayload,
  IUpdateSimpleProductPayload,
  IUpdateVariableProductPayload,
  ISimpleProductPayloadAttribute,
} from "@/types/product";
import { IProductCategory } from "@/types/product-category";
import { IProductAttribute } from "@/types/product-attribute";

import Attributes from "./Attributes";
import BaseProductDetails from "./BaseProductDetails";
import SimpleProductDetails from "./SimpleProductDetails";
import ProductGallery from "./ProductGallery";
import UpdateButton from "./UpdateButton";
import Variations from "./Variations";

const makeSimpleTemplate = (): IUpdateSimpleProductPayload => ({
  type: "simple",
  sku: "",
  title: "",
  smallDescription: "",
  description: "",
  price: 0,
  discountPrice: 0,
  quantity: 0,
  isFeatured: false,
  status: "draft",
  categories: [],
  attributes: [],
  retainedProductImages: [],
  newProductImages: [],
});

const makeVariableTemplate = (): IUpdateVariableProductPayload => ({
  type: "variable",
  title: "",
  smallDescription: "",
  description: "",
  isFeatured: false,
  status: "draft",
  categories: [],
  retainedBaseImages: [],
  newBaseImages: [],
  newVariantImages: [],
  variations: [],
});

const ProductForm = ({ productId }: { productId: string }) => {
  const [formData, setFormData] = useState<IUpdateProductPayload>(
    makeSimpleTemplate()
  );
  const [retainedSimpleProductImages, setRetainedSimpleProductImages] =
    useState<string[]>([]);
  const [retainedVariableBaseImages, setRetainedVariableBaseImages] = useState<
    string[]
  >([]);
  // const [variableAttributes, setVariableAttributes] = useState<
  //   ISimpleProductPayloadAttribute[]
  // >([]);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productCategories, setProductCategories] = useState<
    IProductCategory[]
  >([]);
  const [productAttributes, setProductAttributes] = useState<
    IProductAttribute[]
  >([]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      const productRes = await api.get(`/product/${productId}`);
      const productData: TProduct = productRes.data;
      const {
        title,
        smallDescription,
        description,
        isFeatured,
        status,
        categories,
      } = productData;

      const formattedData: IUpdateProductPayload =
        productData.type === "simple"
          ? {
              type: "simple",
              title,
              smallDescription,
              description,
              isFeatured,
              status,
              categories: categories.map((c) => c._id),
              sku: productData.sku,
              retainedProductImages: productData.productImages,
              newProductImages: [],
              price: productData.price,
              discountPrice: productData.discountPrice,
              attributes: productData.attributes.map((attr) => ({
                attribute: attr.attribute._id,
                selectedVariations: attr.selectedVariations,
              })),
              quantity: productData.quantity,
            }
          : {
              type: "variable",
              title,
              smallDescription,
              description,
              isFeatured,
              status,
              categories: categories.map((c) => c._id),
              retainedBaseImages: productData.baseImages,
              newBaseImages: [],
              newVariantImages: [],
              variations: productData.variations.map((variation) => ({
                sku: variation.sku,
                attributes: variation.attributes.map((attr) => ({
                  attribute: attr.attribute._id,
                  selectedVariation: attr.selectedVariation,
                })),
                price: variation.price,
                discountPrice: variation.discountPrice,
                quantity: variation.quantity,
                retainedVariantImages: variation.variantImages,
                variantImageIndexes: [],
              })),
            };

      setFormData(formattedData);
      if (formattedData.type === "simple")
        setRetainedSimpleProductImages(formattedData.retainedProductImages);
      if (formattedData.type === "variable")
        setRetainedVariableBaseImages(formattedData.retainedBaseImages);

      const categoryRes = await api.get("/product-category");
      const categoryData = categoryRes.data;
      setProductCategories(categoryData);

      const attributRes = await api.get("/product-attribute");
      const attributData = attributRes.data;
      setProductAttributes(attributData);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      toast.error(message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProductDataChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      const type = e.target.type;
      const key = e.target.name;
      const value =
        e.target instanceof HTMLInputElement && type === "checkbox"
          ? e.target.checked
          : e.target.value;

      if (key === "type") {
        setFormData((prev) => {
          // Preserve base fields when switching types
          const base = {
            title: prev.title || "",
            smallDescription: prev.smallDescription || "",
            description: prev.description || "",
            categories: prev.categories || [],
            isFeatured: prev.isFeatured || false,
            status: prev.status || "draft",
          };
          if (value === "simple") {
            const next = makeSimpleTemplate();
            return { ...next, ...base };
          }
          const next = makeVariableTemplate();
          return { ...next, ...base };
        });
        return;
      }

      if (
        key.includes("category") &&
        e.target instanceof HTMLInputElement &&
        type === "checkbox"
      ) {
        const categoryId = key.split("-")[1];
        setFormData((prev) => {
          const current = (prev.categories || []) as string[];
          const next =
            value === true
              ? Array.from(new Set([...current, categoryId]))
              : current.filter((c) => c !== categoryId);
          return { ...prev, categories: next } as IUpdateProductPayload;
        });
        return;
      }

      // Update known fields explicitly to keep type safety
      setFormData((prev) => {
        if (key === "title")
          return { ...prev, title: String(value) } as IUpdateProductPayload;
        if (key === "smallDescription")
          return {
            ...prev,
            smallDescription: String(value),
          } as IUpdateProductPayload;
        if (key === "description")
          return {
            ...prev,
            description: String(value),
          } as IUpdateProductPayload;
        if (key === "status")
          return {
            ...prev,
            status: String(value).toLowerCase() as
              | "draft"
              | "public"
              | "private",
          } as IUpdateProductPayload;
        if (key === "isFeatured")
          return {
            ...prev,
            isFeatured: Boolean(value),
          } as IUpdateProductPayload;
        if (prev.type === "simple") {
          if (key === "sku")
            return { ...prev, sku: String(value) } as IUpdateProductPayload;
          if (key === "price")
            return { ...prev, price: Number(value) } as IUpdateProductPayload;
          if (key === "discountPrice")
            return {
              ...prev,
              discountPrice: Number(value),
            } as IUpdateProductPayload;
          if (key === "quantity")
            return {
              ...prev,
              quantity: Number(value),
            } as IUpdateProductPayload;
        }
        return prev;
      });
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    try {
      if (formData.type === "simple") {
        setIsSubmitting(true);
        await productApi.updateSimpleProduct(productId, formData);
        toast.success("Product updated successfully!");
      } else if (formData.type === "variable") {
        setIsSubmitting(true);
        await productApi.updateVariableProduct(productId, formData);
        toast.success("Product updated successfully!");
      }
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, productId]);

  if (error)
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );

  if (!error && isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl  space-y-8">
        <h1
          className="text-[28px] font-bold sm:text-[24px] md:text-[26px] lg:text-[28px] xl:text-[30px] text-[#E5E5E5]"
          onClick={() => console.log("FORM DATA: ", formData)}
        >
          Products&nbsp;
          <span className="text-[17px] text-[#E5E5E5] font-semibold sm:text-[18px] md:text-[19px] lg:text-[20px] xl:text-[20px]">
            Edit product
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-3">
            <div className="relative rounded-3xl border border-[#6E6E6E] bg-[#4A4A4A] backdrop-blur-[500px] p-6">
              <BaseProductDetails
                categoryData={productCategories}
                productData={formData}
                onProductDataChange={handleProductDataChange}
              />
            </div>

            <div className="relative rounded-3xl border border-[#6E6E6E] bg-[#4A4A4A] backdrop-blur-[500px] p-6 mt-6">
              {formData.type === "simple" && (
                <Attributes
                  selectedAttributes={formData.attributes}
                  attributeData={productAttributes}
                  onProductAttributeChange={(
                    attributes: ISimpleProductPayloadAttribute[]
                  ) => setFormData((prev) => ({ ...prev, attributes }))}
                />
              )}
              {formData.type === "variable" && (
                <Variations
                  formData={formData as IUpdateVariableProductPayload}
                  setFormData={(
                    updater:
                      | IUpdateVariableProductPayload
                      | ((
                          prev: IUpdateVariableProductPayload
                        ) => IUpdateVariableProductPayload)
                  ) =>
                    setFormData((prev) => {
                      if (prev.type !== "variable") return prev;
                      const p = prev as IUpdateVariableProductPayload;
                      return typeof updater === "function"
                        ? (
                            updater as (
                              prev: IUpdateVariableProductPayload
                            ) => IUpdateVariableProductPayload
                          )(p)
                        : (updater as IUpdateVariableProductPayload);
                    })
                  }
                />
              )}
            </div>
          </div>

          {/* Right Column - Publishing & Metadata */}
          <div className="lg:col-span-2 space-y-6">
            {formData.type === "simple" && (
              <>
                <SimpleProductDetails
                  productData={formData as IUpdateSimpleProductPayload}
                  onProductDataChange={handleProductDataChange}
                />
                <ProductGallery
                  allRetainedImages={retainedSimpleProductImages}
                  retainedProductImagesData={
                    (formData as IUpdateSimpleProductPayload)
                      .retainedProductImages
                  }
                  newProductImagesData={
                    (formData as IUpdateSimpleProductPayload).newProductImages
                  }
                  onNewProductImagesChange={(newProductImages: File[]) =>
                    setFormData((prev) => ({
                      ...(prev as IUpdateSimpleProductPayload),
                      newProductImages,
                    }))
                  }
                  onRetainedProductImagesChange={(
                    retainedProductImages: string[]
                  ) =>
                    setFormData((prev) => ({
                      ...(prev as IUpdateSimpleProductPayload),
                      retainedProductImages,
                    }))
                  }
                />
                <div className="relative rounded-3xl border border-[#6E6E6E] bg-[#4A4A4A] backdrop-blur-[500px] p-6">
                  <p className="font-medium text-[#FFFFFF] text-[17px] mb-2">
                    Save Product Data
                  </p>
                  <UpdateButton
                    identifier="update-product-btn"
                    buttonText="Update Product"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  />
                </div>
              </>
            )}

            {formData.type === "variable" && (
              <>
                <ProductGallery
                  label="Base Images"
                  allRetainedImages={retainedVariableBaseImages}
                  retainedProductImagesData={
                    (formData as IUpdateVariableProductPayload)
                      .retainedBaseImages
                  }
                  newProductImagesData={
                    (formData as IUpdateVariableProductPayload).newBaseImages
                  }
                  onNewProductImagesChange={(newBaseImages: File[]) =>
                    setFormData((prev) => {
                      if (prev.type !== "variable") return prev;
                      return {
                        ...(prev as IUpdateVariableProductPayload),
                        newBaseImages,
                      } as IUpdateVariableProductPayload;
                    })
                  }
                  onRetainedProductImagesChange={(
                    retainedBaseImages: string[]
                  ) =>
                    setFormData((prev) => {
                      if (prev.type !== "variable") return prev;
                      return {
                        ...(prev as IUpdateVariableProductPayload),
                        retainedBaseImages,
                      } as IUpdateVariableProductPayload;
                    })
                  }
                />

                <ProductGallery
                  label="Variant Images"
                  allRetainedImages={[]}
                  retainedProductImagesData={[]}
                  newProductImagesData={
                    (formData as IUpdateVariableProductPayload).newVariantImages
                  }
                  onNewProductImagesChange={(newVariantImages: File[]) =>
                    setFormData((prev) => {
                      if (prev.type !== "variable") return prev;
                      return {
                        ...(prev as IUpdateVariableProductPayload),
                        newVariantImages,
                      } as IUpdateVariableProductPayload;
                    })
                  }
                  onRetainedProductImagesChange={() => {}}
                />

                <div className="relative rounded-3xl border border-[#6E6E6E] bg-[#4A4A4A] backdrop-blur-[500px] p-6">
                  <p className="font-medium text-[#FFFFFF] text-[17px] mb-2">
                    Save Product Data
                  </p>
                  <UpdateButton
                    identifier="update-variable-product-btn"
                    buttonText="Update Product"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
