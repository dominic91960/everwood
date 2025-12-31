import { Router } from "express";

import {
  createAttribute,
  getAttributes,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
  checkAttributeUsage,
  checkVariationUsage,
} from "../controllers/product-attribute";
import {
  validateCreateAttribute,
  validateUpdateAttribute,
  validateIdParam,
} from "../validators/product-attribute-validator";
import { runValidation } from "../middleware/validate";

const router = Router();

router.post("/", validateCreateAttribute, runValidation, createAttribute);
router.get("/", getAttributes);
router.get("/:id", validateIdParam, runValidation, getAttributeById);
router.patch(
  "/:id",
  validateIdParam,
  validateUpdateAttribute,
  runValidation,
  updateAttribute
);
router.delete("/:id", validateIdParam, runValidation, deleteAttribute);
// Check if attribute is being used by products
router.get("/:id/usage", validateIdParam, runValidation, checkAttributeUsage);
// Check if a specific variation is being used by products
router.get(
  "/:id/variation/:variation/usage",
  validateIdParam,
  runValidation,
  checkVariationUsage
);

export default router;
