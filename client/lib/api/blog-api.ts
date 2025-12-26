import { BlogPostPayload } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const api = {
  baseUrl: API_BASE_URL,

  // Generic fetch wrapper with error handling
  async fetchJson(endpoint: string, options?: RequestInit) {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },

  // Blog/Content endpoints
  article: {
    // Create new content/blog
    async create(data: BlogPostPayload) {
      return api.fetchJson("/blog-post", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    // Get all contents with optional filters
    async list(params?: {
      isFeatured?: boolean;
      status?: "draft" | "published";
    }) {
      const queryParams = new URLSearchParams();
      if (params?.isFeatured)
        queryParams.append("isFeatured", params.isFeatured.toString());
      if (params?.status) queryParams.append("status", params.status);

      const queryString = queryParams.toString();
      const endpoint = `/blog-post${queryString ? `?${queryString}` : ""}`;

      return api.fetchJson(endpoint);
    },

    // Get single content by ID
    async getById(id: string) {
      return api.fetchJson(`/blog-post/${id}`);
    },

    // Update content
    async update(id: string, data: BlogPostPayload) {
      return api.fetchJson(`/blog-post/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    // Delete content
    async delete(id: string) {
      return api.fetchJson(`/blog-post/${id}`, {
        method: "DELETE",
      });
    },
  },
};

export default api;
