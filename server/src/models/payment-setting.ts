import { Schema, model } from "mongoose";

const bankAccountSchema = new Schema({
  accountHolderName: {
    type: String,
    required: true,
    trim: true,
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true,
  },
  bankName: {
    type: String,
    required: true,
    trim: true,
  },
  branchName: {
    type: String,
    required: true,
    trim: true,
  },
});

const bankTransferSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    availableAccounts: {
      type: [bankAccountSchema],
      default: [],
    },
  },
  { _id: false }
);

const codSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    title: { type: String, default: "Cash on Delivery" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const cardPaymentSchema = new Schema(
  {
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const paymentSettingSchema = new Schema(
  {
    bankTransfer: { type: bankTransferSchema, required: true },
    cod: { type: codSchema, required: true },
    cardPayment: { type: cardPaymentSchema, required: true },
    shippingFee: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

export default model(
  "PaymentSetting",
  paymentSettingSchema,
  "payment_settings"
);
