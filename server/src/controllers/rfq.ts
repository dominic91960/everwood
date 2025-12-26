import { Request, Response, NextFunction } from "express";

import RFQ from "../models/rfq";

const createRFQ = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { product, attributes, quantity, customer, user, quotedPrice } =
      req.body;

    const rfq = new RFQ({
      product,
      attributes,
      quantity,
      customer,
      user,
      quotedPrice,
    });

    await rfq.save();
    await rfq.populate("product");
    await rfq.populate("attributes.attribute");

    res.status(201).json(rfq);
  } catch (err) {
    next(err);
  }
};

const getRFQs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rfqs = await RFQ.find()
      .sort({ createdAt: -1 })
      .populate("product")
      .populate("attributes.attribute");
    res.status(200).json(rfqs);
  } catch (err) {
    next(err);
  }
};

const getRFQById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const rfq = await RFQ.findById(id)
      .populate("product")
      .populate("attributes.attribute");
    if (!rfq) return res.status(404).json({ message: "RFQ not found" });

    res.status(200).json(rfq);
  } catch (err) {
    next(err);
  }
};

const getRFQsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const rfqs = await RFQ.find({ user: id })
      .populate("product")
      .populate("attributes.attribute");

    res.status(200).json(rfqs);
  } catch (err) {
    next(err);
  }
};

const updateRFQ = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const rfq = await RFQ.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })
      .populate("product")
      .populate("attributes.attribute");

    if (!rfq) return res.status(404).json({ message: "RFQ not found" });
    res.status(200).json(rfq);
  } catch (err) {
    next(err);
  }
};

const updateRFQStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status, quotedPrice } = req.body as {
      status: "pending" | "reviewed" | "quoted" | "approved";
      quotedPrice?: number;
    };

    const update: {
      status: "pending" | "reviewed" | "quoted" | "approved";
      quotedPrice?: number;
    } = { status };
    if (typeof quotedPrice === "number") update.quotedPrice = quotedPrice;

    const rfq = await RFQ.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })
      .populate("product")
      .populate("attributes.attribute");

    if (!rfq) return res.status(404).json({ message: "RFQ not found" });
    res.status(200).json(rfq);
  } catch (err) {
    next(err);
  }
};

const deleteRFQ = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const rfq = await RFQ.findByIdAndDelete(id);
    if (!rfq) return res.status(404).json({ message: "RFQ not found" });
    res.status(200).json(rfq);
  } catch (err) {
    next(err);
  }
};

export {
  createRFQ,
  getRFQs,
  getRFQById,
  getRFQsByUserId,
  updateRFQ,
  updateRFQStatus,
  deleteRFQ,
};
