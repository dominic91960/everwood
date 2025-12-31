const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const api = {
  baseUrl: API_BASE_URL,

  // Generic fetch wrapper with error handling
  async fetchJson(endpoint: string, options?: RequestInit) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers =
      options?.body instanceof FormData
        ? { ...options?.headers }
        : { "Content-Type": "application/json", ...options?.headers };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
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
    async create(data: FormData) {
      return api.fetchJson("/blog-post", {
        method: "POST",
        body: data,
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
    async update(id: string, data: FormData) {
      return api.fetchJson(`/blog-post/${id}`, {
        method: "PUT",
        body: data,
      });
    },

    // Delete content
    async delete(id: string) {
      return api.fetchJson(`/blog-post/${id}`, {
        method: "DELETE",
      });
    },
  },

  category: {
    async create(data: { name: string; description: string }) {
      return api.fetchJson("/blog-post-category", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    async list() {
      return api.fetchJson("/blog-post-category");
    },

    async getById(id: string) {
      return api.fetchJson(`/blog-post-category/${id}`);
    },

    async update(id: string, data: { name: string; description: string }) {
      return api.fetchJson(`/blog-post-category/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    async delete(id: string) {
      return api.fetchJson(`/blog-post-category/${id}`, {
        method: "DELETE",
      });
    },
  },

  tag: {
    async create(data: { name: string; description: string }) {
      return api.fetchJson("/blog-post-tag", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    async list() {
      return api.fetchJson("/blog-post-tag");
    },

    async getById(id: string) {
      return api.fetchJson(`/blog-post-tag/${id}`);
    },

    async update(id: string, data: { name: string; description: string }) {
      return api.fetchJson(`/blog-post-tag/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    async delete(id: string) {
      return api.fetchJson(`/blog-post-tag/${id}`, {
        method: "DELETE",
      });
    },
  },
};

export default api;
