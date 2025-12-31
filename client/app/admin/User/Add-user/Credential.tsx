"use client";

import React, { useEffect, useState } from "react";
import { getUserRoles, UserRole } from "../../../../lib/api/userApi";
import { useAuthStore } from "@/store/auth-store";

interface CredentialProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    phoneNumber: string;
    password: string;
    role: string;
  };
  onInputChange: (field: string, value: string) => void;
  getFieldError?: (field: string) => string | null;
}

const Credential: React.FC<CredentialProps> = ({
  formData,
  onInputChange,
  getFieldError,
}) => {
  const { user } = useAuthStore();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const fetchedRoles = await getUserRoles();
        setRoles(fetchedRoles);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const availableRoles = () => {
    let availableRoles = [];

    if (user && user.role.name === "SUPER ADMIN")
      availableRoles = roles.filter((p) => p.name !== "SUPER ADMIN");
    else availableRoles = roles.filter((p) => p.name === "CUSTOMER");

    return availableRoles;
  };

  return (
    <div className="mb-8">
      <h3 className="mb-6 text-[24px] font-semibold text-[#E5E5E5] xl:text-[32px]">
        Credential
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[17px] text-[#FFFFFF]">
            First Name
            {formData.firstName && (
              <span className="ml-2 text-sm text-gray-400">
                ({formData.firstName.length}/2 min)
              </span>
            )}
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => onInputChange("firstName", e.target.value)}
            className={`w-full rounded-md border px-4 py-2 text-white focus:outline-none xl:py-1 ${
              getFieldError && getFieldError("firstName")
                ? "border-red-500 focus:border-red-500"
                : "border-[#6E6E6E] focus:border-[#028EFC]"
            }`}
            required
          />
          {getFieldError && getFieldError("firstName") && (
            <p className="mt-1 text-sm text-red-400">
              {getFieldError("firstName")}
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-[17px] text-[#FFFFFF]">
            Last Name
            {formData.lastName && (
              <span className="ml-2 text-sm text-gray-400">
                ({formData.lastName.length}/2 min)
              </span>
            )}
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => onInputChange("lastName", e.target.value)}
            className={`w-full rounded-md border px-4 py-2 text-white focus:outline-none xl:py-1 ${
              getFieldError && getFieldError("lastName")
                ? "border-red-500 focus:border-red-500"
                : "border-[#6E6E6E] focus:border-[#028EFC]"
            }`}
            required
          />
          {getFieldError && getFieldError("lastName") && (
            <p className="mt-1 text-sm text-red-400">
              {getFieldError("lastName")}
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-[17px] text-[#FFFFFF]">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            className={`w-full rounded-md border px-4 py-2 text-white focus:outline-none xl:py-1 ${
              getFieldError && getFieldError("email")
                ? "border-red-500 focus:border-red-500"
                : "border-[#6E6E6E] focus:border-[#028EFC]"
            }`}
            required
          />
          {getFieldError && getFieldError("email") && (
            <p className="mt-1 text-sm text-red-400">
              {getFieldError("email")}
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-[17px] text-[#FFFFFF]">
            Username
            {formData.username && (
              <span className="ml-2 text-sm text-gray-400">
                ({formData.username.length}/3 min)
              </span>
            )}
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => onInputChange("username", e.target.value)}
            className={`w-full rounded-md border px-4 py-2 text-white focus:outline-none xl:py-1 ${
              getFieldError && getFieldError("username")
                ? "border-red-500 focus:border-red-500"
                : "border-[#6E6E6E] focus:border-[#028EFC]"
            }`}
            required
          />
          {getFieldError && getFieldError("username") && (
            <p className="mt-1 text-sm text-red-400">
              {getFieldError("username")}
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-[17px] text-[#FFFFFF]">
            Phone number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => onInputChange("phoneNumber", e.target.value)}
            className={`w-full rounded-md border px-4 py-2 text-white focus:outline-none xl:py-1 ${
              getFieldError && getFieldError("phoneNumber")
                ? "border-red-500 focus:border-red-500"
                : "border-[#6E6E6E] focus:border-[#028EFC]"
            }`}
            required
          />
          {getFieldError && getFieldError("phoneNumber") && (
            <p className="mt-1 text-sm text-red-400">
              {getFieldError("phoneNumber")}
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-[17px] text-[#FFFFFF]">
            Password
            {formData.password && (
              <span className="ml-2 text-sm text-gray-400">
                ({formData.password.length}/8 min)
              </span>
            )}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => onInputChange("password", e.target.value)}
              className={`w-full rounded-md border px-4 py-2 pr-12 text-white focus:outline-none xl:py-1 ${
                getFieldError && getFieldError("password")
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#6E6E6E] focus:border-[#028EFC]"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 transform text-[#94A3B8] transition-colors hover:text-[#E5E5E5]"
            >
              {showPassword ? (
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
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {getFieldError && getFieldError("password") && (
            <p className="mt-1 text-sm text-red-400">
              {getFieldError("password")}
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-[17px] text-[#FFFFFF]">Role</label>
          <select
            value={formData.role}
            onChange={(e) => onInputChange("role", e.target.value)}
            className={`w-full rounded-md border bg-transparent px-4 py-2 text-white focus:outline-none xl:py-1 ${
              getFieldError && getFieldError("role")
                ? "border-red-500 focus:border-red-500"
                : "border-[#6E6E6E] focus:border-[#028EFC]"
            }`}
            required
            disabled={loading}
          >
            <option value="" className="bg-[#6E6E6E] text-white">
              {loading ? "Loading roles..." : "Select Role"}
            </option>
            {availableRoles().map((role) => (
              <option
                key={role._id}
                value={role._id}
                className="bg-[#6E6E6E] text-white"
              >
                {role.name}
              </option>
            ))}
          </select>
          {getFieldError && getFieldError("role") && (
            <p className="mt-1 text-sm text-red-400">{getFieldError("role")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Credential;
