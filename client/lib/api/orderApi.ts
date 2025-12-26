// Order API service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface OrderProduct {
  product: string; // product ID
  attributes: Array<{
    attribute: string; // attribute ID
    selectedVariation: string;
  }>;
  orderQuantity: number;
  totalPrice: number;
}

export interface OrderShippingInfo {
  firstName: string;
  lastName: string;
  phoneNo: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OrderBillingInfo {
  firstName: string;
  lastName: string;
  phoneNo: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CreateOrderData {
  products: OrderProduct[];
  subTotal: number;
  discountAmount: number;
  shippingCost: number;
  grandTotal: number;
  shippingInfo: OrderShippingInfo;
  billingInfo: OrderBillingInfo;
  paymentMethod: string;
  status?: string;
}

export interface Order {
  _id: string;
  products: Array<{
    product: {
      _id: string;
      title: string;
      price: number;
      discountPrice?: number;
      productImages: string[];
    };
    attributes: Array<{
      attribute: {
        _id: string;
        name: string;
        variations: string[];
      };
      selectedVariation: string;
    }>;
    orderQuantity: number;
    totalPrice: number;
  }>;
  subTotal: number;
  discountAmount: number;
  shippingCost: number;
  grandTotal: number;
  shippingInfo: OrderShippingInfo;
  billingInfo: OrderBillingInfo;
  paymentMethod: string;
  status: 'pending-payment' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export const orderApi = {
  // Create new order
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    try {
      const response = await fetch(`${API_BASE_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const result = await response.json();
      console.log('Create order API response:', result);
      return result;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get all orders
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/order`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch orders');
      }

      const result = await response.json();
      console.log('API Response for getOrders:', result);
      return result;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await fetch(`${API_BASE_URL}/order/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch order');
      }

      const result = await response.json();
      console.log('API Response for getOrderById:', result);
      return result;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Update order
  updateOrder: async (id: string, orderData: Partial<CreateOrderData>): Promise<Order> => {
    try {
      const response = await fetch(`${API_BASE_URL}/order/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/order/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },
};
