import { Request, Response, NextFunction } from "express";
import BlogCategory from "../models/blog-post-category";

const createBlogCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;
    const category = new BlogCategory({ name, description });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

const getBlogCategories = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await BlogCategory.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

const getBlogCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const category = await BlogCategory.findById(id);

    if (!category)
      return res.status(404).json({ message: "Blog category not found" });
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

const updateBlogCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await BlogCategory.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!category)
      return res.status(404).json({ message: "Blog category not found" });
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

const deleteBlogCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const category = await BlogCategory.findByIdAndDelete(id);

    if (!category)
      return res.status(404).json({ message: "Blog category not found" });
    res.status(200).json({ message: "Blog category deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export {
  createBlogCategory,
  getBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
};
