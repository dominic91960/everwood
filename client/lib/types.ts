type AddressInfo = {
  firstName: string;
  lastName: string;
  phoneNo: string;
  email: string;
  address: string;
  apartment: string | undefined;
  city: string;
  state: string;
  zipCode: string;
};

type BaseProductPayload = {
  title: string;
  smallDescription: string;
  description: string;
  categories: string[];
  isFeatured: boolean;
  status: string;
};

type BaseProduct = {
  _id: string;
  title: string;
  smallDescription: string;
  description: string;
  categories: {
    _id: string;
    name: string;
    description: string;
  }[];
  isFeatured: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type UserRole = { _id: string; name: string };

export type User = {
  _id: string;
  providerId: string;
  avatar: string;
  uid: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNo: string;
  shippingInfo: AddressInfo;
  billingInfo: AddressInfo;
  role: UserRole;
};

export type SimpleProductPayload = BaseProductPayload & {
  type: "simple";
  sku: string;
  retainedProductImages: string[];
  price: number;
  discountPrice: number;
  quantity: number;
  attributes: {
    attribute: string;
    selectedVariations: string[];
  }[];
};

export type SimpleProduct = BaseProduct & {
  type: "simple";
  sku: string;
  productImages: string[];
  price: number;
  discountPrice: number;
  quantity: number;
  attributes: {
    attribute: {
      _id: string;
      name: string;
      variations: string[];
    };
    selectedVariations: string[];
  }[];
};

export type VariableProduct = BaseProduct & {
  type: "variable";
  baseImages: string[];
  variations: {
    sku: string;
    attributes: {
      attribute: {
        _id: string;
        name: string;
        variations: string[];
      };
      selectedVariation: string;
    }[];
    price: number;
    discountPrice: number;
    quantity: number;
    variantImages: string[];
  }[];
};

export type Product = SimpleProduct | VariableProduct;

export type CartItemAttribute = {
  attribute: { _id: string; name: string };
  selectedVariation: string;
};

export type CartItem = {
  _id: string;
  title: string;
  productImage: string;
  price: number;
  attributes: CartItemAttribute[];
  quantity: number;
};

export type BankAccount = {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  branchName: string;
};

export type PaymentSettings = {
  bankTransfer: {
    enabled: boolean;
    availableAccounts: BankAccount[];
  };
  cod: {
    enabled: boolean;
    title: string;
    description: string;
  };
  cardPayment: {
    enabled: boolean;
  };
  shippingFee: number;
};

export type Order = {
  products: CartItem[];
  subTotal: number;
  discountAmount: number;
  shippingCost: number;
  grandTotal: number;
  shippingInfo: AddressInfo;
  billingInfo: AddressInfo;
  paymentMethod: "cod" | "card-payment" | "bank-transfer";
  status:
    | "pending-payment"
    | "paid"
    | "processing"
    | "shipped"
    | "completed"
    | "cancelled";
};

export type FetchedOrder = {
  _id: string;
  shortId: string;
  products: {
    product: Product;
    attributes: CartItemAttribute[];
    orderQuantity: number;
    totalPrice: number;
  }[];
  subTotal: number;
  discountAmount: number;
  shippingCost: number;
  grandTotal: number;
  shippingInfo: AddressInfo;
  billingInfo: AddressInfo;
  paymentMethod: "cod" | "card-payment" | "bank-transfer";
  status:
    | "pending-payment"
    | "paid"
    | "processing"
    | "shipped"
    | "completed"
    | "cancelled";
  createdAt: string;
};

export type Category = {
  name: string;
  description: string;
};

export type Coupon = {
  _id: string;
  title: string;
  couponType: "percentage" | "exact";
  code: string;
  value: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateCouponData = {
  title: string;
  couponType: "percentage" | "exact";
  code: string;
  value: number;
  startDate: string;
  endDate: string;
};

export type StatisticsData = {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalEarnings: number;
  topProducts: { product: Product; purchasedTimes: number }[];
  monthlyEarnings: { date: string; earnings: number }[];
};

export type BlogPostPayload = {
  title: string;
  description: string;
  thumbnailFile: File | null;
  content: string;
  category: string;
  tags: string[];
  isFeatured: boolean;
  status: "draft" | "published";
};

export type BlogPostCategory = {
  _id: string;
  name: string;
  description: string;
};

export type BlogPostTag = {
  _id: string;
  name: string;
  description: string;
};

export type BlogPost = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  content: string;
  category: BlogPostCategory;
  tags: BlogPostTag[];
  isFeatured: boolean;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};
