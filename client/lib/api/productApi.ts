import {
  TProduct,
  ICreateSimpleProductPayload,
  IUpdateSimpleProductPayload,
  ICreateVariableProductPayload,
  IUpdateVariableProductPayload,
} from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const productApi = {
  // Get all products
  getProducts: async (): Promise<TProduct[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Create new variable product
  createVariableProduct: async (
    productData: FormData
  ): Promise<ICreateVariableProductPayload> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/variable`, {
        method: "POST",
        body: productData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating variable product:", error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id: string): Promise<TProduct> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch product");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  // Create new simple product
  createSimpleProduct: async (
    productData: FormData
  ): Promise<ICreateSimpleProductPayload> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/simple`, {
        method: "POST",
        // Don't set Content-Type header for FormData - let the browser set it with boundary
        body: productData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update product
  updateSimpleProduct: async (
    id: string,
    productData: IUpdateSimpleProductPayload
  ): Promise<TProduct> => {
    try {
      const formData = new FormData();

      formData.append("type", productData.type.trim());
      formData.append("sku", productData.sku.trim());
      formData.append("title", productData.title.trim());
      formData.append("smallDescription", productData.smallDescription.trim());
      formData.append("description", productData.description.trim());
      formData.append("price", productData.price.toString());
      if (productData.discountPrice) {
        formData.append("discountPrice", productData.discountPrice.toString());
      }
      formData.append(
        "quantity",
        parseInt(productData.quantity.toString()).toString()
      );
      formData.append(
        "retainedProductImages",
        JSON.stringify(productData.retainedProductImages)
      );
      productData.newProductImages.forEach((file) =>
        formData.append("newProductImages", file)
      );
      formData.append("categories", JSON.stringify(productData.categories));
      formData.append("attributes", JSON.stringify(productData.attributes));
      formData.append("status", productData.status);
      formData.append("isFeatured", productData.isFeatured.toString());

      const response = await fetch(`${API_BASE_URL}/product/simple/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Delete product
  deleteSimpleProduct: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/simple/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  deleteVariableProduct: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/variable/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Update variable product
  updateVariableProduct: async (
    id: string,
    productData: IUpdateVariableProductPayload
  ): Promise<TProduct> => {
    try {
      const formData = new FormData();

      formData.append("type", productData.type);
      formData.append("title", productData.title.trim());
      formData.append("smallDescription", productData.smallDescription.trim());
      formData.append("description", productData.description.trim());
      formData.append("categories", JSON.stringify(productData.categories));
      formData.append("status", productData.status);
      formData.append("isFeatured", productData.isFeatured.toString());

      // Base images
      formData.append(
        "retainedBaseImages",
        JSON.stringify(productData.retainedBaseImages)
      );
      (productData.newBaseImages || []).forEach((file) =>
        formData.append("newBaseImages", file)
      );

      // Variant images (global uploads)
      (productData.newVariantImages || []).forEach((file) =>
        formData.append("newVariantImages", file)
      );

      // Normalize variation attributes to always use selectedVariation (singular)
      type AnyAttr = { attribute: string } & (
        | { selectedVariation: string }
        | { selectedVariations: string }
      );

      const normalizedVariations = productData.variations.map((v) => ({
        sku: v.sku,
        attributes: v.attributes.map((a: AnyAttr) => ({
          attribute: a.attribute,
          selectedVariation:
            "selectedVariation" in a ? a.selectedVariation : a.selectedVariations,
        })),
        price: v.price,
        discountPrice: v.discountPrice,
        quantity: v.quantity,
        retainedVariantImages: v.retainedVariantImages || [],
        variantImageIndexes: v.variantImageIndexes || [],
      }));

      formData.append("variations", JSON.stringify(normalizedVariations));

      const response = await fetch(`${API_BASE_URL}/product/variable/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      const result = await response.json();
      return result as TProduct;
    } catch (error) {
      console.error("Error updating variable product:", error);
      throw error;
    }
  },
};
