const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}

export const categoryApi = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/product-category`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },

  // Create a new category
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/product-category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create category');
    }
    
    return response.json();
  },

  // Update a category
  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/product-category/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update category');
    }
    
    return response.json();
  },

  // Delete a category
  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/product-category/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete category');
    }
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/product-category/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }
    return response.json();
  },
};
