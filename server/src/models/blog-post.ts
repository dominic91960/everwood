import { Schema, model } from "mongoose";

const BlogPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogPostCategory",
      required: true,
    },
    tags: { type: [Schema.Types.ObjectId], ref: "BlogPostTag", default: [] },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published"],
      lowercase: true,
      default: "draft",
    },
  },
  { timestamps: true }
);

export default model("BlogPost", BlogPostSchema, "blog_posts");
