import { Router } from "express";

import multer from "../utils/multer";
import {
  createUser,
  createGoogleUser,
  getUsers,
  getUserById,
  getUserByUid,
  updateUser,
  sendPasswordResetEmail,
  resetUserPassword,
  deleteUser,
} from "../controllers/user";
import {
  validateCreateUser,
  validateCreateGoogleUser,
  validateGetUsers,
  validateUpdateUser,
  validateIdParam,
  validateUidParam,
  validateEmailParam,
  validatePasswordResetEmail,
  validateResetUserPassword,
} from "../validators/user-validator";
import {
  verifyUser,
  verifyAdminUser,
  verifyOwnerOrAdmin,
} from "../middleware/verify-firebase-token";
import { runValidation } from "../middleware/validate";

const router = Router();

router.post("/", validateCreateUser, runValidation, createUser);
router.post(
  "/google-auth",
  validateCreateGoogleUser,
  runValidation,
  createGoogleUser
);
router.get("/", validateGetUsers, runValidation, verifyAdminUser, getUsers);
router.get(
  "/:id",
  validateIdParam,
  runValidation,
  verifyOwnerOrAdmin,
  getUserById
);
router.get(
  "/uid/:uid",
  validateUidParam,
  runValidation,
  verifyUser,
  getUserByUid
);
router.patch(
  "/:id",
  multer.single("avatar"),
  validateIdParam,
  validateUpdateUser,
  runValidation,
  verifyOwnerOrAdmin,
  updateUser
);
router.post(
  "/reset-password",
  validatePasswordResetEmail,
  runValidation,
  sendPasswordResetEmail
);
router.patch(
  "/reset-password/:email",
  validateEmailParam,
  validateResetUserPassword,
  runValidation,
  verifyUser,
  resetUserPassword
);
router.delete(
  "/:id",
  validateIdParam,
  runValidation,
  verifyAdminUser,
  deleteUser
);

export default router;
