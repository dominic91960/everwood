import { body, param, check, ValidationChain } from "express-validator";

export const validateUpdatePaymentSettings: ValidationChain[] = [
  body("bankTransferEnabled")
    .optional()
    .isBoolean()
    .withMessage("bankTransfer.enabled must be a boolean"),

  body("codEnabled")
    .optional()
    .isBoolean()
    .withMessage("cod.enabled must be a boolean"),

  body("cardPaymentEnabled")
    .optional()
    .isBoolean()
    .withMessage("cardPayment.enabled must be a boolean"),

  check().custom((value, { req }) => {
    const { bankTransferEnabled, codEnabled, cardPaymentEnabled } = req.body;

    if (!bankTransferEnabled && !codEnabled && !cardPaymentEnabled)
      throw new Error("At least one payment method must be enabled");

    return true;
  }),

  body("shippingFee")
    .optional()
    .isNumeric()
    .withMessage("shippingFee must be a number")
    .custom((value) => value >= 0)
    .withMessage("shippingFee must be greater than or equal to 0"),
];

export const validateBankAccount: ValidationChain[] = [
  body("accountNumber")
    .notEmpty()
    .withMessage("Account number is required")
    .isString()
    .withMessage("Account number must be a string"),

  body("accountHolderName")
    .notEmpty()
    .withMessage("Account holder name is required")
    .isString()
    .withMessage("Account holder name must be a string"),

  body("bankName")
    .notEmpty()
    .withMessage("Bank name is required")
    .isString()
    .withMessage("Bank name must be a string"),

  body("branchName")
    .notEmpty()
    .withMessage("Branch name is required")
    .isString()
    .withMessage("Branch name must be a string"),
];

export const validateCodDetails: ValidationChain[] = [
  body("title")
    .notEmpty()
    .withMessage("COD title is required")
    .isString()
    .withMessage("COD title must be a string"),

  body("description")
    .notEmpty()
    .withMessage("COD description is required")
    .isString()
    .withMessage("COD description must be a string"),
];

export const validateIdParam: ValidationChain[] = [
  param("id").isMongoId().withMessage("Invalid role ID"),
];
