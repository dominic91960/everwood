import { Router } from "express";

import {
  createUserRole,
  getUserRoles,
  getUserRoleById,
  updateUserRole,
  deleteUserRole,
} from "../controllers/user-role";
import {
  validateCreateUserRole,
  validateUpdateUserRole,
  validateIdParam,
} from "../validators/user-role-validator";
import { runValidation } from "../middleware/validate";

const router = Router();

router.post("/", validateCreateUserRole, runValidation, createUserRole);
router.get("/", getUserRoles);
router.get("/:id", validateIdParam, runValidation, getUserRoleById);
router.patch(
  "/:id",
  validateIdParam,
  validateUpdateUserRole,
  runValidation,
  updateUserRole
);
router.delete("/:id", validateIdParam, runValidation, deleteUserRole);

export default router;
