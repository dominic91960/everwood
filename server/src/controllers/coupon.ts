import { Request, Response, NextFunction } from "express";
import Coupon from "../models/coupon";

const createCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, couponType, code, value, startDate, endDate } = req.body;
    const coupon = new Coupon({
      title,
      couponType,
      code,
      value,
      startDate,
      endDate,
    });
    await coupon.save();

    res.status(201).json(coupon);
  } catch (err) {
    next(err);
  }
};

const getCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (err) {
    next(err);
  }
};

const getCouponById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    res.status(200).json(coupon);
  } catch (err) {
    next(err);
  }
};

const getCouponByCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.params;
    const coupon = await Coupon.findOne({ code });

    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    res.status(200).json(coupon);
  } catch (err) {
    next(err);
  }
};

const updateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, couponType, code, value, startDate, endDate } = req.body;

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { title, couponType, code, value, startDate, endDate },
      { new: true, runValidators: true }
    );

    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    res.status(200).json(coupon);
  } catch (err) {
    next(err);
  }
};

const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export {
  createCoupon,
  getCoupons,
  getCouponById,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
};
