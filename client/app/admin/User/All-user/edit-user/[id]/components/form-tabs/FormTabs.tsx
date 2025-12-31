"use client";

import React, { useState } from "react";

import { User, UserRole } from "@/lib/types";
import CredentialForm from "./CredentialForm";

type FormTabsProps = {
  user: User;
  roles: UserRole[];
  setUser: (user: User) => void;
};

const FormTabs: React.FC<FormTabsProps> = ({ user, roles, setUser }) => {
  const [activeTab, setActiveTab] = useState("credential");

  const tabs = [{ id: "credential", label: "Credential" }];

  return (
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
      </div>

      <div className="p-[1em] lg:col-span-7">
        {activeTab === "credential" && (
          <CredentialForm user={user} roles={roles} setUser={setUser} />
        )}
      </div>
    </div>
  );
};

export default FormTabs;
