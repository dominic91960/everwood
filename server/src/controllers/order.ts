import { Request, Response, NextFunction } from "express";

import Order from "../models/order";
import { generateOrderId } from "../utils/nanoid";
import {
  sendOrderConfirmationMail,
  sendPaymentPendingMail,
  sendPaymentReceivedMail,
  sendOrderProcessingMail,
  sendOrderShippedMail,
  sendOrderDeliveredMail,
  sendOrderCancelledMail,
} from "../utils/brevo";
import { onCreateOrder, onDeleteOrder } from "../utils/statistics";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      products,
      subTotal,
      discountAmount,
      shippingCost,
      grandTotal,
      user,
      shippingInfo,
      billingInfo,
      paymentMethod,
      status,
    } = req.body;

    let shortId;
    let isUnique = false;

    while (!isUnique) {
      shortId = generateOrderId();

      const order = await Order.findOne({ shortId });
      if (!order) isUnique = true;
    }

    const order = new Order({
      shortId,
      products,
      subTotal,
      discountAmount,
      shippingCost,
      grandTotal,
      user,
      shippingInfo,
      billingInfo,
      paymentMethod,
      status,
    });

    await order.save();
    await order.populate("products.product");
    await order.populate("products.attributes.attribute");

    if (status !== "cancelled") onCreateOrder(products, grandTotal);
    sendOrderConfirmationMail(order.toObject());

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("products.product")
      .populate("products.attributes.attribute");

    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("products.product")
      .populate("products.attributes.attribute");
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

const getOrderByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ user: id })
      .populate("products.product")
      .populate("products.attributes.attribute");

    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      shortId,
      products,
      subTotal,
      discountAmount,
      shippingCost,
      grandTotal,
      user,
      shippingInfo,
      paymentMethod,
      billingInfo,
      status,
    } = req.body;

    const existingOrder = await Order.findById(id).populate("products.product");
    if (!existingOrder)
      return res.status(404).json({ message: "Order not found" });

    const order = await Order.findByIdAndUpdate(
      id,
      {
        shortId,
        products,
        subTotal,
        discountAmount,
        shippingCost,
        grandTotal,
        user,
        shippingInfo,
        paymentMethod,
        billingInfo,
        status,
      },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (existingOrder.status === status) return res.status(200).json(order);
    if (existingOrder.status === "cancelled")
      onCreateOrder(existingOrder.products, existingOrder.grandTotal);
    else if (status === "cancelled")
      onDeleteOrder(
        existingOrder.products,
        existingOrder.createdAt,
        existingOrder.grandTotal
      );

    await order.populate("products.product");
    await order.populate("products.attributes.attribute");
    switch (status) {
      case "pending-payment":
        sendPaymentPendingMail(order.toObject());
        break;
      case "paid":
        sendPaymentReceivedMail(order.toObject());
        break;
      case "processing":
        sendOrderProcessingMail(order.toObject());
        break;
      case "shipped":
        sendOrderShippedMail(order.toObject());
        break;
      case "completed":
        sendOrderDeliveredMail(order.toObject());
        break;
      case "cancelled":
        sendOrderCancelledMail(order.toObject());
        break;
    }

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingOrder = await Order.findById(id);
    if (!existingOrder)
      return res.status(404).json({ message: "Order not found" });

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (existingOrder.status === status) return res.status(200).json(order);
    if (existingOrder.status === "cancelled")
      onCreateOrder(existingOrder.products, existingOrder.grandTotal);
    else if (status === "cancelled")
      onDeleteOrder(
        existingOrder.products,
        existingOrder.createdAt,
        existingOrder.grandTotal
      );

    await order.populate("products.product");
    await order.populate("products.attributes.attribute");
    switch (status) {
      case "pending-payment":
        sendPaymentPendingMail(order.toObject());
        break;
      case "paid":
        sendPaymentReceivedMail(order.toObject());
        break;
      case "processing":
        sendOrderProcessingMail(order.toObject());
        break;
      case "shipped":
        sendOrderShippedMail(order.toObject());
        break;
      case "completed":
        sendOrderDeliveredMail(order.toObject());
        break;
      case "cancelled":
        sendOrderCancelledMail(order.toObject());
        break;
    }

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "cancelled")
      onDeleteOrder(order.products, order.createdAt, order.grandTotal);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export {
  createOrder,
  getOrders,
  getOrderById,
  getOrderByUserId,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
};
