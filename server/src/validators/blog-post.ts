import { body, param, query, ValidationChain } from "express-validator";

const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
const allowedMaxImageSize = 2 * 1024 * 1024;

const baseBlogPostValidation: ValidationChain[] = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Title must be between 3 and 50 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 15, max: 150 })
    .withMessage("Description must be between 15 and 150 characters"),

  body("content").trim().notEmpty().withMessage("Content is required"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId"),

  body("tags")
    .isArray({ min: 1 })
    .withMessage("Tags must be an array with at least one tag"),

  body("tags.*")
    .isMongoId()
    .withMessage("Each tag must be a valid MongoDB ObjectId"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be either true or false"),

  body("status")
    .optional()
    .toLowerCase()
    .isIn(["draft", "published"])
    .withMessage('Status must be one of "draft" or "published"'),
];

export const validateCreateBlogPost: ValidationChain[] = [
  ...baseBlogPostValidation,

  body("thumbnail").custom((_, { req }) => {
    const file = req.file as Express.Multer.File;
    if (!file) throw new Error("Thumbnail image is required");
    if (!allowedImageTypes.includes(file.mimetype))
      throw new Error("Only JPEG, JPG, or PNG images are allowed");
    if (file.size > allowedMaxImageSize)
      throw new Error("Each image must be smaller than 2 MB");

    return true;
  }),
];

export const validateUpdateBlogPost: ValidationChain[] = [
  ...baseBlogPostValidation,

  body("newThumbnail")
    .optional()
    .custom((_, { req }) => {
      const file = req.file as Express.Multer.File;
      if (!file) throw new Error("Thumbnail image is required");
      if (!allowedImageTypes.includes(file.mimetype))
        throw new Error("Only JPEG, JPG, or PNG images are allowed");
      if (file.size > allowedMaxImageSize)
        throw new Error("Each image must be smaller than 2 MB");

      return true;
    }),
];

export const validateIdParam: ValidationChain[] = [
  param("id").isMongoId().withMessage("Invalid blog post ID"),
];

export const validateGetBlogPosts: ValidationChain[] = [
  query("status")
    .optional()
    .toLowerCase()
    .isIn(["draft", "published"])
    .withMessage(
      'Status must be one of "draft", "published", or omitted completely'
    ),

  query("isFeatured")
    .optional()
    .isBoolean()
    .withMessage(
      "isFeatured must be either true or false, or omitted completely"
    ),
];
