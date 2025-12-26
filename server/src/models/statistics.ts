import { Schema, model } from "mongoose";

const topProductsSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      trim: true,
    },
    purchasedTimes: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const monthlyEarningsSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
      trim: true,
    },
    earnings: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const StatisticsSchema = new Schema(
  {
    totalProducts: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalCustomers: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalOrders: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      min: 0,
      default: 0,
    },
    topProducts: { type: [topProductsSchema], default: [] },
    monthlyEarnings: { type: [monthlyEarningsSchema], default: [] },
  },
  { timestamps: true }
);

export default model("Statistics", StatisticsSchema);
