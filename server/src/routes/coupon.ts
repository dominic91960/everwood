import { Router } from "express";

import {
  createCoupon,
  getCoupons,
  getCouponById,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupon";
import {
  validateCreateCoupon,
  validateUpdateCoupon,
  validateIdParam,
  validateCodeParam,
} from "../validators/coupon-validator";
import { runValidation } from "../middleware/validate";

const router = Router();

router.post("/", validateCreateCoupon, runValidation, createCoupon);
router.get("/", getCoupons);
router.get("/:id", validateIdParam, runValidation, getCouponById);
router.get("/code/:code", validateCodeParam, runValidation, getCouponByCode);
router.patch(
  "/:id",
  validateIdParam,
  validateUpdateCoupon,
  runValidation,
  updateCoupon
);
router.delete("/:id", validateIdParam, runValidation, deleteCoupon);

export default router;
