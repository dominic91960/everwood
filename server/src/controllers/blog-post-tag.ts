import { Request, Response, NextFunction } from "express";
import BlogTag from "../models/blog-post-tag";

const createBlogTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;
    const tag = new BlogTag({ name, description });
    await tag.save();

    res.status(201).json(tag);
  } catch (err) {
    next(err);
  }
};

const getBlogTags = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await BlogTag.find().sort({ createdAt: -1 });
    res.status(200).json(tags);
  } catch (err) {
    next(err);
  }
};

const getBlogTagById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const tag = await BlogTag.findById(id);

    if (!tag) return res.status(404).json({ message: "Blog tag not found" });
    res.status(200).json(tag);
  } catch (err) {
    next(err);
  }
};

const updateBlogTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const tag = await BlogTag.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!tag) return res.status(404).json({ message: "Blog tag not found" });
    res.status(200).json(tag);
  } catch (err) {
    next(err);
  }
};

const deleteBlogTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const tag = await BlogTag.findByIdAndDelete(id);

    if (!tag) return res.status(404).json({ message: "Blog tag not found" });
    res.status(200).json({ message: "Blog tag deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export {
  createBlogTag,
  getBlogTags,
  getBlogTagById,
  updateBlogTag,
  deleteBlogTag,
};
