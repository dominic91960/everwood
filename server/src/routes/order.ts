import { Router } from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
  getOrderByUserId,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order";
import {
  validateOrder,
  validateUpdateOrderStatus,
  validateIdParam,
} from "../validators/order-validator";
import { runValidation } from "../middleware/validate";

const router = Router();

router.post("/", validateOrder, runValidation, createOrder);
router.get("/", getOrders);
router.get("/:id", validateIdParam, runValidation, getOrderById);
router.get("/user/:id", validateIdParam, runValidation, getOrderByUserId);
router.patch(
  "/:id",
  validateIdParam,
  validateOrder,
  runValidation,
  updateOrder
);
router.patch(
  "/:id/status",
  validateIdParam,
  validateUpdateOrderStatus,
  runValidation,
  updateOrderStatus
);
router.delete("/:id", validateIdParam, runValidation, deleteOrder);

export default router;
