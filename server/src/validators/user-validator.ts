import { body, param, query, ValidationChain } from "express-validator";

export const validateCreateUser: ValidationChain[] = [
  body("avatar").notEmpty().withMessage("Avatar URL is required"),

  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters"),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters"),

  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("phoneNo")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),

  body("role").isMongoId().withMessage("Invalid role ID"),
];

export const validateCreateGoogleUser: ValidationChain[] = [
  body("providerId").notEmpty().withMessage("Auth providerId is required"),

  body("avatar").notEmpty().withMessage("Avatar URL is required"),

  body("uid").notEmpty().withMessage("uid is required"),

  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters"),

  body("lastName")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters"),

  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("phoneNo")
    .optional()
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),

  body("role").isMongoId().withMessage("Invalid role ID"),
];

export const validateGetUsers: ValidationChain[] = [
  query("role").optional().isMongoId().withMessage("Invalid role ID"),
];

export const validateUpdateUser: ValidationChain[] = [
  query("field")
    .notEmpty()
    .withMessage("Field parameter is required")
    .isIn([
      "avatar",
      "profile",
      "email",
      "username",
      "password",
      "phoneNo",
      "addressInfo",
      "shippingInfo",
      "billingInfo",
    ])
    .withMessage(
      'Field must be one of "avatar", "profile", "email", "username", "password", "phoneNo", "addressInfo", "shippingInfo" or "billingInfo"'
    ),

  body("avatar")
    .if((value, { req }) => (req as any).query.field === "avatar")
    .custom((value, { req }) => {
      const file = (req as any).file as { mimetype: string; size: number };

      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 2 * 1024 * 1024;

      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error("Only JPEG, PNG, or GIF images are allowed");
      }
      if (file.size > maxSize) {
        throw new Error("Each image must be smaller than 2 MB");
      }

      return true;
    }),

  body("firstName")
    .if((value, { req }) => (req as any).query.field === "profile")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters"),

  body("lastName")
    .if((value, { req }) => (req as any).query.field === "profile")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters"),

  body("username")
    .if((value, { req }) => (req as any).query.field === "username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("email")
    .if((value, { req }) => (req as any).query.field === "email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("phoneNo")
    .if((value, { req }) => (req as any).query.field === "phoneNo")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),

  body("newPassword")
    .if((value, { req }) => (req as any).query.field === "password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password must be between 8 and 32 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),

  // SHIPPING INFO
  body("shippingInfo.firstName")
    .if((value, { req }) =>
      ["addressInfo", "shippingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Shipping first name is required")
    .isLength({ min: 2 })
    .withMessage("Shipping first name must be at least 2 characters"),

  body("shippingInfo.lastName")
    .if((value, { req }) =>
      ["addressInfo", "shippingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Shipping last name is required")
    .isLength({ min: 2 })
    .withMessage("Shipping last name must be at least 2 characters"),

  body("shippingInfo.phoneNo")
    .if((value, { req }) =>
      ["addressInfo", "shippingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Shipping phone number is required")
    .isMobilePhone("any")
    .withMessage("Invalid shipping phone number"),

  body("shippingInfo.email")
    .if((value, { req }) =>
      ["addressInfo", "shippingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Shipping email is required")
    .isEmail()
    .withMessage("Invalid shipping email format"),

  body("shippingInfo.address")
    .if((value, { req }) =>
      ["addressInfo", "shippingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Shipping address is required")
    .isLength({ min: 5 })
    .withMessage("Shipping address must be at least 5 characters"),

  body("shippingInfo.apartment")
    .if((value, { req }) =>
      ["addressInfo", "shippingInfo"].includes((req as any).query.field)
    )
    .optional(),

  body("shippingInfo.city")
    .if((value, { req }) =>
      ["addressInfo", "shippingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Shipping city is required")
    .isLength({ min: 2 })
    .withMessage("Shipping city must be at least 2 characters"),

  body("shippingInfo.state")
    .if((value, { req }) =>
      ["addressInfo", "shippingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Shipping state is required")
    .isLength({ min: 2 })
    .withMessage("Shipping state must be at least 2 characters"),

  body("shippingInfo.zipCode")
    .if((value, { req }) =>
      ["addressInfo", "shippingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Shipping zip code is required")
    .isPostalCode("any")
    .withMessage("Invalid shipping zip code format"),

  // BILLING INFO
  body("billingInfo.firstName")
    .if((value, { req }) =>
      ["addressInfo", "billingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Billing first name is required")
    .isLength({ min: 2 })
    .withMessage("Billing first name must be at least 2 characters"),

  body("billingInfo.lastName")
    .if((value, { req }) =>
      ["addressInfo", "billingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Billing last name is required")
    .isLength({ min: 2 })
    .withMessage("Billing last name must be at least 2 characters"),

  body("billingInfo.phoneNo")
    .if((value, { req }) =>
      ["addressInfo", "billingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Billing phone number is required")
    .isMobilePhone("any")
    .withMessage("Invalid Billing phone number"),

  body("billingInfo.email")
    .if((value, { req }) =>
      ["addressInfo", "billingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Billing email is required")
    .isEmail()
    .withMessage("Invalid Billing email format"),

  body("billingInfo.address")
    .if((value, { req }) =>
      ["addressInfo", "billingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Billing address is required")
    .isLength({ min: 5 })
    .withMessage("Billing address must be at least 5 characters"),

  body("billingInfo.apartment")
    .if((value, { req }) =>
      ["addressInfo", "billingInfo"].includes((req as any).query.field)
    )
    .optional(),

  body("billingInfo.city")
    .if((value, { req }) =>
      ["addressInfo", "billingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Billing city is required")
    .isLength({ min: 2 })
    .withMessage("Billing city must be at least 2 characters"),

  body("billingInfo.state")
    .if((value, { req }) =>
      ["addressInfo", "billingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Billing state is required")
    .isLength({ min: 2 })
    .withMessage("Billing state must be at least 2 characters"),

  body("billingInfo.zipCode")
    .if((value, { req }) =>
      ["addressInfo", "billingInfo"].includes((req as any).query.field)
    )
    .notEmpty()
    .withMessage("Billing zip code is required")
    .isPostalCode("any")
    .withMessage("Invalid billing zip code format"),

  body("role")
    .if((value, { req }) => (req as any).query.field === "profile")
    .isMongoId()
    .withMessage("Invalid role ID"),
];

export const validateIdParam: ValidationChain[] = [
  param("id").isMongoId().withMessage("Invalid user id"),
];

export const validateUidParam: ValidationChain[] = [
  param("uid").notEmpty().withMessage("Invalid uid"),
];

export const validateEmailParam: ValidationChain[] = [
  param("email")
    .notEmpty()
    .withMessage("Email parameter is required")
    .isEmail()
    .withMessage("Parameter is not an email"),
];

export const validatePasswordResetEmail: ValidationChain[] = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
];

export const validateResetUserPassword: ValidationChain[] = [
  body("newPassword")
    .if((value, { req }) => (req as any).query.field === "password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password must be between 8 and 32 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),
];
