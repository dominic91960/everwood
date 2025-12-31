"use client";

import React, { useState, useEffect, useCallback } from "react";
import ProductDetails from "./ProductDetails";
import PublishingMetadata from "./PublishingMetadata";
import Attributes from "./Attributes";
import { productApi, Product } from "@/lib/api/productApi";

interface ProductFormData {
  // Product Details
  type: "simple" | "variable";
  sku: string;
  title: string;
  smallDescription: string;
  description: string;
  retainedProductImages: string[];
  price: string;
  discountPrice: string;
  quantity: string;
  isFeatured: boolean;

  // Publishing & Metadata
  status: string;
  selectedCategories: string[];

  // Attributes
  attributes: Record<string, { enabled: boolean; selectedValues: string[] }>;

  // Gallery
  newProductImages: Array<{
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    lastModified: number;
  }>;
}

interface ProductFormProps {
  productId: string;
}

const ProductForm = ({ productId }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    type: "simple",
    sku: "",
    title: "",
    smallDescription: "",
    description: "",
    retainedProductImages: [],
    newProductImages: [],
    price: "",
    discountPrice: "",
    quantity: "",
    isFeatured: false,
    status: "Draft",
    selectedCategories: [],
    attributes: {},
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setInitialLoading(true);
        const productData = await productApi.getProductById(productId);
        setProduct(productData);

        // Try to determine the correct status from available data
        let actualStatus = "Draft";
        // Check if status exists in the product data
        if (productData.status && productData.status !== "") {
          // Convert lowercase status from database to proper case for frontend
          const statusMap: { [key: string]: string } = {
            draft: "Draft",
            public: "Public",
            private: "Private",
          };
          actualStatus =
            statusMap[productData.status.toLowerCase()] || productData.status;
        } else {
          // Default to Public if no status is found
          actualStatus = "Public";
        }

        setFormData({
          type: productData.type || "",
          sku: productData.sku || "",
          title: productData.title || "",
          smallDescription: productData.smallDescription || "",
          description: productData.description || "",
          retainedProductImages: productData.productImages || [],
          newProductImages: [],
          price: productData.price?.toString() || "",
          discountPrice: productData.discountPrice?.toString() || "",
          quantity: productData.quantity?.toString() || "",
          isFeatured: productData.isFeatured || false,
          status: actualStatus,
          selectedCategories:
            productData.categories?.map((cat) => cat._id) || [],
          attributes:
            productData.attributes?.reduce((acc, attr) => {
              acc[attr.attribute._id] = {
                enabled: true,
                selectedValues: attr.selectedVariations || [],
              };
              return acc;
            }, {} as Record<string, { enabled: boolean; selectedValues: string[] }>) ||
            {},
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch product"
        );
        console.error("Error fetching product:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Handle product details changes
  const handleProductDataChange = useCallback(
    (data: {
      type: "simple" | "variable";
      sku: string;
      title: string;
      shortDescription: string;
      description: string;
      price: string;
      discountPrice: string;
      quantity: string;
      isFeatured: boolean;
    }) => {
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
    },
    []
  );

  // Handle publishing data changes
  const handlePublishingDataChange = useCallback(
    (data: { status: string; selectedCategories: string[] }) => {
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
    },
    []
  );

  // Handle attributes changes
  const handleAttributesChange = useCallback(
    (
      attributes: Record<string, { enabled: boolean; selectedValues: string[] }>
    ) => {
      setFormData((prev) => ({
        ...prev,
        attributes,
      }));
    },
    []
  );

  // Handle gallery files changes
  const handleGalleryFilesChange = useCallback(
    (
      files: Array<{
        id: string;
        file: File;
        name: string;
        size: number;
        type: string;
        lastModified: number;
      }>
    ) => {
      setFormData((prev) => ({
        ...prev,
        newProductImages: files,
      }));
    },
    []
  );

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate price vs discount price
      const price = parseFloat(formData.price) || 0;
      const discountPrice = formData.discountPrice
        ? parseFloat(formData.discountPrice)
        : 0;

      if (price > 0 && discountPrice > 0 && discountPrice >= price) {
        setError("Discount price must be less than regular price");
        setLoading(false);
        return;
      }

      // Prepare update data
      const updateData = {
        type: formData.type,
        sku: formData.sku,
        title: formData.title,
        smallDescription: formData.smallDescription,
        description: formData.description,
        retainedProductImages: formData.retainedProductImages,
        newProductImages: formData.newProductImages,
        price: parseFloat(formData.price) || 0,
        discountPrice: parseFloat(formData.discountPrice) || 0,
        quantity: parseInt(formData.quantity) || 1,
        isFeatured: formData.isFeatured,
        status: formData.status.toLowerCase(),
        categories: formData.selectedCategories,
        attributes: Object.entries(formData.attributes)
          .filter(([_, config]) => config.enabled)
          .map(([attributeId, config]) => ({
            attribute: attributeId,
            selectedVariations: config.selectedValues,
          })),
      };

      // Update product with new files if any
      const filesToUpload = formData.newProductImages.map(
        (fileObj) => fileObj.file
      );
      await productApi.updateSimpleProduct(
        productId,
        updateData,
        filesToUpload
      );

      // Show success message
      setSuccessMessage("Product updated successfully!");
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update product";
      setError(errorMessage);
      console.error("Error updating product:", err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <div className="text-center">
          <p className="mb-4 text-red-400">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-green-600 px-6 py-3 text-white shadow-lg">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-red-600 px-6 py-3 text-white shadow-lg">
          {error}
        </div>
      )}

      <div className="max-w-7xl space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-[28px] font-bold text-[#E5E5E5] sm:text-[24px] md:text-[26px] lg:text-[28px] xl:text-[30px]">
            Products
          </h1>
          <span className="mt-2 text-[17px] font-semibold text-[#E5E5E5] sm:text-[18px] md:text-[19px] lg:text-[20px] xl:text-[20px]">
            Edit products
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-3">
            <div className="relative rounded-3xl border border-[#6E6E6E] bg-black/30 p-6 backdrop-blur-[500px]">
              <ProductDetails
                initialData={{
                  type: formData.type,
                  sku: formData.sku,
                  title: formData.title,
                  shortDescription: formData.smallDescription,
                  description: formData.description,
                  price: formData.price,
                  discountPrice: formData.discountPrice,
                  quantity: formData.quantity,
                  isFeatured: formData.isFeatured,
                }}
                onProductDataChange={handleProductDataChange}
                onFilesChange={handleGalleryFilesChange}
                existingImages={product?.productImages || []}
              />
            </div>
            <div className="mt-6">
              <Attributes
                initialAttributes={formData.attributes}
                onAttributesChange={handleAttributesChange}
              />
            </div>
          </div>

          {/* Right Column - Publishing & Metadata */}
          <div className="space-y-6 lg:col-span-2">
            <PublishingMetadata
              initialData={{
                status: formData.status,
                selectedCategories: formData.selectedCategories,
              }}
              onPublishingDataChange={handlePublishingDataChange}
              onSubmit={handleSubmit}
              loading={loading}
              buttonText="Update Product"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
