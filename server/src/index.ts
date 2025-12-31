/* eslint-disable no-console */
import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ quiet: true });

import { contactLimiter, generalLimiter } from "./middleware/rate-limit";
import contactRoutes from "./routes/contact";
import userRoleRoutes from "./routes/user-role";
import userRoutes from "./routes/user";
import productAttributeRoutes from "./routes/product-attribute";
import productCategoryRoutes from "./routes/product-category";
import productRoutes from "./routes/product";
import couponRoutes from "./routes/coupon";
import paymentSettingRoutes from "./routes/payment-setting";
import orderRoutes from "./routes/order";
import statisticsRoutes from "./routes/statistics";
import rfqRoutes from "./routes/rfq";
import blogPostCategoryRoutes from "./routes/blog-post-category";
import blogPostTagRoutes from "./routes/blog-post-tag";
import blogPostRoutes from "./routes/blog-post";
import errorHandler from "./middleware/error-handler";

const app: Application = express();
const PORT = process.env.PORT;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(generalLimiter);
app.use("/contact", contactLimiter, contactRoutes);
app.use("/user-role", userRoleRoutes);
app.use("/user", userRoutes);
app.use("/product-attribute", productAttributeRoutes);
app.use("/product-category", productCategoryRoutes);
app.use("/product", productRoutes);
app.use("/coupon", couponRoutes);
app.use("/payment", paymentSettingRoutes);
app.use("/order", orderRoutes);
app.use("/statistics", statisticsRoutes);
app.use("/rfq", rfqRoutes);
app.use("/blog-post-category", blogPostCategoryRoutes);
app.use("/blog-post-tag", blogPostTagRoutes);
app.use("/blog-post", blogPostRoutes);

app.get("/", (_, res) => {
  res.status(200).json({ message: "Server is running successfully." });
});

app.use((_, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    app.listen(PORT, () => console.log("Listening on port", PORT));
  } catch (err) {
    console.log("Unable to connect to the database:", err);
  }
};

startServer();
