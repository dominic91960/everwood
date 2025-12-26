import { body, param, ValidationChain } from "express-validator";
import { Types } from "mongoose";

const isObjectId = (value: string): boolean => Types.ObjectId.isValid(value);

export const validateCreateRFQ: ValidationChain[] = [
  body("product").custom(isObjectId).withMessage("Invalid product ObjectId"),

  body("attributes")
    .isArray({ min: 1 })
    .withMessage("Attributes must be a non-empty array"),

  body("attributes.*.attribute")
    .custom(isObjectId)
    .withMessage("Invalid attribute ObjectId"),

  body("attributes.*.selectedVariations")
    .isArray({ min: 1 })
    .withMessage("selectedVariations must be a non-empty array"),

  body("attributes.*.selectedVariations.*")
    .isString()
    .withMessage("Each variation must be a string"),

  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),

  body("customer.name")
    .notEmpty()
    .withMessage("Customer name is required")
    .isLength({ min: 2 })
    .withMessage("Customer name must be at least 2 characters"),

  body("customer.email")
    .notEmpty()
    .withMessage("Customer email is required")
    .isEmail()
    .withMessage("Invalid customer email format"),

  body("customer.phoneNo")
    .optional()
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),

  body("customer.company").optional().isString().trim(),
  body("customer.notes").optional().isString().trim(),

  body("user")
    .optional()
    .custom(isObjectId)
    .withMessage("Invalid user ObjectId"),
];

export const validateUpdateRFQ: ValidationChain[] = [
  body("product").optional().custom(isObjectId),

  body("attributes")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Attributes must be a non-empty array"),

  body("attributes.*.attribute")
    .optional()
    .custom(isObjectId)
    .withMessage("Invalid attribute ObjectId"),

  body("attributes.*.selectedVariations")
    .optional()
    .isArray({ min: 1 })
    .withMessage("selectedVariations must be a non-empty array"),

  body("attributes.*.selectedVariations.*")
    .optional()
    .isString()
    .withMessage("Each variation must be a string"),

  body("quantity").optional().isInt({ min: 1 }),

  body("customer.name").optional().isString().isLength({ min: 2 }),
  body("customer.email").optional().isEmail(),
  body("customer.phoneNo").optional().isMobilePhone("any"),
  body("customer.company").optional().isString(),
  body("customer.notes").optional().isString(),

  body("status")
    .optional()
    .isIn(["pending", "reviewed", "quoted", "approved"])
    .withMessage("Invalid status value"),

  body("quotedPrice").optional().isFloat({ min: 0 }),

  body("user").optional().custom(isObjectId),
];

export const validateUpdateRFQStatus: ValidationChain[] = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "reviewed", "quoted", "approved"])
    .withMessage("Invalid status value"),
  body("quotedPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("quotedPrice must be 0 or more")
    .custom((value, { req }) => {
      if (
        req.body.status === "quoted" &&
        (value === undefined || value === null)
      ) {
        throw new Error("quotedPrice is required when status is 'quoted'");
      }
      return true;
    }),
];

export const validateIdParam: ValidationChain[] = [
  param("id").isMongoId().withMessage("Invalid RFQ ID"),
];
