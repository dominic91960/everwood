import { twMerge } from "tailwind-merge";
import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPaymentStatus(s: string) {
  let status = "";
  switch (s) {
    case "pending-payment":
      status = "Pending payment";
      break;

    case "paid":
      status = "Paid";
      break;

    case "processing":
      status = "Order processing";
      break;

    case "shipped":
      status = "Order shipped";
      break;

    case "completed":
      status = "Order compeleted";
      break;

    case "cancelled":
      status = "Order cancelled";
      break;

    default:
      status = "Unknown";
      break;
  }

  return status;
}

export function getErrorMessage(err: unknown) {
  let errorMessage = "Something went wrong. Please try again.";

  if (
    err instanceof AxiosError &&
    err.response &&
    err.response.data.message &&
    typeof err.response.data.message === "string"
  ) {
    errorMessage = err.response.data.message;
  } else if (err instanceof AxiosError) {
    errorMessage = err.response?.data.message;
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }

  return errorMessage;
}
