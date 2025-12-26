import { Schema, model } from "mongoose";
import simpleProductSchema from "./simple-product";
import variableProductSchema from "./variable-product";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    smallDescription: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductCategory",
        required: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "public", "private"],
      lowercase: true,
      default: "draft",
    },
  },
  { discriminatorKey: "type", timestamps: true }
);

const Product = model("Product", productSchema);
Product.discriminator("simple", simpleProductSchema);
Product.discriminator("variable", variableProductSchema);

export default Product;
