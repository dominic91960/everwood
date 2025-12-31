"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileAccountList from "./components/MobileAccountList";
import DesktopAccountTable from "./components/DesktopAccountTable";
import api from "@/lib/axios-instance";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";

type BankAccount = {
  _id: string;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  branchName: string;
};

export default function DirectBankTransferPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/payment`);
        const data = res.data.bankTransfer.availableAccounts;
        setAccounts(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addAccount = async (account: BankAccount) => {
    try {
      const res = await api.post("/payment/account", {
        accountHolderName: account.accountHolderName,
        accountNumber: account.accountNumber,
        bankName: account.bankName,
        branchName: account.branchName,
      });
      const data = res.data.bankTransfer.availableAccounts;
      setAccounts(data);
      setToast({ show: true, message: "Account added", type: "success" });
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

  const updateAccount = async (id: string, account: BankAccount) => {
    try {
      const res = await api.patch(`/payment/account/${id}`, account);
      const data = res.data.bankTransfer.availableAccounts;
      setAccounts(data);
      setToast({ show: true, message: "Account updated", type: "success" });
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

  const removeAccount = async (id: string) => {
    try {
      const res = await api.delete(`/payment/account/${id}`);
      const data = await res.data.bankTransfer.availableAccounts;
      setAccounts(data);
      setToast({ show: true, message: "Account deleted", type: "success" });
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
              Direct bank transfer
            </h2>
          </div>

          {/* Account details */}
          <div className="mb-8">
            <h3 className="text-base font-semibold text-white">
              Account Details
            </h3>
            <p className="mb-3 text-xs text-[#AEB9E1]">
              Configure your bank account details.
            </p>

            {/* Mobile/Tablet Layout Component */}
            <MobileAccountList
              accounts={accounts}
              onAddAccount={addAccount}
              onUpdateAccount={updateAccount}
              onRemoveAccount={removeAccount}
            />

            {/* Desktop Layout Component */}
            <DesktopAccountTable
              accounts={accounts}
              onAddAccount={addAccount}
              onUpdateAccount={updateAccount}
              onRemoveAccount={removeAccount}
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
