import { Router } from "express";

import {
  getPaymentSettings,
  updatePaymentSettings,
  addBankAccount,
  updateBankAccount,
  deleteBankAccount,
  updateCodDetails,
} from "../controllers/payment-setting";
import {
  validateUpdatePaymentSettings,
  validateBankAccount,
  validateCodDetails,
  validateIdParam,
} from "../validators/payment-setting-validator";
import { runValidation } from "../middleware/validate";

const router = Router();

router.get("/", getPaymentSettings);
router.patch(
  "/",
  validateUpdatePaymentSettings,
  runValidation,
  updatePaymentSettings
);
router.post("/account", validateBankAccount, runValidation, addBankAccount);
router.patch(
  "/account/:id",
  validateIdParam,
  validateBankAccount,
  runValidation,
  updateBankAccount
);
router.delete(
  "/account/:id",
  validateIdParam,
  runValidation,
  deleteBankAccount
);
router.patch("/cod", validateCodDetails, runValidation, updateCodDetails);

export default router;
