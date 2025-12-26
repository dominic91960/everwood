"use client";

import React, { useState } from "react";
import Link from "next/link";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { GoHome } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import CredentialForm from "@/components/user/profile-page/form-tabs/CredentialForm";

const FormTabs = () => {
  const { user, setUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState("credential");
  const [isDisabled, setIsDisabled] = useState(false);

  const tabs = [{ id: "credential", label: "Credential" }];

  const handleSignOut = async () => {
    try {
      setIsDisabled(true);

      await signOut(auth);
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
          "mt-[2em] mb-[1em] flex items-center justify-end lg:hidden",
          user && user.role.name !== "CUSTOMER" && "justify-between",
        )}
      >
        {user && user.role.name !== "CUSTOMER" && (
          <Link href="/">
            <button className="bg-foreground hover:bg-foreground/80 text-background flex items-center gap-[0.3em] rounded-[0.3em] px-[1em] py-[0.4em]">
              <GoHome className="text-[1.3em]" /> Back To Home
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

      <div className="bg-foreground/2 grid grid-cols-1 rounded-[1em] p-[1em] lg:mt-[2em] lg:grid-cols-10">
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
                <Link href="/">
                  <button className="hover:bg-foreground/5 flex w-full items-center gap-[0.3em] rounded-[0.5em] border border-transparent px-[1em] py-[0.5em] text-left transition-colors disabled:pointer-events-none disabled:opacity-50">
                    <GoHome className="text-[1.3em]" /> Back To Home
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
        </div>
      </div>
    </>
  );
};

export default FormTabs;
