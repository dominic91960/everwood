import { body, param, ValidationChain } from "express-validator";
import { Types } from "mongoose";

const isObjectId = (value: string): boolean => Types.ObjectId.isValid(value);

export const validateOrder: ValidationChain[] = [
  body("products")
    .isArray({ min: 1 })
    .withMessage("Products must be a non-empty array"),

  body("products.*.product")
    .custom(isObjectId)
    .withMessage("Invalid product ObjectId"),

  body("products.*.attributes")
    .isArray({ min: 1 })
    .withMessage("Attributes must be a non-empty array"),

  body("products.*.attributes.*.attribute")
    .custom(isObjectId)
    .withMessage("Invalid attribute ObjectId"),

  body("products.*.attributes.*.selectedVariation")
    .trim()
    .notEmpty()
    .withMessage("Selected variation is required"),

  body("products.*.orderQuantity")
    .isInt({ min: 1 })
    .withMessage("Order quantity must be at least 1"),

  body("products.*.totalPrice")
    .isFloat({ min: 0 })
    .withMessage("Total price must be 0 or more"),

  body("subTotal")
    .isFloat({ min: 0 })
    .withMessage("SubTotal must be 0 or more"),

  body("discountAmount")
    .isFloat({ min: 0 })
    .withMessage("Discount amount must be 0 or more"),

  body("shippingCost")
    .isFloat({ min: 0 })
    .withMessage("Shipping cost must be 0 or more"),

  body("grandTotal")
    .isFloat({ min: 0 })
    .withMessage("Grand total must be 0 or more"),

  body("user")
    .optional()
    .custom(isObjectId)
    .withMessage("Invalid user ObjectId"),

  body("shippingInfo.firstName")
    .notEmpty()
    .withMessage("Shipping first name is required")
    .isLength({ min: 2 })
    .withMessage("Shipping first name must be at least 2 characters"),

  body("shippingInfo.lastName")
    .notEmpty()
    .withMessage("Shipping last name is required")
    .isLength({ min: 2 })
    .withMessage("Shipping last name must be at least 2 characters"),

  body("shippingInfo.phoneNo")
    .notEmpty()
    .withMessage("Shipping phone number is required")
    .isMobilePhone("any")
    .withMessage("Invalid shipping phone number"),

  body("shippingInfo.email")
    .notEmpty()
    .withMessage("Shipping email is required")
    .isEmail()
    .withMessage("Invalid shipping email format"),

  body("shippingInfo.address")
    .notEmpty()
    .withMessage("Shipping address is required")
    .isLength({ min: 5 })
    .withMessage("Shipping address must be at least 5 characters"),

  body("shippingInfo.city")
    .notEmpty()
    .withMessage("Shipping city is required")
    .isLength({ min: 2 })
    .withMessage("Shipping city must be at least 2 characters"),

  body("shippingInfo.state")
    .notEmpty()
    .withMessage("Shipping state is required")
    .isLength({ min: 2 })
    .withMessage("Shipping state must be at least 2 characters"),

  body("shippingInfo.zipCode")
    .notEmpty()
    .withMessage("Shipping zip code is required")
    .isPostalCode("any")
    .withMessage("Invalid shipping zip code format"),

  body("billingInfo.firstName")
    .notEmpty()
    .withMessage("Billing first name is required")
    .isLength({ min: 2 })
    .withMessage("Billing first name must be at least 2 characters"),

  body("billingInfo.lastName")
    .notEmpty()
    .withMessage("Billing last name is required")
    .isLength({ min: 2 })
    .withMessage("Billing last name must be at least 2 characters"),

  body("billingInfo.phoneNo")
    .notEmpty()
    .withMessage("Billing phone number is required")
    .isMobilePhone("any")
    .withMessage("Invalid billing phone number"),

  body("billingInfo.email")
    .notEmpty()
    .withMessage("Billing email is required")
    .isEmail()
    .withMessage("Invalid billing email format"),

  body("billingInfo.address")
    .notEmpty()
    .withMessage("Billing address is required")
    .isLength({ min: 5 })
    .withMessage("Billing address must be at least 5 characters"),

  body("billingInfo.city")
    .notEmpty()
    .withMessage("Billing city is required")
    .isLength({ min: 2 })
    .withMessage("Billing city must be at least 2 characters"),

  body("billingInfo.state")
    .notEmpty()
    .withMessage("Billing state is required")
    .isLength({ min: 2 })
    .withMessage("Billing state must be at least 2 characters"),

  body("billingInfo.zipCode")
    .notEmpty()
    .withMessage("Billing zip code is required")
    .isPostalCode("any")
    .withMessage("Invalid billing zip code format"),

  body("paymentMethod").notEmpty().withMessage("Payment method is required"),

  body("status")
    .optional()
    .isIn([
      "pending-payment",
      "paid",
      "processing",
      "shipped",
      "completed",
      "cancelled",
    ])
    .withMessage("Invalid status value"),
];

export const validateUpdateOrderStatus: ValidationChain[] = [
  body("status")
    .optional()
    .isIn([
      "pending-payment",
      "paid",
      "processing",
      "shipped",
      "completed",
      "cancelled",
    ])
    .withMessage("Invalid status value"),
];

export const validateIdParam: ValidationChain[] = [
  param("id").isMongoId().withMessage("Invalid coupon ID"),
];
