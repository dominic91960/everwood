import { body, param, ValidationChain } from "express-validator";
import { Types } from "mongoose";

export const validateCreateAttribute: ValidationChain[] = [
  body("name")
    .notEmpty()
    .withMessage("Attribute name is required")
    .isString()
    .withMessage("Attribute name must be a string")
    .trim(),

  body("variations")
    .isArray()
    .withMessage("Variations must be a non-empty array"),

  body("variations.*")
    .notEmpty()
    .withMessage("Each variation is required")
    .isString()
    .withMessage("Each variation must be a string")
    .trim(),
];

export const validateUpdateAttribute: ValidationChain[] = [
  param("id")
    .custom((value: string) => Types.ObjectId.isValid(value))
    .withMessage("Invalid attribute ID"),

  body("name")
    .optional()
    .isString()
    .withMessage("Attribute name must be a string")
    .trim(),

  body("variations")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Variations must be a non-empty array"),

  body("variations.*")
    .optional()
    .isString()
    .withMessage("Each variation must be a string")
    .trim(),
];

export const validateIdParam: ValidationChain[] = [
  param("id").isMongoId().withMessage("Invalid attribute ID"),
];
