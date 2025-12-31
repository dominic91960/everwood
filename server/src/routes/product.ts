import { Router } from "express";

import multer from "../utils/multer";
import {
  createSimpleProduct,
  updateSimpleProduct,
  updateSimpleProductQuantity,
  deleteSimpleProduct,
  createVariableProduct,
  updateVariableProduct,
  updateVariableProductQuantity,
  deleteVariableProduct,
  getProducts,
  getProductById,
} from "../controllers/product";
import {
  validateCreateSimpleProduct,
  validateUpdateSimpleProduct,
  validateUpdateSimpleProductQty,
  validateCreateVariableProduct,
  validateUpdateVariableProduct,
  validateUpdateVariableProductQty,
  validateGetProducts,
  validateIdParam,
} from "../validators/product";
import { parseJson } from "../middleware/parse-json";
import { parseNumber } from "../middleware/parse-number";
import { runValidation } from "../middleware/validate";

const router = Router();

router.post(
  "/simple",
  multer.array("productImages", 5),
  parseJson("categories"),
  parseJson("attributes"),
  parseNumber("price"),
  parseNumber("discountPrice"),
  parseNumber("quantity"),
  validateCreateSimpleProduct,
  runValidation,
  createSimpleProduct
);

router.put(
  "/simple/:id",
  multer.array("newProductImages", 5),
  parseJson("retainedProductImages"),
  parseJson("categories"),
  parseJson("attributes"),
  parseNumber("price"),
  parseNumber("discountPrice"),
  parseNumber("quantity"),
  validateIdParam,
  validateUpdateSimpleProduct,
  runValidation,
  updateSimpleProduct
);

router.patch(
  "/simple/quantity/:id",
  validateIdParam,
  validateUpdateSimpleProductQty,
  runValidation,
  updateSimpleProductQuantity
);

router.delete(
  "/simple/:id",
  validateIdParam,
  runValidation,
  deleteSimpleProduct
);

router.post(
  "/variable",
  multer.fields([
    { name: "baseImages", maxCount: 5 },
    { name: "variantImages", maxCount: 20 },
  ]),
  parseJson("categories"),
  parseJson("variations"),
  validateCreateVariableProduct,
  runValidation,
  createVariableProduct
);

router.put(
  "/variable/:id",
  multer.fields([
    { name: "newBaseImages", maxCount: 5 },
    { name: "newVariantImages", maxCount: 20 },
  ]),
  parseJson("categories"),
  parseJson("retainedBaseImages"),
  parseJson("variations"),
  validateIdParam,
  validateUpdateVariableProduct,
  runValidation,
  updateVariableProduct
);

router.patch(
  "/variable/quantity/:id",
  validateIdParam,
  validateUpdateVariableProductQty,
  runValidation,
  updateVariableProductQuantity
);

router.delete(
  "/variable/:id",
  validateIdParam,
  runValidation,
  deleteVariableProduct
);

router.get("/", validateGetProducts, runValidation, getProducts);

router.get("/:id", validateIdParam, runValidation, getProductById);

export default router;
