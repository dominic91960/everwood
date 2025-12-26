"use client";

import React, { useState } from "react";

import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { IoLogOutOutline } from "react-icons/io5";
import { AiOutlineDashboard } from "react-icons/ai";

import { useAuthStore } from "@/store/auth-store";

import CredentialForm from "./CredentialForm";
import ShippingForm from "./ShippingForm";
import BillingForm from "./BillingForm";
import OrderTable from "./OrderTable";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FormTabs = () => {
  const { user, setUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState("credential");
  const [isDisabled, setIsDisabled] = useState(false);

  const tabs = [
    { id: "credential", label: "Credential" },
    { id: "shipping", label: "Shipping Address" },
    { id: "billing", label: "Billing Address" },
    { id: "order", label: "Order Details" },
  ];

  const handleSignOut = async () => {
    try {
      setIsDisabled(true);

      await auth.signOut();
      setUser(null);

      toast.success("Sign out successful");
    } catch {
      toast.error("Sign out failed");
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "mt-[3em] mb-[1em] flex items-center justify-end lg:hidden",
          user && user.role.name !== "CUSTOMER" && "justify-between",
        )}
      >
        {user && user.role.name !== "CUSTOMER" && (
          <Link href="/admin">
            <button className="bg-foreground hover:bg-foreground/80 text-background flex items-center gap-[0.3em] rounded-[0.3em] px-[1em] py-[0.4em]">
              <AiOutlineDashboard className="text-[1.3em]" /> Dashboard
            </button>
          </Link>
        )}

        <button
          onClick={handleSignOut}
          className="bg-foreground hover:bg-foreground/80 text-background flex items-center gap-[0.3em] rounded-[0.3em] px-[1em] py-[0.4em]"
          disabled={isDisabled}
        >
          <IoLogOutOutline className="text-[1.3em]" />
          Sign Out
        </button>
      </div>

      <div className="bg-foreground/10 grid grid-cols-1 rounded-[1em] p-[1em] lg:mt-[3em] lg:grid-cols-10">
        <div className="lg:border-r-foreground/30 relative flex flex-col justify-between gap-[4em] p-[1em] lg:col-span-3 lg:border-r">
          <ul className="space-y-[1em]">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full rounded-[0.5em] border border-transparent px-[1em] py-[0.5em] text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "hover:bg-foreground/5"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          <ul className="hidden space-y-[0em] lg:block">
            {user && user.role.name !== "CUSTOMER" && (
              <li>
                <Link href="/admin">
                  <button className="hover:bg-foreground/5 flex w-full items-center gap-[0.3em] rounded-[0.5em] border border-transparent px-[1em] py-[0.5em] text-left transition-colors disabled:pointer-events-none disabled:opacity-50">
                    <AiOutlineDashboard className="text-[1.3em]" /> Dashboard
                  </button>
                </Link>
              </li>
            )}

            <li>
              <button
                onClick={handleSignOut}
                className="hover:bg-foreground/5 flex w-full items-center gap-[0.3em] rounded-[0.5em] border border-transparent px-[1em] py-[0.5em] text-left transition-colors disabled:pointer-events-none disabled:opacity-50"
                disabled={isDisabled}
              >
                <IoLogOutOutline className="text-[1.3em]" />
                Sign Out
              </button>
            </li>
          </ul>
        </div>

        <div className="p-[1em] lg:col-span-7">
          {activeTab === "credential" && <CredentialForm />}
          {activeTab === "shipping" && <ShippingForm />}
          {activeTab === "billing" && <BillingForm />}
          {activeTab === "order" && <OrderTable />}
        </div>
      </div>
    </>
  );
};

export default FormTabs;
