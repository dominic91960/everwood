import { Request, Response, NextFunction } from "express";
import ProductAttribute from "../models/product-attribute";
import Product from "../models/product";

const createAttribute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, variations } = req.body;
    const attribute = new ProductAttribute({ name, variations });
    await attribute.save();

    res.status(201).json(attribute);
  } catch (err) {
    next(err);
  }
};

const getAttributes = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const attributes = await ProductAttribute.find().sort({ createdAt: -1 });
    res.status(200).json(attributes);
  } catch (err) {
    next(err);
  }
};

const getAttributeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const attribute = await ProductAttribute.findById(id);

    if (!attribute)
      return res.status(404).json({ message: "Attribute not found" });

    res.status(200).json(attribute);
  } catch (err) {
    next(err);
  }
};

const updateAttribute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, variations } = req.body;

    const attribute = await ProductAttribute.findByIdAndUpdate(
      id,
      { name, variations },
      { new: true, runValidators: true }
    );

    if (!attribute)
      return res.status(404).json({ message: "Attribute not found" });

    res.status(200).json(attribute);
  } catch (err) {
    next(err);
  }
};

// Check if attribute is being used by any products
const checkAttributeUsage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if attribute exists
    const attribute = await ProductAttribute.findById(id);
    if (!attribute) {
      return res.status(404).json({ message: "Attribute not found" });
    }

    // Check if any products are using this attribute
    const productsUsingAttribute = await Product.find({
      "attributes.attribute": id,
    });

    const isInUse = productsUsingAttribute.length > 0;
    const productCount = productsUsingAttribute.length;

    res.status(200).json({
      isInUse,
      productCount,
      products: isInUse
        ? productsUsingAttribute.map((p) => ({
            id: p._id,
            title: p.title,
          }))
        : [],
    });
  } catch (err) {
    next(err);
  }
};

// Check if a specific variation is being used by any products
const checkVariationUsage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, variation } = req.params;

    // Check if attribute exists
    const attribute = await ProductAttribute.findById(id);
    if (!attribute) {
      return res.status(404).json({ message: "Attribute not found" });
    }

    // Check if any products are using this specific variation
    const productsUsingVariation = await Product.find({
      "attributes.attribute": id,
      "attributes.selectedVariations": variation,
    });

    const isInUse = productsUsingVariation.length > 0;
    const productCount = productsUsingVariation.length;

    res.status(200).json({
      isInUse,
      productCount,
      products: isInUse
        ? productsUsingVariation.map((p) => ({
            id: p._id,
            title: p.title,
          }))
        : [],
    });
  } catch (err) {
    next(err);
  }
};

const deleteAttribute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if attribute is being used by any products
    const productsUsingAttribute = await Product.find({
      "attributes.attribute": id,
    });

    if (productsUsingAttribute.length > 0) {
      return res.status(400).json({
        message: "Cannot delete attribute. It is being used by products.",
        productCount: productsUsingAttribute.length,
        products: productsUsingAttribute.map((p) => ({
          id: p._id,
          title: p.title,
        })),
      });
    }

    const attribute = await ProductAttribute.findByIdAndDelete(id);

    if (!attribute)
      return res.status(404).json({ message: "Attribute not found" });

    res.status(200).json({ message: "Attribute deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export {
  createAttribute,
  getAttributes,
  getAttributeById,
  updateAttribute,
  checkAttributeUsage,
  checkVariationUsage,
  deleteAttribute,
};
