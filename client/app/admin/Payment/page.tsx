"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios-instance";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
function PaymentPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [formSubmitting, setFormSubmitting] = useState(false);

  const router = useRouter();
  const [paymentSettings, setPaymentSettings] = useState({
    directBankTransfer: false,
    cod: false,
    cardPayment: false,
    freeShipping: false,
    shippingFee: 0,
  });
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/payment`);
        setPaymentSettings({
          directBankTransfer: res.data.bankTransfer.enabled,
          cod: res.data.cod.enabled,
          cardPayment: res.data.cardPayment.enabled,
          freeShipping: res.data.shippingFee === 0 ? true : false,
          shippingFee: res.data.shippingFee,
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleChange = (setting: string) => {
    setPaymentSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  const handleCourierChargeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    setPaymentSettings((prev) => ({
      ...prev,
      shippingFee: numericValue ? parseFloat(numericValue) : 0,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setFormSubmitting(true);
      const payload = {
        bankTransferEnabled: paymentSettings.directBankTransfer,
        codEnabled: paymentSettings.cod,
        cardPaymentEnabled: paymentSettings.cardPayment,
        shippingFee: paymentSettings.freeShipping
          ? 0
          : paymentSettings.shippingFee,
      };

      await api.patch("/payment", payload);
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
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-white">Loading coupons...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-red-500">
          Error: Failed to fetch payment information
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl">
        {/* Page Title */}
        <h1 className="mb-8 text-3xl font-bold text-[#E5E5E5]">
          Payment Settings
        </h1>

        {/* Main Content Panel */}
        <div className="rounded-2xl border border-[#6E6E6E] bg-[#0000004D]/30 p-8 backdrop-blur-[500px]">
          {/* Payment Setting Section */}
          <div className="mb-8">
            {/* Payment Options */}
            <div className="space-y-6">
              {/* Direct Bank Transfer */}
              <div className="grid grid-cols-1 gap-4 rounded-lg p-4 sm:flex sm:items-center sm:justify-between sm:gap-6 md:gap-8 xl:gap-10 2xl:gap-12">
                {/* Toggle Switch Column */}
                <div className="flex justify-center sm:justify-start">
                  <button
                    onClick={() => handleToggleChange("directBankTransfer")}
                    className={`relative inline-flex h-8 w-12 items-center rounded-full transition-colors sm:h-7 sm:w-12 md:h-6 md:w-11 ${
                      paymentSettings.directBankTransfer
                        ? "bg-[#028EFC]"
                        : "bg-[#4A5568]"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform sm:h-5 sm:w-5 md:h-4 md:w-4 ${
                        paymentSettings.directBankTransfer
                          ? "translate-x-6 sm:translate-x-7 md:translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Option Details Column */}
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-white">
                    Direct bank transfer
                  </h3>
                  <p className="text-sm text-[#AEB9E1]">
                    Take payments in person via BACS. More commonly known as
                    direct bank/wire transfer.
                  </p>
                </div>

                {/* Manage Button Column */}
                <div className="flex justify-center sm:justify-end">
                  <button
                    onClick={() =>
                      router.push("/admin/Payment/direct-bank-transfer")
                    }
                    className="rounded-lg bg-[#028EFC] px-4 py-1 text-white transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div className="grid grid-cols-1 gap-4 rounded-lg p-4 sm:flex sm:items-center sm:justify-between sm:gap-6 md:gap-8 xl:gap-10 2xl:gap-12">
                {/* Toggle Switch Column */}
                <div className="flex justify-center sm:justify-start">
                  <button
                    onClick={() => handleToggleChange("cod")}
                    className={`relative inline-flex h-8 w-12 items-center rounded-full transition-colors sm:h-7 sm:w-12 md:h-6 md:w-11 ${
                      paymentSettings.cod ? "bg-[#028EFC]" : "bg-[#4A5568]"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform sm:h-5 sm:w-5 md:h-4 md:w-4 ${
                        paymentSettings.cod
                          ? "translate-x-6 sm:translate-x-7 md:translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Option Details Column */}
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-white">
                    Cash on delivery
                  </h3>
                  <p className="text-sm text-[#AEB9E1]">
                    Give your customers the convenience of paying directly from
                    their credit or debit cards.
                  </p>
                </div>

                {/* Manage Button Column */}
                <div className="flex justify-center sm:justify-end">
                  <button
                    onClick={() =>
                      router.push("/admin/Payment/cash-on-delivery")
                    }
                    className="rounded-lg bg-[#028EFC] px-4 py-1 text-white transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>

              {/* Online Payments */}
              <div className="grid grid-cols-1 gap-4 rounded-lg p-4 sm:flex sm:items-center sm:gap-6 md:gap-8 xl:gap-10 2xl:gap-12">
                {/* Toggle Switch Column */}
                <div className="flex justify-center sm:justify-start">
                  <button
                    onClick={() => handleToggleChange("cardPayment")}
                    className={`relative inline-flex h-8 w-12 items-center rounded-full transition-colors sm:h-7 sm:w-12 md:h-6 md:w-11 ${
                      paymentSettings.cardPayment
                        ? "bg-[#028EFC]"
                        : "bg-[#4A5568]"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform sm:h-5 sm:w-5 md:h-4 md:w-4 ${
                        paymentSettings.cardPayment
                          ? "translate-x-6 sm:translate-x-7 md:translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Option Details Column */}
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-white">
                    Card payments
                  </h3>
                  <p className="text-sm text-[#AEB9E1]">
                    Give your customers the convenience of paying directly from
                    their credit or debit cards.
                  </p>
                </div>
              </div>

              {/* Free Shipping */}
              <div className="grid grid-cols-1 gap-4 rounded-lg p-4 sm:flex sm:items-center sm:gap-6 md:gap-8 xl:gap-10 2xl:gap-12">
                {/* Toggle Switch Column */}
                <div className="flex justify-center sm:justify-start">
                  <button
                    onClick={() => handleToggleChange("freeShipping")}
                    className={`relative inline-flex h-8 w-12 items-center rounded-full transition-colors sm:h-7 sm:w-12 md:h-6 md:w-11 ${
                      paymentSettings.freeShipping
                        ? "bg-[#028EFC]"
                        : "bg-[#4A5568]"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform sm:h-5 sm:w-5 md:h-4 md:w-4 ${
                        paymentSettings.freeShipping
                          ? "translate-x-6 sm:translate-x-7 md:translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Option Details Column */}
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-white">
                    Free Shipping
                  </h3>
                  <p className="text-sm text-[#AEB9E1]">
                    Give your customers the convenience of paying directly from
                    their credit or debit cards.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Courier Setting Section - Hidden when Free Shipping is enabled */}
          {!paymentSettings.freeShipping && (
            <div className="mb-8 p-4">
              <h2 className="mb-6 text-2xl font-bold text-white">
                Courier Setting
              </h2>

              {/* Courier Charge Input */}
              <div className="rounded-lg border border-[#028EFC] p-6">
                <label className="mb-2 block text-sm font-medium text-white">
                  Courier Charge
                </label>
                <input
                  type="number"
                  value={paymentSettings.shippingFee}
                  onChange={handleCourierChargeChange}
                  className="w-full rounded-lg border border-[#028EFC] px-4 py-3 text-sm transition-all"
                />
              </div>
            </div>
          )}

          {/* Save Changes Button */}
          <div className="flex justify-end">
            <button
              disabled={formSubmitting}
              className="relative flex items-center overflow-hidden rounded-md bg-[#028EFC] p-2 text-white shadow-md transition-all duration-300 ease-in disabled:cursor-not-allowed disabled:opacity-50 xl:w-1/4"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
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
  );
}

export default PaymentPage;
