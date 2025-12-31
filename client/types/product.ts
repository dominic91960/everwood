// ----- ----- START: BASE PRODUCT TYPES ----- -----
export interface IProductCategory {
  _id: string;
  name: string;
  description: string;
}
export interface IBaseProductPayload {
  title: string;
  smallDescription: string;
  description: string;
  categories: string[];
  isFeatured: boolean;
  status: "draft" | "public" | "private";
}
export interface IBaseProduct {
  _id: string;
  title: string;
  smallDescription: string;
  description: string;
  categories: IProductCategory[];
  isFeatured: boolean;
  status: "draft" | "public" | "private";
  createdAt: Date;
  updatedAt: Date;
}
// ----- ----- END: BASE PRODUCT TYPES ----- -----

// ----- ----- START: SIMPLE PRODUCT TYPES ----- -----
export interface ISimpleProductPayloadAttribute {
  attribute: string;
  selectedVariations: string[];
}

export interface ISimpleProductAttribute {
  attribute: {
    _id: string;
    name: string;
    variations: string[];
  };
  selectedVariations: string[];
}

export interface ICreateSimpleProductPayload extends IBaseProductPayload {
  type: "simple";
  sku: string;
  productImages: File[];
  price: number;
  discountPrice: number;
  attributes: ISimpleProductPayloadAttribute[];
  quantity: number;
}

export interface IUpdateSimpleProductPayload extends IBaseProductPayload {
  type: "simple";
  sku: string;
  retainedProductImages: string[];
  newProductImages: File[];
  price: number;
  discountPrice: number;
  attributes: ISimpleProductPayloadAttribute[];
  quantity: number;
}

export interface IUpdateSimpleProductQtyPayload {
  quantity: number;
}

export interface ISimpleProduct extends IBaseProduct {
  type: "simple";
  sku: string;
  productImages: string[];
  price: number;
  discountPrice: number;
  attributes: ISimpleProductAttribute[];
  quantity: number;
}
// ----- ----- END: SIMPLE PRODUCT TYPES ----- -----

// ----- ----- START: VARIABLE PRODUCT TYPES ----- -----
export interface IVariableProductPayloadAttribute {
  attribute: string;
  selectedVariation: string;
}

export interface IVariableProductAttribute {
  attribute: {
    _id: string;
    name: string;
    variations: string[];
  };
  selectedVariation: string;
}

export interface ICreateVariableProductPayload extends IBaseProductPayload {
  type: "variable";
  baseImages: File[];
  variantImages: File[];
  variations: {
    sku: string;
    attributes: IVariableProductPayloadAttribute[];
    price: number;
    discountPrice: number;
    quantity: number;
    variantImageIndexes: number[];
  }[];
}

export interface IUpdateVariableProductPayload extends IBaseProductPayload {
  type: "variable";
  retainedBaseImages: string[];
  newBaseImages: File[];
  newVariantImages: File[];
  variations: {
    sku: string;
    attributes: IVariableProductPayloadAttribute[];
    price: number;
    discountPrice: number;
    quantity: number;
    retainedVariantImages: string[];
    variantImageIndexes: number[];
  }[];
}

export interface IUpdateVariableProductQtyPayload {
  variations: {
    sku: string;
    quantity: number;
  }[];
}

export interface IVariableProduct extends IBaseProduct {
  type: "variable";
  baseImages: string[];
  variations: {
    sku: string;
    attributes: IVariableProductAttribute[];
    price: number;
    discountPrice: number;
    quantity: number;
    variantImages: string[];
  }[];
}
// ----- ----- END: VARIABLE PRODUCT TYPES ----- -----

// ----- ----- START: PRODUCT TYPES ----- -----
export type ICreateProductPayload =
  | ICreateSimpleProductPayload
  | ICreateVariableProductPayload;

export type IUpdateProductPayload =
  | IUpdateSimpleProductPayload
  | IUpdateVariableProductPayload;

export type TProduct = ISimpleProduct | IVariableProduct;
// ----- ----- END: PRODUCT TYPES ----- -----
