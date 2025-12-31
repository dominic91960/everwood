import { Request, Response, NextFunction } from "express";

import Product from "../models/product";
import Statistics from "../models/statistics";
import {
  bucketUrl,
  uploadSimpleProductImages,
  uploadVariableProductImages,
  updateSimpleProductImages,
  updateVariableProductImages,
  deleteProductImages,
} from "../utils/s3";
import {
  ICreateSimpleProductPayload,
  IUpdateSimpleProductPayload,
  IUpdateSimpleProductQtyPayload,
  TSimpleProductDocument,
  TCreateVariableProductImagePayload,
  ICreateVariableProductPayload,
  TUpdateVariableProductImagePayload,
  IUpdateVariableProductPayload,
  IUpdateVariableProductQtyPayload,
  TVariableProductDocument,
} from "../utils/types";
import { generateSubfolderId } from "../utils/nanoid";

const createSimpleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as Express.Multer.File[];

    const {
      type,
      sku,
      title,
      smallDescription,
      description,
      price,
      discountPrice,
      quantity,
      categories,
      attributes,
      isFeatured,
      status,
    }: ICreateSimpleProductPayload = req.body;

    const productImages = await uploadSimpleProductImages(files);
    const product = new Product({
      type,
      sku,
      title,
      smallDescription,
      description,
      price,
      discountPrice,
      quantity,
      categories,
      attributes,
      productImages,
      isFeatured,
      status,
    });
    await product.save();
    await Statistics.findOneAndUpdate(
      {},
      { $inc: { totalProducts: 1 } },
      { new: true, runValidators: true }
    );

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

const updateSimpleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product: TSimpleProductDocument | null = await Product.findById(
      req.params.id
    );
    if (!product)
      return res.status(404).json({
        message: "Product not found",
      });

    const files = req.files as Express.Multer.File[];
    const {
      title,
      smallDescription,
      description,
      retainedProductImages,
      price,
      discountPrice,
      quantity,
      categories,
      attributes,
      isFeatured,
      status,
    }: IUpdateSimpleProductPayload = req.body;

    const productImages = await updateSimpleProductImages(
      product.productImages,
      retainedProductImages,
      files
    );

    product.title = title;
    product.smallDescription = smallDescription;
    product.description = description;
    product.productImages = productImages;
    product.price = price;
    product.discountPrice = discountPrice;
    product.quantity = quantity;
    product.categories = categories;
    product.attributes = attributes;
    product.isFeatured = isFeatured;
    product.status = status;
    await product.save();

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

const updateSimpleProductQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product: TSimpleProductDocument | null = await Product.findById(
      req.params.id
    );
    if (!product)
      return res.status(404).json({
        message: "Product not found",
      });

    const { quantity }: IUpdateSimpleProductQtyPayload = req.body;
    product.quantity = quantity;
    await product.save();

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

const deleteSimpleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product: TSimpleProductDocument | null = await Product.findById(
      req.params.id
    );
    if (!product)
      return res.status(404).json({
        message: "Product not found",
      });

    await deleteProductImages(product.productImages);
    await product.deleteOne();
    await Statistics.findOneAndUpdate(
      {},
      { $inc: { totalProducts: -1 } },
      { new: true, runValidators: true }
    );

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

const createVariableProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { baseImages: baseImagesFiles, variantImages: variantImagesFiles } =
      req.files as TCreateVariableProductImagePayload;
    const {
      type,
      title,
      smallDescription,
      description,
      categories,
      variations: payloadVariations,
      isFeatured,
      status,
    }: ICreateVariableProductPayload = req.body;
    const subfolderId = generateSubfolderId();

    const baseImages = await uploadVariableProductImages(
      subfolderId,
      "BASE_IMAGES",
      baseImagesFiles
    );
    const variations = await Promise.all(
      payloadVariations.map(
        async ({ attributes, variantImageIndexes, ...data }) => {
          const superSubfolder = attributes
            .map((attr) =>
              attr.selectedVariation
                .replace(/[^a-zA-Z0-9 ]/g, "")
                .toUpperCase()
                .trim()
                .replace(/\s+/g, "_")
            )
            .join("_");
          const files = variantImageIndexes
            .map((i) => variantImagesFiles[i])
            .filter(Boolean);
          if (files.length < 1)
            return { ...data, attributes, variantImages: [] };

          const variantImages = await uploadVariableProductImages(
            subfolderId,
            superSubfolder,
            files
          );

          return {
            ...data,
            attributes,
            variantImages,
          };
        }
      )
    );

    const product = new Product({
      type,
      title,
      smallDescription,
      description,
      categories,
      baseImages,
      variations,
      isFeatured,
      status,
    });
    await product.save();
    await Statistics.findOneAndUpdate(
      {},
      { $inc: { totalProducts: 1 } },
      { new: true, runValidators: true }
    );

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

const updateVariableProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product: TVariableProductDocument | null = await Product.findById(
      req.params.id
    );
    if (!product)
      return res.status(404).json({
        message: "Product not found",
      });

    const {
      newBaseImages: baseImagesFiles = [],
      newVariantImages: variantImagesFiles = [],
    } = req.files as TUpdateVariableProductImagePayload;
    const {
      type,
      title,
      smallDescription,
      description,
      categories,
      retainedBaseImages,
      variations: payloadVariations,
      isFeatured,
      status,
    }: IUpdateVariableProductPayload = req.body;
    const subfolderId = product.baseImages[0]
      .replace(bucketUrl, "")
      .split("/")[1];
    const originalVariations = product.variations.map(
      ({ attributes, variantImages }) => {
        const id = attributes
          .map((attr) =>
            attr.selectedVariation
              .replace(/[^a-zA-Z0-9 ]/g, "")
              .toUpperCase()
              .trim()
              .replace(/\s+/g, "_")
          )
          .join("_");

        return { id, variantImages, used: false };
      }
    );

    const baseImages = await updateVariableProductImages(
      subfolderId,
      "BASE_IMAGES",
      product.baseImages,
      retainedBaseImages,
      baseImagesFiles
    );
    const variations = await Promise.all(
      payloadVariations.map(
        async ({
          attributes,
          retainedVariantImages,
          variantImageIndexes,
          ...data
        }) => {
          const superSubfolder = attributes
            .map((attr) =>
              attr.selectedVariation
                .replace(/[^a-zA-Z0-9 ]/g, "")
                .toUpperCase()
                .trim()
                .replace(/\s+/g, "_")
            )
            .join("_");
          const originalVariation = originalVariations.find(({ id }, i) => {
            if (superSubfolder === id) {
              originalVariations[i].used = true;
              return true;
            }
            return false;
          });

          const files = variantImageIndexes
            .map((i) => variantImagesFiles[i])
            .filter(Boolean);
          if (files.length < 1)
            return { ...data, attributes, variantImages: [] };

          const variantImages = await updateVariableProductImages(
            subfolderId,
            superSubfolder,
            originalVariation ? originalVariation.variantImages : [],
            retainedVariantImages,
            files
          );

          return {
            ...data,
            attributes,
            variantImages,
          };
        }
      )
    );
    const unusedImages = originalVariations
      .filter(({ used }) => !used)
      .flatMap(({ variantImages }) => variantImages);
    await deleteProductImages(unusedImages);

    product.type = type;
    product.title = title;
    product.smallDescription = smallDescription;
    product.description = description;
    product.categories = categories;
    product.baseImages = baseImages;
    product.variations = variations;
    product.isFeatured = isFeatured;
    product.status = status;
    await product.save();

    res.status(200).json(req.body);
  } catch (err) {
    next(err);
  }
};

const updateVariableProductQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product: TVariableProductDocument | null = await Product.findById(
      req.params.id
    );
    if (!product)
      return res.status(404).json({
        message: "Product not found",
      });

    const { variations }: IUpdateVariableProductQtyPayload = req.body;
    product.variations = product.variations.map((originalVariation) => {
      const updatedVariation = variations.find(
        (v) => v.sku === originalVariation.sku
      );

      return updatedVariation
        ? { ...originalVariation, quantity: updatedVariation.quantity }
        : { ...originalVariation };
    });
    await product.save();

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

const deleteVariableProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product: TVariableProductDocument | null = await Product.findById(
      req.params.id
    );
    if (!product)
      return res.status(404).json({
        message: "Product not found",
      });

    const imagesToDelete = product.baseImages.concat(
      product.variations.flatMap((variation) => variation.variantImages)
    );
    await deleteProductImages(imagesToDelete);
    await product.deleteOne();
    await Statistics.findOneAndUpdate(
      {},
      { $inc: { totalProducts: -1 } },
      { new: true, runValidators: true }
    );

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query: { status?: string; isFeatured?: boolean } = {};
    const { status, isFeatured } = req.query;

    if (status) query.status = status as string;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === "true";

    const products = await Product.find(query)
      .populate("categories", "name description")
      .populate("attributes.attribute", "name variations")
      .populate("variations.attributes.attribute", "name variations");

    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categories", "name description")
      .populate("attributes.attribute", "name variations")
      .populate("variations.attributes.attribute", "name variations");

    if (!product)
      return res.status(404).json({
        message: "Product not found",
      });

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

export {
  createSimpleProduct,
  updateSimpleProduct,
  updateSimpleProductQuantity,
  deleteSimpleProduct,
  createVariableProduct,
  updateVariableProduct,
  updateVariableProductQuantity,
  deleteVariableProduct,
  getProducts,
  getProductById,
};
