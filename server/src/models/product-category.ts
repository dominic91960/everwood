import { Schema, model } from "mongoose";

const ProductCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default model(
  "ProductCategory",
  ProductCategorySchema,
  "product_categories"
);
