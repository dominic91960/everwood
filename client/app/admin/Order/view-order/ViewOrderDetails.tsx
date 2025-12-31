import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { AxiosError } from "axios";
import { X } from "lucide-react";
import { GoArrowUpRight } from "react-icons/go";

import api from "@/lib/axios-instance";
import { cn } from "@/lib/utils";
import { Order } from "../All-Orders/columns";
import { FetchedOrder } from "@/lib/types";
import { orderStatuses } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/user/ui/Select";

interface ViewOrderDetailsProps {
  onClose: () => void;
  order: Order;
  // setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  onSuccess: () => void;
}

const ViewOrderDetails: React.FC<ViewOrderDetailsProps> = ({
  onClose,
  order,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState<FetchedOrder>();
  const [error, setError] = useState(false);

  const [updatedStatus, setUpdatedStatus] = useState<
    | "pending-payment"
    | "paid"
    | "processing"
    | "shipped"
    | "completed"
    | "cancelled"
  >();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/order/${order.fullId}`);
        const data = res.data;

        setFetchedData(data);
        setUpdatedStatus(data.status);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [order]);

  const updateOrderStatus = async () => {
    try {
      if (!updatedStatus) return;
      setIsSubmitting(true);

      await api.patch(`/order/${order.fullId}/status`, {
        status: updatedStatus,
      });
      setFetchedData((prev) => {
        if (!prev) return prev;
        return { ...prev, status: updatedStatus };
      });
      onSuccess();
      // setOrders((prev) => {
      //   const existingOrderIndex = prev.findIndex(
      //     (o) => o.fullId === order.fullId,
      //   );

      //   if (existingOrderIndex !== -1)
      //     prev[existingOrderIndex] = {
      //       ...prev[existingOrderIndex],
      //       status: data.status,
      //     };
      //   return prev;
      // });

      setToast({
        show: true,
        message: "Payment settings updated",
        type: "success",
      });
      setTimeout(() => {
        setToast({
          show: false,
          message: "",
          type: "success",
        });
      }, 5000);
    } catch (err) {
      let errMessage = "Operation failed";
      if (err instanceof AxiosError) {
        errMessage = err.response?.data?.message;
      } else if (err instanceof Error) {
        errMessage = err.message;
      }
      setToast({
        show: true,
        message: errMessage,
        type: "error",
      });
      setTimeout(() => {
        setToast({
          show: false,
          message: "",
          type: "success",
        });
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <>
      {error && (
        <div
          className="fixed inset-0 z-[20] flex items-center justify-center bg-black/50 p-4"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div
            className="relative z-[99998] max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-[#6E6E6E] bg-black/20 p-6 shadow-lg backdrop-blur-[500px]"
            style={{ position: "relative", zIndex: 99998 }}
          >
            <div className="flex h-64 items-center justify-center">
              <div className="text-white">
                Couldn&apos;t Fetch Order Details.
              </div>
            </div>
          </div>
        </div>
      )}

      {!error && loading && (
        <div
          className="fixed inset-0 z-[20] flex items-center justify-center bg-black/50 p-4"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div
            className="relative z-[99998] max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-[#6E6E6E] bg-black/20 p-6 shadow-lg backdrop-blur-[500px]"
            style={{ position: "relative", zIndex: 99998 }}
          >
            <div className="flex h-64 items-center justify-center">
              <div className="text-white">Loading order details...</div>
            </div>
          </div>
        </div>
      )}

      {!error && !loading && fetchedData && (
        <div
          className="fixed inset-0 z-[20] flex items-center justify-center bg-black/50 p-4"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div
            className="relative z-[99998] max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-[#6E6E6E] bg-black/20 p-6 shadow-lg backdrop-blur-[500px]"
            style={{ position: "relative", zIndex: 99998 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/20 text-white transition-colors hover:bg-blue-500/30"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <h2 className="mb-6 text-3xl font-medium text-white">
              Order {fetchedData.shortId}
            </h2>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left Column - Order Info */}
              <div className="space-y-6 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]">
                {/* Date Created */}
                <div>
                  <p className="mb-2 font-medium">Date Created</p>
                  <p className="">{fetchedData.createdAt.split("T")[0]}</p>
                </div>

                {/* Customer */}
                <div>
                  <p className="mb-2 font-medium">Customer</p>
                  <p className="">
                    {fetchedData.billingInfo.firstName}{" "}
                    {fetchedData.billingInfo.lastName}
                  </p>
                </div>

                {/* Payment Method */}
                <div>
                  <p className="mb-2 font-medium">Payment Method</p>
                  <p className="">
                    {" "}
                    {fetchedData.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : fetchedData.paymentMethod === "card-payment"
                        ? "Card Payment"
                        : "Bank Transfer"}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="mb-2 font-medium text-white">Status</p>

                  <div className="flex items-center gap-[0.5em]">
                    <Select
                      defaultValue={fetchedData.status}
                      onValueChange={(
                        v:
                          | "pending-payment"
                          | "paid"
                          | "processing"
                          | "shipped"
                          | "completed"
                          | "cancelled",
                      ) => setUpdatedStatus(v)}
                    >
                      <SelectTrigger className="data-[placeholder]:text-foreground m-0 h-[2em] w-full max-w-[18ch] text-[12px] leading-normal sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {orderStatuses.map(({ value, placeholder }) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]"
                          >
                            {placeholder}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fetchedData.status !== updatedStatus && (
                      <button
                        onClick={updateOrderStatus}
                        className="bg-primary flex h-[2em] w-full max-w-[18ch] items-center justify-around rounded-[0.5em] ps-[1em] pe-[0.8em] enabled:hover:opacity-80 enabled:focus:opacity-80 disabled:cursor-default disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        Update Status <GoArrowUpRight />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Address Info */}
              <div className="space-y-6">
                {/* Billing Address */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Billing Address
                  </label>
                  <div className="space-y-1 text-sm text-white">
                    <div>
                      {fetchedData.billingInfo.firstName}{" "}
                      {fetchedData.billingInfo.lastName}
                    </div>
                    <div>{fetchedData.billingInfo.address}</div>
                    {fetchedData.billingInfo.apartment && (
                      <div>{fetchedData.billingInfo.apartment}</div>
                    )}
                    <div>
                      {fetchedData.billingInfo.city}{" "}
                      {fetchedData.billingInfo.state}{" "}
                      {fetchedData.billingInfo.zipCode}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Shipping Address
                  </label>
                  <div className="space-y-1 text-sm text-white">
                    <div>
                      {fetchedData.shippingInfo.firstName}{" "}
                      {fetchedData.shippingInfo.lastName}
                    </div>
                    <div>{fetchedData.shippingInfo.address}</div>
                    {fetchedData.shippingInfo.apartment && (
                      <div>{fetchedData.shippingInfo.apartment}</div>
                    )}
                    <div>
                      {fetchedData.shippingInfo.city}{" "}
                      {fetchedData.shippingInfo.state}{" "}
                      {fetchedData.shippingInfo.zipCode}
                    </div>
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-white">Email address: </span>
                    <a
                      href={`mailto:${fetchedData.billingInfo.email}`}
                      className="text-sm text-blue-400 hover:underline"
                    >
                      {fetchedData.billingInfo.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-sm text-white">Phone: </span>
                    <a
                      href={`tel:${fetchedData.billingInfo.phoneNo}`}
                      className="text-sm text-blue-400 hover:underline"
                    >
                      {fetchedData.billingInfo.phoneNo}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Table */}
            <div className="mt-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">
                        Product Image
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">
                        Attributes
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchedData.products.map(
                      (
                        { product, attributes, orderQuantity, totalPrice },
                        i,
                      ) => (
                        <tr key={i} className="border-b border-gray-600">
                          <td className="px-4 py-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                              <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            {product.title}
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            {product.attributes &&
                            product.attributes.length > 0 ? (
                              <div className="space-y-1">
                                {attributes.map((attr, index: number) => (
                                  <div key={index} className="text-xs">
                                    <span className="text-gray-400">
                                      {attr.attribute.name}:
                                    </span>
                                    <span className="ml-1 text-blue-300">
                                      {attr.selectedVariation}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">
                                No attributes
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            Rs.{product.price}
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            {orderQuantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            Rs.{totalPrice}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mt-8 flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white">Items Subtotal:</span>
                  <span className="text-white">Rs.{fetchedData.subTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white">Shipping:</span>
                  <span className="text-white">
                    Rs.{fetchedData.shippingCost}
                  </span>
                </div>
                {fetchedData.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#0BDB45]">Coupon:</span>
                    <span className="text-white">
                      Rs.{fetchedData.discountAmount}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-white">Total:</span>
                    <span className="text-white">
                      Rs.{fetchedData.grandTotal}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {toast.show && (
            <div
              className={cn(
                "animate-in slide-in-from-right fixed top-4 right-4 z-50 rounded-lg border px-6 py-4 text-white shadow-lg duration-300",
                toast.type === "success"
                  ? "border-green-500 bg-green-600"
                  : "border-red-500 bg-red-600",
              )}
            >
              <div className="flex items-center space-x-3">
                <svg
                  className="h-6 w-6 text-green-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <p className="font-medium">
                    {toast.type === "success" ? "Success" : "Error"}!
                  </p>
                  <p className="text-sm text-green-100">{toast.message}</p>
                </div>
                <button
                  onClick={() =>
                    setToast({ show: false, message: "", type: "success" })
                  }
                  className="text-green-200 transition-colors hover:text-white"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>,
    document.body,
  );
};

export default ViewOrderDetails;
