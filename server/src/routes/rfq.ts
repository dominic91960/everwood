import { Router } from "express";

import {
  createRFQ,
  getRFQs,
  getRFQById,
  getRFQsByUserId,
  updateRFQ,
  updateRFQStatus,
  deleteRFQ,
} from "../controllers/rfq";
import {
  validateCreateRFQ,
  validateUpdateRFQ,
  validateUpdateRFQStatus,
  validateIdParam,
} from "../validators/rfq-validator";
import { runValidation } from "../middleware/validate";

const router = Router();

router.post("/", validateCreateRFQ, runValidation, createRFQ);
router.get("/", getRFQs);
router.get("/:id", validateIdParam, runValidation, getRFQById);
router.get("/user/:id", validateIdParam, runValidation, getRFQsByUserId);
router.patch(
  "/:id",
  validateIdParam,
  validateUpdateRFQ,
  runValidation,
  updateRFQ
);
router.patch(
  "/:id/status",
  validateIdParam,
  validateUpdateRFQStatus,
  runValidation,
  updateRFQStatus
);
router.delete("/:id", validateIdParam, runValidation, deleteRFQ);

export default router;
