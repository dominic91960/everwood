import { Schema } from "mongoose";

const productAttributeSchema = new Schema(
  {
    attribute: {
      type: Schema.Types.ObjectId,
      ref: "ProductAttribute",
      required: true,
    },
    selectedVariation: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const variationSchema = new Schema(
  {
    sku: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    attributes: {
      type: [productAttributeSchema],
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
    variantImages: [{ type: String, default: [] }],
  },
  { _id: false }
);

const variableProductSchema = new Schema({
  baseImages: {
    type: [String],
    required: true,
  },
  variations: {
    type: [variationSchema],
    required: true,
  },
});

export default variableProductSchema;
