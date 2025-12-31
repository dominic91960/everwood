import { body, param, query, check, ValidationChain } from "express-validator";
import {
  TCreateVariableProductImagePayload,
  TUpdateVariableProductImagePayload,
  IUpdateVariableProductPayload,
} from "../utils/types";

const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
const allowedMaxImageSize = 2 * 1024 * 1024;

const baseProductValidation: ValidationChain[] = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  body("smallDescription")
    .trim()
    .notEmpty()
    .withMessage("Small description is required")
    .isString()
    .withMessage("Small description must be a string"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

  body("categories")
    .isArray({ min: 1 })
    .withMessage("At least one category must be included"),

  body("categories.*")
    .isMongoId()
    .withMessage("Each category must be a MongoDB ObjectId"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be either true or false"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .toLowerCase()
    .isIn(["draft", "public", "private"])
    .withMessage('Status must be one of "draft", "public" or "private"'),
];

const baseSimpleProductValidation: ValidationChain[] = [
  ...baseProductValidation,

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .toLowerCase()
    .isIn(["simple"])
    .withMessage('Type must be "simple"'),

  body("sku")
    .trim()
    .notEmpty()
    .withMessage("SKU is required")
    .isString()
    .withMessage("SKU must be a string"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("discountPrice")
    .notEmpty()
    .withMessage("Discount price is required")
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive number")
    .custom((value, { req }) => {
      if (value > req.body.price)
        throw new Error("Discount price cannot be greater than price");
      return true;
    }),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),

  body("attributes")
    .isArray({ min: 1 })
    .withMessage("At least one attribute must be included"),

  body("attributes.*.attribute")
    .isMongoId()
    .withMessage("Each attribute must be include a MongoDB ObjectId"),

  body("attributes.*.selectedVariations")
    .isArray({ min: 1 })
    .withMessage("Each attribute must include at least one selected variation"),
];

const baseVariableProductValidation: ValidationChain[] = [
  ...baseProductValidation,

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .toLowerCase()
    .isIn(["variable"])
    .withMessage('Type must be "variable"'),

  body("variations.*.sku")
    .trim()
    .notEmpty()
    .withMessage("SKU is required")
    .isString()
    .withMessage("SKU must be a string"),

  body("variations.*.attributes")
    .isArray({ min: 1 })
    .withMessage("At least one attribute must be included"),

  body("variations.*.attributes.*.selectedVariation")
    .trim()
    .notEmpty()
    .withMessage("Each attribute must include a selected variation")
    .isString()
    .withMessage("Each selected variation must be a string"),

  body("variations.*.price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("variations.*.discountPrice")
    .notEmpty()
    .withMessage("Discount price is required")
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive number")
    .custom((value, { req }) => {
      if (value > req.body.price)
        throw new Error("Discount price cannot be greater than price");
      return true;
    }),

  body("variations.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),
];

export const validateCreateSimpleProduct: ValidationChain[] = [
  ...baseSimpleProductValidation,

  body("productImages").custom((_, { req }) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0)
      throw new Error("At least one product image is required");

    files.forEach((file) => {
      if (!allowedImageTypes.includes(file.mimetype))
        throw new Error("Only JPEG, JPG, or PNG images are allowed");
      if (file.size > allowedMaxImageSize)
        throw new Error("Each image must be smaller than 2 MB");
    });
    return true;
  }),
];

export const validateUpdateSimpleProduct: ValidationChain[] = [
  ...baseSimpleProductValidation,

  body("retainedProductImages")
    .isArray({ min: 0 })
    .withMessage("retainedProductImages must be an array"),

  body("retainedProductImages.*")
    .isURL()
    .withMessage("Each retained product image must be a valid URL"),

  body("newProductImages").custom((_, { req }) => {
    const files = req.files as Express.Multer.File[];

    if (!Array.isArray(files))
      throw new Error("newProductImages must be an array");
    if (files.length === 0) return true;

    files.forEach((file) => {
      if (!allowedImageTypes.includes(file.mimetype))
        throw new Error("Only JPEG, JPG, or PNG images are allowed");
      if (file.size > allowedMaxImageSize)
        throw new Error("Each image must be smaller than 2 MB");
    });
    return true;
  }),

  check().custom((_, { req }) => {
    const retainedImages = req.body.retainedProductImages;
    const newFiles = req.files;

    const hasRetainedImages =
      Array.isArray(retainedImages) && retainedImages.length > 0;
    const hasNewImages = newFiles && newFiles.length > 0;

    if (!hasRetainedImages && !hasNewImages)
      throw new Error("At least one product image is required");
    return true;
  }),
];

export const validateCreateVariableProduct: ValidationChain[] = [
  ...baseVariableProductValidation,

  body("variations.*.variantImageIndexes")
    .isArray({ min: 1 })
    .withMessage("At least one variable image index must be included"),

  body("variations.*.variantImageIndexes.*")
    .notEmpty()
    .withMessage("At least one variant image index is required")
    .isInt({ min: 0 })
    .withMessage("Variant image index must be a non-negative integer"),

  body("baseImages").custom((_, { req }) => {
    const { baseImages } = req.files as TCreateVariableProductImagePayload;
    if (!baseImages || baseImages.length === 0)
      throw new Error("At least one base product image is required");

    baseImages.forEach((baseImage) => {
      if (!allowedImageTypes.includes(baseImage.mimetype))
        throw new Error("Only JPEG, JPG, or PNG images are allowed");
      if (baseImage.size > allowedMaxImageSize)
        throw new Error("Each image must be smaller than 2 MB");
    });
    return true;
  }),

  body("variantImages").custom((_, { req }) => {
    const { variantImages } = req.files as TCreateVariableProductImagePayload;
    if (!variantImages || variantImages.length === 0)
      throw new Error("At least one base product image is required");

    variantImages.forEach((variantImage) => {
      if (!allowedImageTypes.includes(variantImage.mimetype))
        throw new Error("Only JPEG, JPG, or PNG images are allowed");
      if (variantImage.size > allowedMaxImageSize)
        throw new Error("Each image must be smaller than 2 MB");
    });
    return true;
  }),
];

export const validateUpdateVariableProduct: ValidationChain[] = [
  ...baseVariableProductValidation,

  body("retainedBaseImages")
    .isArray({ min: 0 })
    .withMessage("retainedBaseImages must be an array"),

  body("retainedBaseImages.*")
    .isURL()
    .withMessage("Each retained base image must be a valid URL"),

  body("variations.*.retainedVariantImages")
    .isArray({ min: 0 })
    .withMessage("retainedVariantImages must be an array"),

  body("variations.*.retainedVariantImages.*")
    .isURL()
    .withMessage("Each retained variant image must be a valid URL"),

  body("newBaseImages").custom((_, { req }) => {
    const { newBaseImages } = req.files as TUpdateVariableProductImagePayload;

    if (typeof newBaseImages === "undefined") return true;
    if (!Array.isArray(newBaseImages))
      throw new Error("newBaseImages must be an array");
    if (newBaseImages.length === 0) return true;

    newBaseImages.forEach((newBaseImage) => {
      if (!allowedImageTypes.includes(newBaseImage.mimetype))
        throw new Error("Only JPEG, JPG, or PNG images are allowed");
      if (newBaseImage.size > allowedMaxImageSize)
        throw new Error("Each image must be smaller than 2 MB");
    });
    return true;
  }),

  body("newVariantImages").custom((_, { req }) => {
    const { newVariantImages } =
      req.files as TUpdateVariableProductImagePayload;

    if (typeof newVariantImages === "undefined") return true;
    if (!Array.isArray(newVariantImages))
      throw new Error("newVariantImages must be an array");
    if (newVariantImages.length === 0) return true;

    newVariantImages.forEach((newVariantImage) => {
      if (!allowedImageTypes.includes(newVariantImage.mimetype)) {
        throw new Error("Only JPEG, JPG, or PNG images are allowed");
      }
      if (newVariantImage.size > allowedMaxImageSize) {
        throw new Error("Each image must be smaller than 2 MB");
      }
    });
    return true;
  }),

  check().custom((_, { req }) => {
    const retainedBaseImages = (req.body as IUpdateVariableProductPayload)
      .retainedBaseImages;
    const { newBaseImages } = req.files as TUpdateVariableProductImagePayload;

    const hasRetainedImages =
      Array.isArray(retainedBaseImages) && retainedBaseImages.length > 0;
    const hasNewImages = newBaseImages && newBaseImages.length > 0;
    if (!hasRetainedImages && !hasNewImages)
      throw new Error("At least one base product image is required");
    return true;
  }),
];

export const validateUpdateSimpleProductQty: ValidationChain[] = [
  body("quantity")
    .notEmpty()
    .withMessage("Each variation must have an quantity")
    .isInt({ min: 0 })
    .withMessage("Each quantity must be a non-negative integer"),
];

export const validateUpdateVariableProductQty: ValidationChain[] = [
  body("variations")
    .isArray({ min: 1 })
    .withMessage("variations must be an array with at least one variation"),

  body("variations.*.sku")
    .trim()
    .notEmpty()
    .withMessage("Each variation must have an SKU")
    .isString()
    .withMessage("Each SKU must be a string"),

  body("variations.*.quantity")
    .notEmpty()
    .withMessage("Each variation must have an quantity")
    .isInt({ min: 0 })
    .withMessage("Each quantity must be a non-negative integer"),
];

export const validateIdParam: ValidationChain[] = [
  param("id").isMongoId().withMessage("Invalid product ID"),
];

export const validateGetProducts: ValidationChain[] = [
  query("status")
    .optional()
    .toLowerCase()
    .isIn(["draft", "public", "private"])
    .withMessage(
      'Status must be one of "draft", "public", "private", or omitted completely'
    ),

  query("isFeatured")
    .optional()
    .isBoolean()
    .withMessage(
      "isFeatured must be either true or false, or omitted completely"
    ),
];
