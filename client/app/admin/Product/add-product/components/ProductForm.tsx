"use client";

import React, { useState, useCallback, useEffect } from "react";

import api from "@/lib/axios-instance";
import { toast } from "sonner";
import { productApi } from "@/lib/api/productApi";
import { getErrorMessage } from "@/lib/utils";

import {
  ICreateProductPayload,
  ICreateSimpleProductPayload,
  ICreateVariableProductPayload,
  ISimpleProductPayloadAttribute,
} from "@/types/product";
import { IProductCategory } from "@/types/product-category";
import { IProductAttribute } from "@/types/product-attribute";

import Attributes from "./Attributes";
import BaseProductDetails from "./BaseProductDetails";
import SimpleProductDetails from "./SimpleProductDetails";
import ProductGallery from "./ProductGallery";
import AddButton from "./AddButton";
import Variations from "./Variations";

const makeSimpleTemplate = (): ICreateSimpleProductPayload => ({
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
  productImages: [],
});

const makeVariableTemplate = (): ICreateVariableProductPayload => ({
  type: "variable",
  title: "",
  smallDescription: "",
  description: "",
  isFeatured: false,
  status: "draft",
  categories: [],
  baseImages: [],
  variantImages: [],
  variations: [],
});

const ProductForm = () => {
  const [formData, setFormData] = useState<ICreateProductPayload>(
    makeSimpleTemplate()
  );
  const [variableAttributes, setVariableAttributes] = useState<
    ISimpleProductPayloadAttribute[]
  >([]);

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
  }, []);

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
          return { ...prev, categories: next } as ICreateProductPayload;
        });
        return;
      }

      // Update known fields explicitly to keep type safety
      setFormData((prev) => {
        if (key === "title")
          return { ...prev, title: String(value) } as ICreateProductPayload;
        if (key === "smallDescription")
          return {
            ...prev,
            smallDescription: String(value),
          } as ICreateProductPayload;
        if (key === "description")
          return {
            ...prev,
            description: String(value),
          } as ICreateProductPayload;
        if (key === "status")
          return {
            ...prev,
            status: String(value).toLowerCase() as
              | "draft"
              | "public"
              | "private",
          } as ICreateProductPayload;
        if (key === "isFeatured")
          return {
            ...prev,
            isFeatured: Boolean(value),
          } as ICreateProductPayload;
        if (prev.type === "simple") {
          if (key === "sku")
            return { ...prev, sku: String(value) } as ICreateProductPayload;
          if (key === "price")
            return { ...prev, price: Number(value) } as ICreateProductPayload;
          if (key === "discountPrice")
            return {
              ...prev,
              discountPrice: Number(value),
            } as ICreateProductPayload;
          if (key === "quantity")
            return {
              ...prev,
              quantity: Number(value),
            } as ICreateProductPayload;
        }
        return prev;
      });
    },
    []
  );

  const resetForm = useCallback(() => {
    setVariableAttributes([]);
    setFormData(makeSimpleTemplate());
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      if (formData.type === "simple") {
        setIsSubmitting(true);
        const formDataToSend = new FormData();
        formDataToSend.append("type", formData.type.trim());
        formDataToSend.append("sku", formData.sku.trim());
        formDataToSend.append("title", formData.title.trim());
        formDataToSend.append(
          "smallDescription",
          formData.smallDescription.trim()
        );
        formDataToSend.append("description", formData.description.trim());
        formDataToSend.append("price", formData.price.toString());
        if (formData.discountPrice) {
          formDataToSend.append(
            "discountPrice",
            formData.discountPrice.toString()
          );
        }
        formDataToSend.append(
          "quantity",
          parseInt(formData.quantity.toString()).toString()
        );
        formData.productImages.forEach((file) =>
          formDataToSend.append("productImages", file)
        );
        formDataToSend.append(
          "categories",
          JSON.stringify(formData.categories)
        );
        formDataToSend.append(
          "attributes",
          JSON.stringify(formData.attributes)
        );
        formDataToSend.append("status", formData.status);
        formDataToSend.append("isFeatured", formData.isFeatured.toString());

        await productApi.createSimpleProduct(formDataToSend);
        toast.success("Product added successfully!");
        resetForm();
      } else if (formData.type === "variable") {
        const vData = formData as ICreateVariableProductPayload;
        // Basic client-side validation for required variable fields
        if (!vData.baseImages.length) {
          toast.error("Please add at least one base image");
          return;
        }
        if (!vData.variantImages.length) {
          toast.error("Please add at least one variant image");
          return;
        }
        if (!vData.variations.length) {
          toast.error("Please generate at least one variation");
          return;
        }
        const hasImgIndexes = vData.variations.every(
          (v) =>
            Array.isArray(v.variantImageIndexes) &&
            v.variantImageIndexes.length > 0
        );
        if (!hasImgIndexes) {
          toast.error(
            "Each variation must reference at least one variant image"
          );
          return;
        }

        setIsSubmitting(true);
        const fd = new FormData();
        fd.append("type", vData.type);
        fd.append("title", vData.title.trim());
        fd.append("smallDescription", vData.smallDescription.trim());
        fd.append("description", vData.description.trim());
        fd.append("categories", JSON.stringify(vData.categories));
        fd.append("status", vData.status);
        fd.append("isFeatured", String(vData.isFeatured));
        vData.baseImages.forEach((file) => fd.append("baseImages", file));
        vData.variantImages.forEach((file) => fd.append("variantImages", file));
        type AnyAttr = { attribute: string } & (
          | { selectedVariation: string }
          | { selectedVariations: string }
        );
        const payloadVariations = vData.variations.map((v) => ({
          sku: v.sku,
          attributes: v.attributes.map((a: AnyAttr) => ({
            attribute: a.attribute,
            selectedVariation:
              "selectedVariation" in a
                ? a.selectedVariation
                : a.selectedVariations,
          })),
          price: v.price,
          discountPrice: v.discountPrice,
          quantity: v.quantity,
          variantImageIndexes: v.variantImageIndexes,
        }));
        fd.append("variations", JSON.stringify(payloadVariations));

        await productApi.createVariableProduct(fd);
        toast.success("Product added successfully!");
        resetForm();
      }
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, resetForm]);

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
            Create products
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
                  attributeData={productAttributes}
                  onProductAttributeChange={(
                    attributes: ISimpleProductPayloadAttribute[]
                  ) => setFormData((prev) => ({ ...prev, attributes }))}
                />
              )}
              {formData.type === "variable" && (
                <Variations
                  formData={formData}
                  setFormData={setFormData}
                  productAttributes={productAttributes}
                  variableAttributes={variableAttributes}
                  setVariableAttributes={setVariableAttributes}
                />
              )}
            </div>
          </div>

          {/* Right Column - Publishing & Metadata */}
          <div className="lg:col-span-2 space-y-6">
            {formData.type === "simple" && (
              <>
                <SimpleProductDetails
                  productData={formData}
                  onProductDataChange={handleProductDataChange}
                />
                <ProductGallery
                  productImagesData={formData.productImages}
                  onProductImagesChange={(productImages: File[]) =>
                    setFormData((prev) => ({
                      ...prev,
                      productImages,
                    }))
                  }
                />
                <div className="relative rounded-3xl border border-[#6E6E6E] bg-[#4A4A4A] backdrop-blur-[500px] p-6">
                  <p className="font-medium text-[#FFFFFF] text-[17px] mb-2">
                    Save Product Data
                  </p>
                  <AddButton
                    identifier="add-product-btn"
                    buttonText="Add Product"
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
                  productImagesData={
                    (formData as ICreateVariableProductPayload).baseImages
                  }
                  onProductImagesChange={(baseImages: File[]) =>
                    setFormData((prev) => {
                      if (prev.type !== "variable") return prev;
                      return {
                        ...prev,
                        baseImages,
                      } as ICreateVariableProductPayload;
                    })
                  }
                />
                <ProductGallery
                  label="Variant Images"
                  maxFiles={20}
                  productImagesData={
                    (formData as ICreateVariableProductPayload).variantImages
                  }
                  onProductImagesChange={(variantImages: File[]) =>
                    setFormData((prev) => {
                      if (prev.type !== "variable") return prev;
                      return {
                        ...prev,
                        variantImages,
                      } as ICreateVariableProductPayload;
                    })
                  }
                />
                <div className="relative rounded-3xl border border-[#6E6E6E] bg-[#4A4A4A] backdrop-blur-[500px] p-6">
                  <p className="font-medium text-[#FFFFFF] text-[17px] mb-2">
                    Save Product Data
                  </p>
                  <AddButton
                    identifier="add-variable-product-btn"
                    buttonText="Add Product"
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
