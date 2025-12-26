import { body, param, ValidationChain } from "express-validator";

export const validateCreateCoupon: ValidationChain[] = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Coupon title is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Coupon title must be between 2 and 50 characters"),

  body("couponType")
    .notEmpty()
    .withMessage("Coupon type is required")
    .isIn(["percentage", "exact"])
    .withMessage('Coupon type must be either "percentage" or "exact"'),

  body("code")
    .trim()
    .notEmpty()
    .withMessage("Coupon code is required")
    .isAlphanumeric()
    .withMessage("Coupon code must be alphanumeric")
    .isLength({ min: 2, max: 20 })
    .withMessage("Coupon code must be between 2 and 20 characters"),

  body("value")
    .notEmpty()
    .withMessage("Coupon value is required")
    .isFloat({ min: 0 })
    .withMessage("Coupon value must be a number greater than or equal to 0"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .toDate()
    .withMessage("Start date must be a valid date"),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .toDate()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
];

export const validateUpdateCoupon: ValidationChain[] = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Coupon title is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Coupon title must be between 2 and 50 characters"),

  body("couponType")
    .notEmpty()
    .withMessage("Coupon type is required")
    .isIn(["percentage", "exact"])
    .withMessage('Coupon type must be either "percentage" or "exact"'),

  body("code")
    .trim()
    .notEmpty()
    .withMessage("Coupon code is required")
    .isAlphanumeric()
    .withMessage("Coupon code must be alphanumeric")
    .isLength({ min: 2, max: 20 })
    .withMessage("Coupon code must be between 2 and 20 characters"),

  body("value")
    .notEmpty()
    .withMessage("Coupon value is required")
    .isFloat({ min: 0 })
    .withMessage("Coupon value must be a number greater than or equal to 0"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .toDate()
    .withMessage("Start date must be a valid date"),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .toDate()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
];

export const validateIdParam: ValidationChain[] = [
  param("id").isMongoId().withMessage("Invalid coupon ID"),
];

export const validateCodeParam: ValidationChain[] = [
  param("code")
    .trim()
    .toUpperCase()
    .notEmpty()
    .withMessage("Coupon code is required"),
];
