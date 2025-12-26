import { Schema } from "mongoose";

const productAttributeSchema = new Schema(
  {
    attribute: {
      type: Schema.Types.ObjectId,
      ref: "ProductAttribute",
      required: true,
    },
    selectedVariations: {
      type: [String],
      required: true,
    },
  },
  { _id: false }
);

const simpleProductSchema = new Schema({
  sku: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  productImages: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discountPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  attributes: [productAttributeSchema],
});

export default simpleProductSchema;
