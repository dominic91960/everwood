import { Schema, model } from "mongoose";

const UserRoleSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("UserRole", UserRoleSchema, "user_roles");
