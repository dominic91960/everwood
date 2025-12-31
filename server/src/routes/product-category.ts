import { Router } from "express";

import {
  createProductCategory,
  getProductCategories,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory,
} from "../controllers/product-category";
import {
  validateCreateProductCategory,
  validateUpdateProductCategory,
  validateIdParam,
} from "../validators/product-category-validator";
import { runValidation } from "../middleware/validate";

const router = Router();

router.post(
  "/",
  validateCreateProductCategory,
  runValidation,
  createProductCategory
);
router.get("/", getProductCategories);
router.get("/:id", validateIdParam, runValidation, getProductCategoryById);
router.patch(
  "/:id",
  validateIdParam,
  validateUpdateProductCategory,
  runValidation,
  updateProductCategory
);
router.delete("/:id", validateIdParam, runValidation, deleteProductCategory);

export default router;
