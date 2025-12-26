import { Schema, model } from "mongoose";

const address = {
  firstName: {
    type: String,
    default: "",
    trim: true,
  },
  lastName: {
    type: String,
    default: "",
    trim: true,
  },
  phoneNo: {
    type: String,
    default: "",
    trim: true,
  },
  email: {
    type: String,
    default: "",
    lowercase: true,
    trim: true,
  },
  address: {
    type: String,
    default: "",
    trim: true,
  },
  apartment: {
    type: String,
    default: "",
    trim: true,
  },
  city: {
    type: String,
    default: "",
    trim: true,
  },
  state: {
    type: String,
    default: "",
    trim: true,
  },
  zipCode: {
    type: String,
    default: "",
    trim: true,
  },
};

const UserSchema = new Schema(
  {
    providerId: {
      type: String,
      trim: true,
      default: "email/password",
    },
    avatar: {
      type: String,
      required: true,
      trim: true,
    },
    uid: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      default: "",
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      default: "",
      trim: true,
    },
    shippingInfo: address,
    billingInfo: address,
    role: {
      type: Schema.Types.ObjectId,
      ref: "UserRole",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
