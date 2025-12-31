import { readFileSync } from "fs";
import { join } from "path";

import { render } from "ejs";
import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import { Order } from "../models/order";

const emailsFolder = join(__dirname, "..", "emails");
const apiInstance = new TransactionalEmailsApi();
const senderName = process.env.BREVO_SENDER_NAME!;
const senderEmail = process.env.BREVO_SENDER_EMAIL!;
const adminName = process.env.BREVO_ADMIN_NAME!;
const adminEmail = process.env.BREVO_ADMIN_EMAIL!;

apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
);

const sendContactMail = async (data: {
  name: string;
  email: string;
  message: string;
}) => {
  const userTemplatePath = join(emailsFolder, "contact", "user.ejs");
  const adminTemplatePath = join(emailsFolder, "contact", "admin.ejs");

  const userTemplate = readFileSync(userTemplatePath, "utf8");
  const adminTemplate = readFileSync(adminTemplatePath, "utf8");

  const userMail = {
    subject: "TecHCD: We Received Your Message",
    htmlContent: render(userTemplate, data),
    sender: { name: senderName, email: senderEmail },
    to: [{ name: data.name, email: data.email }],
  };
  const adminMail = {
    subject: "TecHCD: New Contact Form Submission",
    htmlContent: render(adminTemplate, data),
    sender: { name: senderName, email: senderEmail },
    to: [{ name: adminName, email: adminEmail }],
  };

  await apiInstance.sendTransacEmail(userMail);
  await apiInstance.sendTransacEmail(adminMail);
};

const sendPasswordResetMail = async (data: {
  firstName: string;
  email: string;
  resetLink: string;
}) => {
  const userTemplatePath = join(emailsFolder, "password-reset", "user.ejs");
  const userTemplate = readFileSync(userTemplatePath, "utf8");
  const userMail = {
    subject: "TecHCD: Reset Your Password",
    htmlContent: render(userTemplate, data),
    sender: { name: senderName, email: senderEmail },
    to: [{ name: data.firstName, email: data.email }],
  };

  await apiInstance.sendTransacEmail(userMail);
};

const sendOrderConfirmationMail = async (order: Order) => {
  const userTemplatePath = join(emailsFolder, "order-confirmation", "user.ejs");
  const adminTemplatePath = join(
    emailsFolder,
    "order-confirmation",
    "admin.ejs"
  );

  const userTemplate = readFileSync(userTemplatePath, "utf8");
  const adminTemplate = readFileSync(adminTemplatePath, "utf8");

  const userMail = {
    subject: "TecHCD: Your Order Confirmation",
    htmlContent: render(userTemplate, order),
    sender: { name: senderName, email: senderEmail },
    to: [
      { name: order.shippingInfo.firstName, email: order.shippingInfo.email },
    ],
  };
  const adminMail = {
    subject: "TecHCD: New Order Received",
    htmlContent: render(adminTemplate, order),
    sender: { name: senderName, email: senderEmail },
    to: [{ name: adminName, email: adminEmail }],
  };

  await apiInstance.sendTransacEmail(userMail);
  await apiInstance.sendTransacEmail(adminMail);
};

const sendPaymentPendingMail = async (order: Order) => {
  const userTemplatePath = join(emailsFolder, "payment-pending", "user.ejs");
  const userTemplate = readFileSync(userTemplatePath, "utf8");
  const userMail = {
    subject: "TecHCD: Payment Pending",
    htmlContent: render(userTemplate, order),
    sender: { name: senderName, email: senderEmail },
    to: [
      { name: order.shippingInfo.firstName, email: order.shippingInfo.email },
    ],
  };

  await apiInstance.sendTransacEmail(userMail);
};

const sendPaymentReceivedMail = async (order: Order) => {
  const userTemplatePath = join(emailsFolder, "payment-received", "user.ejs");
  const userTemplate = readFileSync(userTemplatePath, "utf8");
  const userMail = {
    subject: "TecHCD: Payment Received",
    htmlContent: render(userTemplate, order),
    sender: { name: senderName, email: senderEmail },
    to: [
      { name: order.shippingInfo.firstName, email: order.shippingInfo.email },
    ],
  };

  await apiInstance.sendTransacEmail(userMail);
};

const sendOrderProcessingMail = async (order: Order) => {
  const userTemplatePath = join(emailsFolder, "order-processing", "user.ejs");
  const userTemplate = readFileSync(userTemplatePath, "utf8");
  const userMail = {
    subject: "TecHCD: Order Processing",
    htmlContent: render(userTemplate, order),
    sender: { name: senderName, email: senderEmail },
    to: [
      { name: order.shippingInfo.firstName, email: order.shippingInfo.email },
    ],
  };

  await apiInstance.sendTransacEmail(userMail);
};

const sendOrderShippedMail = async (order: Order) => {
  const userTemplatePath = join(emailsFolder, "order-shipped", "user.ejs");
  const userTemplate = readFileSync(userTemplatePath, "utf8");
  const userMail = {
    subject: "TecHCD: Order Shipped",
    htmlContent: render(userTemplate, order),
    sender: { name: senderName, email: senderEmail },
    to: [
      { name: order.shippingInfo.firstName, email: order.shippingInfo.email },
    ],
  };

  await apiInstance.sendTransacEmail(userMail);
};

const sendOrderDeliveredMail = async (order: Order) => {
  const userTemplatePath = join(emailsFolder, "order-delivered", "user.ejs");
  const userTemplate = readFileSync(userTemplatePath, "utf8");
  const userMail = {
    subject: "TecHCD: Order Delivered",
    htmlContent: render(userTemplate, order),
    sender: { name: senderName, email: senderEmail },
    to: [
      { name: order.shippingInfo.firstName, email: order.shippingInfo.email },
    ],
  };

  await apiInstance.sendTransacEmail(userMail);
};

const sendOrderCancelledMail = async (order: Order) => {
  const userTemplatePath = join(emailsFolder, "order-cancelled", "user.ejs");
  const userTemplate = readFileSync(userTemplatePath, "utf8");
  const userMail = {
    subject: "TecHCD: Order Cancelled",
    htmlContent: render(userTemplate, order),
    sender: { name: senderName, email: senderEmail },
    to: [
      { name: order.shippingInfo.firstName, email: order.shippingInfo.email },
    ],
  };

  await apiInstance.sendTransacEmail(userMail);
};

export {
  sendContactMail,
  sendPasswordResetMail,
  sendOrderConfirmationMail,
  sendPaymentPendingMail,
  sendPaymentReceivedMail,
  sendOrderProcessingMail,
  sendOrderShippedMail,
  sendOrderDeliveredMail,
  sendOrderCancelledMail,
};
