// Product API service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ProductAttribute {
  attribute: string; // attribute ID
  selectedVariations: string[];
}

export interface CreateProductData {
  title: string;
  smallDescription: string;
  description: string;
  existingProductImages: string[];
  price: number;
  discountPrice?: number;
  quantity?: number;
  isFeatured?: boolean;
  status?: string;
  categories: string[]; // category IDs
  attributes: ProductAttribute[];
}

export interface Product {
  _id: string;
  title: string;
  smallDescription: string;
  description: string;
  productImages: string[];
  price: number;
  discountPrice?: number;
  quantity?: number;
  isFeatured?: boolean;
  status?: string;
  categories: Array<{
    _id: string;
    name: string;
    description: string;
  }>;
  attributes: Array<{
    attribute: {
      _id: string;
      name: string;
      variations: string[];
    };
    selectedVariations: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

export const productApi = {
  // Create new product
  createProduct: async (productData: FormData): Promise<Product> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product`, {
        method: "POST",
        // Don't set Content-Type header for FormData - let the browser set it with boundary
        body: productData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      const result = await response.json();
      console.log("Create product API response:", result);
      console.log("Created product quantity:", result.quantity);
      return result;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Get all products
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
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

  // Update product
  updateProduct: async (
    id: string,
    productData: Partial<CreateProductData>,
    files?: File[],
  ): Promise<Product> => {
    try {
      // Create FormData for the update
      const formData = new FormData();

      // Add all the product data fields
      formData.append("title", productData.title || "");
      formData.append("smallDescription", productData.smallDescription || "");
      formData.append("description", productData.description || "");
      formData.append(
        "existingProductImages",
        JSON.stringify(productData.existingProductImages || []),
      );
      formData.append("price", (productData.price || 0).toString());
      if (productData.discountPrice) {
        formData.append("discountPrice", productData.discountPrice.toString());
      }
      if (productData.quantity !== undefined) {
        formData.append("quantity", productData.quantity.toString());
      }
      if (productData.isFeatured !== undefined) {
        formData.append("isFeatured", productData.isFeatured.toString());
      }
      if (productData.status) {
        formData.append("status", productData.status.toLowerCase());
      }

      // Add categories as JSON string
      if (productData.categories) {
        formData.append("categories", JSON.stringify(productData.categories));
      }

      // Add attributes as JSON string
      if (productData.attributes) {
        formData.append("attributes", JSON.stringify(productData.attributes));
      }

      // Add new images if provided
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("newProductImages", file);
        });
      }
      // If no files provided, existing images will be preserved by the backend

      const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        method: "PATCH",
        // Don't set Content-Type header for FormData - let the browser set it with boundary
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
  deleteProduct: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${id}`, {
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
};
