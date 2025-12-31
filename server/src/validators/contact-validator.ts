import { body, ValidationChain } from "express-validator";

export const validateContactMessage: ValidationChain[] = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("message")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage("Message must be between 20 and 300 characters"),

  body("recaptchaToken")
    .notEmpty()
    .withMessage("reCAPTCHA token is required")
    .isString()
    .withMessage("reCAPTCHA token must be a string")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Invalid reCAPTCHA token format"),
];
