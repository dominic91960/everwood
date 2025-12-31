import { Schema, model } from "mongoose";

const BlogPostTagSchema = new Schema(
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

export default model("BlogPostTag", BlogPostTagSchema, "blog_post_tags");
