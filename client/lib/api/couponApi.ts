// Coupon API service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Coupon {
  _id: string;
  title: string;
  couponType: 'percentage' | 'exact';
  code: string;
  value: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponData {
  title: string;
  couponType: 'percentage' | 'exact';
  code: string;
  value: number;
  startDate: string;
  endDate: string;
}

export interface UpdateCouponData {
  title?: string;
  couponType?: 'percentage' | 'exact';
  code?: string;
  value?: number;
  startDate?: string;
  endDate?: string;
}

export const couponApi = {
  // Create new coupon
  createCoupon: async (couponData: CreateCouponData): Promise<Coupon> => {
    try {
      const response = await fetch(`${API_BASE_URL}/coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(couponData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create coupon');
      }

      const result = await response.json();
      console.log('Create coupon API response:', result);
      return result;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  },

  // Get all coupons
  getCoupons: async (): Promise<Coupon[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/coupon`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch coupons');
      }

      const result = await response.json();
      console.log('API Response for getCoupons:', result);
      return result;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  },

  // Get coupon by ID
  getCouponById: async (id: string): Promise<Coupon> => {
    try {
      const response = await fetch(`${API_BASE_URL}/coupon/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch coupon');
      }

      const result = await response.json();
      console.log('API Response for getCouponById:', result);
      return result;
    } catch (error) {
      console.error('Error fetching coupon:', error);
      throw error;
    }
  },

  // Update coupon
  updateCoupon: async (id: string, couponData: UpdateCouponData): Promise<Coupon> => {
    try {
      const response = await fetch(`${API_BASE_URL}/coupon/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(couponData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update coupon');
      }

      const result = await response.json();
      console.log('Update coupon API response:', result);
      return result;
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  },

  // Delete coupon
  deleteCoupon: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/coupon/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete coupon');
      }

      console.log('Coupon deleted successfully');
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  },
};
