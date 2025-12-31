"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Savebutton from "../Savebutton";
import api from "@/lib/axios-instance";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";

export default function CashOnDeliveryPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/payment`);
        setTitle(res.data.cod.title);
        setDescription(res.data.cod.description);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await api.patch("/payment/cod", { title, description });
      setToast({ show: true, message: "Change successful", type: "success" });
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
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-[#E5E5E5]">
          Payment Setting
        </h1>

        <div className="rounded-2xl border border-[#6E6E6E] bg-[#0000004D]/30 p-6 backdrop-blur-[500px] sm:p-8">
          {/* Header with Back */}
          <div className="mb-4">
            <button
              onClick={() => router.push("/admin/Payment")}
              className="text-[#AEB9E1] transition-colors hover:text-white"
            >
              ◀ Back
            </button>
          </div>

          {/* Section Title */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Cash on delivery
            </h2>
          </div>

          {/* Title input */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-white">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-[#028EFC] bg-transparent px-4 py-3 text-sm text-white placeholder:text-[#AEB9E1]"
            />
          </div>

          {/* Description input */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-white">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-lg border border-[#028EFC] bg-transparent px-4 py-3 text-sm text-white placeholder:text-[#AEB9E1]"
              rows={4}
            />
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <Savebutton
              identifier="cod-save-button"
              buttonText="Save Changes"
              onClick={handleSave}
            />
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
