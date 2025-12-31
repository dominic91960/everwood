"use client";

import React, { useState } from "react";
import Savebutton from "./Savebutton";

type BankAccount = {
  _id: string;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  branchName: string;
};

interface AddBankAccountModalProps {
  isOpen: boolean;
  mode: "add" | "view" | "update";
  data: BankAccount | undefined;
  onAddAccount: (account: BankAccount) => void;
  onUpdateAccount: (id: string, account: BankAccount) => void;
  onClose: () => void;
}

export default function AddBankAccountModal({
  isOpen,
  mode,
  data,
  onClose,
  onAddAccount,
  onUpdateAccount,
}: AddBankAccountModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BankAccount>({
    _id: data?._id ?? "",
    accountHolderName: data?.accountHolderName ?? "",
    accountNumber: data?.accountNumber ?? "",
    bankName: data?.bankName ?? "Sampath Bank",
    branchName: data?.branchName ?? "",
  });

  const handleInputChange = (field: keyof BankAccount, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    switch (mode) {
      case "add":
        await onAddAccount(formData);
        break;

      case "update":
        await onUpdateAccount(formData._id, formData);
        break;
    }
    setFormData({
      _id: "",
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      branchName: "",
    });
    onClose();
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
      <div className="mx-4 w-full max-w-2xl rounded-xl border border-[#6E6E6E] bg-[#00000033]/30 p-6 backdrop-blur-[500px]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white capitalize">
            {mode} a bank account
          </h2>
          <button
            onClick={onClose}
            className="left-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#6E6E6E] text-white transition-colors hover:bg-[#2a3f7a]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Account Number */}
              <div>
                <label className="mb-2 block text-sm text-[#FFFFFF]">
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    handleInputChange("accountNumber", e.target.value)
                  }
                  className="w-full rounded-md border border-[#6E6E6E] px-3 py-2 text-sm text-white placeholder:text-[#AEB9E1]/50 focus:border-[#028EFC] focus:outline-none"
                  readOnly={mode === "view"}
                />
              </div>

              {/* Country */}
              <div>
                <label className="mb-2 block text-sm text-[#FFFFFF]">
                  Bank Name
                </label>
                <div className="relative">
                  <select
                    value={formData.bankName}
                    onChange={(e) =>
                      handleInputChange("bankName", e.target.value)
                    }
                    className="w-full appearance-none rounded-md border border-[#6E6E6E] px-3 py-2 text-sm text-white focus:border-[#028EFC] focus:outline-none"
                    disabled={mode === "view"}
                  >
                    <option value="Sampath Bank">Sampath Bank</option>
                    <option value="People's Bank">People&apos;s Bank</option>
                    <option value="BOC">BOC</option>
                    <option value="NDB">NDB</option>
                  </select>
                  <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/4 transform">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Account Name */}
              <div>
                <label className="mb-2 block text-sm text-[#FFFFFF]">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) =>
                    handleInputChange("accountHolderName", e.target.value)
                  }
                  className="w-full rounded-md border border-[#6E6E6E] px-3 py-2 text-sm text-white placeholder:text-[#AEB9E1]/50 focus:border-[#028EFC] focus:outline-none"
                  readOnly={mode === "view"}
                />
              </div>

              {/* Branch */}
              <div>
                <label className="mb-2 block text-sm text-[#FFFFFF]">
                  Branch
                </label>
                <input
                  type="text"
                  value={formData.branchName}
                  onChange={(e) =>
                    handleInputChange("branchName", e.target.value)
                  }
                  className="w-full rounded-md border border-[#6E6E6E] px-3 py-2 text-sm text-white placeholder:text-[#AEB9E1]/50 focus:border-[#028EFC] focus:outline-none"
                  readOnly={mode === "view"}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          {mode !== "view" && (
            <div className="flex justify-end">
              <Savebutton
                identifier="dbt-save-button"
                buttonText="Save Account"
                isLoading={loading}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
