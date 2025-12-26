import { body, param, ValidationChain } from "express-validator";

const baseBlogTagValidation: ValidationChain[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 15, max: 150 })
    .withMessage("Description must be between 15 and 150 characters"),
];

export const validateCreateBlogTag: ValidationChain[] = [
  ...baseBlogTagValidation,
];

export const validateUpdateBlogTag: ValidationChain[] = [
  ...baseBlogTagValidation,
];

export const validateIdParam: ValidationChain[] = [
  param("id").isMongoId().withMessage("Invalid blog tag ID"),
];
