import { body, param, ValidationChain } from "express-validator";

const baseBlogCategoryValidation: ValidationChain[] = [
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

export const validateCreateBlogCategory: ValidationChain[] = [
  ...baseBlogCategoryValidation,
];

export const validateUpdateBlogCategory: ValidationChain[] = [
  ...baseBlogCategoryValidation,
];

export const validateIdParam: ValidationChain[] = [
  param("id").isMongoId().withMessage("Invalid blog category ID"),
];
