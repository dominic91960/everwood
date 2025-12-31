import { Router } from "express";

import multer from "../utils/multer";
import { parseJson } from "../middleware/parse-json";
import {
  createBlogPost,
  getBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/blog-post";
import {
  validateCreateBlogPost,
  validateUpdateBlogPost,
  validateIdParam,
  validateGetBlogPosts,
} from "../validators/blog-post";
import { runValidation } from "../middleware/validate";

const router = Router();

router.post(
  "/",
  multer.single("thumbnail"),
  parseJson("tags"),
  validateCreateBlogPost,
  runValidation,
  createBlogPost
);
router.get("/", validateGetBlogPosts, runValidation, getBlogPosts);
router.get("/:id", validateIdParam, runValidation, getBlogPostById);
router.put(
  "/:id",
  multer.single("newThumbnail"),
  parseJson("tags"),
  validateIdParam,
  validateUpdateBlogPost,
  runValidation,
  updateBlogPost
);
router.delete("/:id", validateIdParam, runValidation, deleteBlogPost);

export default router;
