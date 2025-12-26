import { Schema, model } from "mongoose";

const ProductAttributeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    variations: [
      {
        type: String,
        default: "",
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

export default model(
  "ProductAttribute",
  ProductAttributeSchema,
  "product_attributes"
);
