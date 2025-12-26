import { InferSchemaType, Schema, model } from "mongoose";

const rfqAttributeSchema = new Schema(
  {
    attribute: {
      type: Schema.Types.ObjectId,
      ref: "ProductAttribute",
      required: true,
    },
    selectedVariations: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  { _id: false }
);

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      default: "",
      trim: true,
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const rfqSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    attributes: [rfqAttributeSchema],
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    customer: {
      type: customerSchema,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "quoted", "approved"],
      default: "pending",
    },
    quotedPrice: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

export type RFQ = InferSchemaType<typeof rfqSchema>;
export default model("RFQ", rfqSchema);
