import { Router } from "express";

import {
  createBlogCategory,
  getBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
} from "../controllers/blog-post-category";
import {
  validateCreateBlogCategory,
  validateUpdateBlogCategory,
  validateIdParam,
} from "../validators/blog-post-category";
import { runValidation } from "../middleware/validate";

const router = Router();

router.post("/", validateCreateBlogCategory, runValidation, createBlogCategory);
router.get("/", getBlogCategories);
router.get("/:id", validateIdParam, runValidation, getBlogCategoryById);
router.put(
  "/:id",
  validateIdParam,
  validateUpdateBlogCategory,
  runValidation,
  updateBlogCategory
);
router.delete("/:id", validateIdParam, runValidation, deleteBlogCategory);

export default router;
