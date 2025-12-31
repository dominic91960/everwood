import { Document, Types } from "mongoose";

// ----- ----- START: BASE PRODUCT TYPES ----- -----
interface IBaseProduct {
  title: string;
  smallDescription: string;
  description: string;
  categories: Types.ObjectId[];
  isFeatured: boolean;
  status: "draft" | "public" | "private";
}
// ----- ----- END: BASE PRODUCT TYPES ----- -----

// ----- ----- START: SIMPLE PRODUCT TYPES ----- -----
export interface ICreateSimpleProductPayload extends IBaseProduct {
  type: "simple";
  sku: string;
  productImages: Express.Multer.File[];
  price: number;
  discountPrice: number;
  attributes: {
    attribute: Types.ObjectId;
    selectedVariations: string[];
  }[];
  quantity: number;
}

export interface IUpdateSimpleProductPayload extends IBaseProduct {
  type: "simple";
  sku: string;
  retainedProductImages: string[];
  newProductImages: Express.Multer.File[];
  price: number;
  discountPrice: number;
  attributes: {
    attribute: Types.ObjectId;
    selectedVariations: string[];
  }[];
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
  attributes: {
    attribute: Types.ObjectId;
    selectedVariations: string[];
  }[];
  quantity: number;
}

export type TSimpleProductDocument = ISimpleProduct & Document;
// ----- ----- END: SIMPLE PRODUCT TYPES ----- -----

// ----- ----- START: VARIABLE PRODUCT TYPES ----- -----
export type TCreateVariableProductImagePayload = {
  baseImages: Express.Multer.File[];
  variantImages: Express.Multer.File[];
};

export interface ICreateVariableProductPayload extends IBaseProduct {
  type: "variable";
  variations: {
    sku: string;
    attributes: {
      attribute: Types.ObjectId;
      selectedVariation: string;
    }[];
    price: number;
    discountPrice: number;
    quantity: number;
    variantImageIndexes: number[];
  }[];
}

export type TUpdateVariableProductImagePayload = {
  newBaseImages: Express.Multer.File[];
  newVariantImages: Express.Multer.File[];
};

export interface IUpdateVariableProductPayload extends IBaseProduct {
  type: "variable";
  retainedBaseImages: string[];
  variations: {
    sku: string;
    attributes: {
      attribute: Types.ObjectId;
      selectedVariation: string;
    }[];
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
    attributes: {
      attribute: Types.ObjectId;
      selectedVariation: string;
    }[];
    price: number;
    discountPrice: number;
    quantity: number;
    variantImages: string[];
  }[];
}

export type TVariableProductDocument = IVariableProduct & Document;
// ----- ----- END: VARIABLE PRODUCT TYPES ----- -----
