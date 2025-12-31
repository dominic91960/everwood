import { Router } from "express";

import {
  createBlogTag,
  getBlogTags,
  getBlogTagById,
  updateBlogTag,
  deleteBlogTag,
} from "../controllers/blog-post-tag";
import {
  validateCreateBlogTag,
  validateUpdateBlogTag,
  validateIdParam,
} from "../validators/blog-post-tag";
import { runValidation } from "../middleware/validate";

const router = Router();

router.post("/", validateCreateBlogTag, runValidation, createBlogTag);
router.get("/", getBlogTags);
router.get("/:id", validateIdParam, runValidation, getBlogTagById);
router.put(
  "/:id",
  validateIdParam,
  validateUpdateBlogTag,
  runValidation,
  updateBlogTag
);
router.delete("/:id", validateIdParam, runValidation, deleteBlogTag);

export default router;
