// Attribute API service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Attribute {
  _id: string;
  name: string;
  variations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttributeData {
  name: string;
  variations: string[];
}

export interface UpdateAttributeData {
  name?: string;
  variations?: string[];
}

export interface AttributeUsageInfo {
  isInUse: boolean;
  productCount: number;
  products: Array<{
    id: string;
    title: string;
  }>;
}

export interface VariationUsageInfo {
  isInUse: boolean;
  productCount: number;
  products: Array<{
    id: string;
    title: string;
  }>;
}

export const attributeApi = {
  // Create new attribute
  createAttribute: async (attributeData: CreateAttributeData): Promise<Attribute> => {
    try {
      const response = await fetch(`${API_BASE_URL}/attribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attributeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create attribute');
      }

      const result = await response.json();
      console.log('Create attribute API response:', result);
      return result;
    } catch (error) {
      console.error('Error creating attribute:', error);
      throw error;
    }
  },

  // Get all attributes
  getAttributes: async (): Promise<Attribute[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/attribute`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch attributes');
      }

      const result = await response.json();
      console.log('API Response for getAttributes:', result);
      return result;
    } catch (error) {
      console.error('Error fetching attributes:', error);
      throw error;
    }
  },

  // Get attribute by ID
  getAttributeById: async (id: string): Promise<Attribute> => {
    try {
      const response = await fetch(`${API_BASE_URL}/attribute/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch attribute');
      }

      const result = await response.json();
      console.log('API Response for getAttributeById:', result);
      return result;
    } catch (error) {
      console.error('Error fetching attribute:', error);
      throw error;
    }
  },

  // Update attribute
  updateAttribute: async (id: string, attributeData: UpdateAttributeData): Promise<Attribute> => {
    try {
      const response = await fetch(`${API_BASE_URL}/attribute/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attributeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update attribute');
      }

      const result = await response.json();
      console.log('Update attribute API response:', result);
      return result;
    } catch (error) {
      console.error('Error updating attribute:', error);
      throw error;
    }
  },

  // Delete attribute
  deleteAttribute: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/attribute/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete attribute');
      }

      console.log('Attribute deleted successfully');
    } catch (error) {
      console.error('Error deleting attribute:', error);
      throw error;
    }
  },

  // Check if attribute is being used by products
  checkAttributeUsage: async (id: string): Promise<AttributeUsageInfo> => {
    try {
      const response = await fetch(`${API_BASE_URL}/attribute/${id}/usage`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check attribute usage');
      }

      const result = await response.json();
      console.log('API Response for checkAttributeUsage:', result);
      return result;
    } catch (error) {
      console.error('Error checking attribute usage:', error);
      throw error;
    }
  },

  // Check if a specific variation is being used by products
  checkVariationUsage: async (id: string, variation: string): Promise<VariationUsageInfo> => {
    try {
      const response = await fetch(`${API_BASE_URL}/attribute/${id}/variation/${encodeURIComponent(variation)}/usage`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check variation usage');
      }

      const result = await response.json();
      console.log('API Response for checkVariationUsage:', result);
      return result;
    } catch (error) {
      console.error('Error checking variation usage:', error);
      throw error;
    }
  },
};
