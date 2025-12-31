import { Schema, model } from "mongoose";

const BlogPostCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default model(
  "BlogPostCategory",
  BlogPostCategorySchema,
  "blog_post_categories"
);
