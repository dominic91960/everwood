"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddBankAccountModal from "./AddBankAccountModal";
import DeleteModal from "../DeleteModal";

type BankAccount = {
  _id: string;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  branchName: string;
};

interface DesktopAccountTableProps {
  accounts: BankAccount[];
  onAddAccount: (account: BankAccount) => void;
  onUpdateAccount: (id: string, account: BankAccount) => void;
  onRemoveAccount: (id: string) => void;
}

export default function DesktopAccountTable({
  accounts,
  onAddAccount,
  onUpdateAccount,
  onRemoveAccount,
}: DesktopAccountTableProps) {
  const [modalSettings, setModalSettings] = useState<{
    isOpen: "none" | "add" | "delete";
    mode: "add" | "view" | "update";
    data: BankAccount | undefined;
    onAddAccount: (account: BankAccount) => void;
    onUpdateAccount: (id: string, account: BankAccount) => void;
    onRemoveAccount: (id: string) => void;
  }>({
    isOpen: "none",
    mode: "add",
    data: undefined,
    onAddAccount,
    onUpdateAccount,
    onRemoveAccount,
  });

  const handleAddAccount = () => {
    setModalSettings((prev) => ({ ...prev, isOpen: "add" }));
  };

  const handleViewAccount = (_id: string) => {
    setModalSettings((prev) => ({
      ...prev,
      isOpen: "add",
      mode: "view",
      data: accounts.find((a) => a._id === _id),
    }));
  };

  const handleUpdateAccount = (_id: string) => {
    setModalSettings((prev) => ({
      ...prev,
      isOpen: "add",
      mode: "update",
      data: accounts.find((a) => a._id === _id),
    }));
  };

  const handleDeleteAccount = (_id: string) => {
    setModalSettings((prev) => ({
      ...prev,
      isOpen: "delete",
      mode: "update",
      data: accounts.find((a) => a._id === _id),
    }));
  };

  const handleCloseModal = () => {
    setModalSettings((prev) => ({ ...prev, data: undefined, isOpen: "none" }));
  };

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-[#6E6E6E] lg:block">
        {/* Table header */}
        <div className="grid grid-cols-4 gap-3 border-b border-[#6E6E6E] px-4 py-3 text-sm text-[#AEB9E1]">
          <div className="text-left">Account Holder Name</div>
          <div className="text-left">Account Number</div>
          <div className="text-left">Bank Name</div>
          <div className="flex justify-end text-left">
            <Button
              type="button"
              onClick={handleAddAccount}
              className="rounded-lg bg-[#028EFC] px-3 py-1 text-sm text-white"
            >
              Add account
            </Button>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#6E6E6E]">
          {accounts.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-[#AEB9E1]">
              No accounts added yet.
            </div>
          )}
          {accounts.map((acc) => (
            <div
              key={acc._id}
              className="grid grid-cols-4 items-center gap-3 px-4 py-4"
            >
              <p className="bg-transparent px-3 py-2 text-sm text-white">
                {acc.accountHolderName}
              </p>
              <p className="bg-transparent px-3 py-2 text-sm text-white">
                {acc.accountNumber}
              </p>
              <p className="bg-transparent px-3 py-2 text-sm text-white">
                {acc.bankName}
              </p>
              <div className="flex justify-end space-x-2">
                {/* View Icon */}
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[#AEB9E1] transition-colors hover:bg-[#1b1f3c] hover:text-white"
                  title="View details"
                  onClick={() => handleViewAccount(acc._id)}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <rect
                      x="9"
                      y="9"
                      width="6"
                      height="6"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </button>

                {/* Edit Icon */}
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[#AEB9E1] transition-colors hover:bg-[#1b1f3c] hover:text-white"
                  title="Edit account"
                  onClick={() => handleUpdateAccount(acc._id)}
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
                      strokeWidth="1.5"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                {/* Delete Icon */}
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[#AEB9E1] transition-colors hover:bg-[#1b1f3c] hover:text-white"
                  title="Delete account"
                  onClick={() => handleDeleteAccount(acc._id)}
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
                      strokeWidth="1.5"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalSettings.isOpen === "add" && (
        <AddBankAccountModal
          key={modalSettings.data?._id}
          isOpen
          mode={modalSettings.mode}
          data={modalSettings.data}
          onAddAccount={modalSettings.onAddAccount}
          onUpdateAccount={modalSettings.onUpdateAccount}
          onClose={handleCloseModal}
        />
      )}
      {modalSettings.isOpen === "delete" && (
        <DeleteModal
          key={modalSettings.data?._id}
          isOpen
          data={modalSettings.data}
          onRemoveAccount={modalSettings.onRemoveAccount}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
