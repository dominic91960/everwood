import { Schema, model } from "mongoose";

const couponSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    couponType: {
      type: String,
      enum: ["percentage", "exact"],
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Coupon", couponSchema);
