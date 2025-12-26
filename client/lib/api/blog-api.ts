// API configuration and helper functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
          errorData.error || `HTTP error! status: ${response.status}`,
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
    async create(data: {
      title: string;
      content: string;
      tags?: string[];
      categories?: string[];
      type: string;
      location?: string;
      time?: string;
      thumbnail?: string;
      mode: "DRAFT" | "PUBLISHED";
      seoTitle?: string;
      metaDescription?: string;
      metaKeywords?: string[];
    }) {
      return api.fetchJson("/article", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    // Get all contents with optional filters
    async list(params?: { mode?: string; type?: string; category?: string }) {
      const queryParams = new URLSearchParams();
      if (params?.mode) queryParams.append("mode", params.mode);
      if (params?.type) queryParams.append("type", params.type);
      if (params?.category) queryParams.append("category", params.category);

      const queryString = queryParams.toString();
      const endpoint = `/article${queryString ? `?${queryString}` : ""}`;

      return api.fetchJson(endpoint);
    },

    // Get single content by ID
    async getById(id: string) {
      return api.fetchJson(`/article/${id}`);
    },

    // Update content
    async update(
      id: string,
      data: Partial<{
        title: string;
        content: string;
        tags?: string[];
        categories?: string[];
        type: string;
        location?: string;
        time?: string;
        thumbnail?: string;
        mode: "DRAFT" | "PUBLISHED";
        seoTitle?: string;
        metaDescription?: string;
        metaKeywords?: string[];
      }>,
    ) {
      return api.fetchJson(`/article/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    // Delete content
    async delete(id: string) {
      return api.fetchJson(`/article/${id}`, {
        method: "DELETE",
      });
    },

    // Get upcoming blog
    async getUpcomingBlog() {
      return api.fetchJson("/article/upcoming-blog");
    },
  },
};

export default api;
