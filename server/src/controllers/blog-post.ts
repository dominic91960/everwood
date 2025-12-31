import { Request, Response, NextFunction } from "express";

import { changeThumbnailImage } from "../utils/s3";
import BlogPost from "../models/blog-post";

const createBlogPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file as Express.Multer.File;
    const {
      title,
      description,
      content,
      category,
      tags,
      isFeatured = false,
      status = "draft",
    } = req.body;

    const thumbnail = await changeThumbnailImage("", file);
    const post = new BlogPost({
      title,
      description,
      thumbnail,
      content,
      category,
      tags,
      isFeatured,
      status,
    });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

const getBlogPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query: { status?: string; isFeatured?: boolean } = {};
    const { status, isFeatured } = req.query;

    if (status) query.status = status as string;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === "true";

    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .populate("category", "name description")
      .populate("tags", "name description");

    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

const getBlogPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const post = await BlogPost.findById(id)
      .populate("category", "name description")
      .populate("tags", "name description");
    if (!post) return res.status(404).json({ message: "Blog post not found" });

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

const updateBlogPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Blog post not found" });

    const file = req.file;
    const {
      title,
      description,
      content,
      category,
      tags,
      isFeatured = false,
      status = "draft",
    } = req.body;

    let thumbnail: string | null = null;
    if (file) thumbnail = await changeThumbnailImage(post.thumbnail, file);

    post.title = title;
    post.description = description;
    post.thumbnail = thumbnail ?? post.thumbnail;
    post.content = content;
    post.category = category;
    post.tags = tags;
    post.isFeatured = isFeatured;
    post.status = status;
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

const deleteBlogPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post)
      return res.status(404).json({
        message: "Blog post not found",
      });

    await post.deleteOne();
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

export {
  createBlogPost,
  getBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
};
