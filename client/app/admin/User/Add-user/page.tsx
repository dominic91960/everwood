"use client";

import React, { useState } from "react";
import Credential from "./Credential";
import Savebutton from "./Savebutton";
import { createUser, CreateUserData } from "../../../../lib/api/userApi";

function Page() {
  const [formData, setFormData] = useState({
    // Credential fields
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phoneNumber: "",
    password: "",
    role: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    // Clear error message when user starts typing
    if (submitMessage) {
      setSubmitMessage(null);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Real-time email validation
  const validateEmail = (email: string) => {
    if (!email) return null;
    if (email.length === 1)
      return "Please enter a valid email address (e.g., user@example.com)";
    if (email.length < 3)
      return "Please enter a valid email address (e.g., user@example.com)";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return "Please enter a valid email address (e.g., user@example.com)";
    return null;
  };

  // Real-time phone validation
  const validatePhone = (phone: string) => {
    if (!phone) return "This field is required";
    const normalized = phone.replace(/\s/g, "");
    const digitsOnlyRegex = /^\d+$/;
    if (!digitsOnlyRegex.test(normalized))
      return "Invalid format (e.g. 0701231234)";
    if (normalized.length !== 10) return "Must be exactly 10 digits";
    return null;
  };

  // Real-time name validation
  const validateName = (name: string, fieldName: string): string | null => {
    if (!name) return null;
    if (name.length === 1)
      return `${fieldName} must be at least 2 characters (${name.length}/2)`;
    if (name.length < 2)
      return `${fieldName} must be at least 2 characters (${name.length}/2)`;
    return null;
  };

  // Real-time username validation
  const validateUsername = (username: string): string | null => {
    if (!username) return null;
    if (username.length === 1)
      return `Username must be at least 3 characters (${username.length}/3)`;
    if (username.length === 2)
      return `Username must be at least 3 characters (${username.length}/3)`;
    if (username.length < 3)
      return `Username must be at least 3 characters (${username.length}/3)`;
    return null;
  };

  // Real-time password validation
  const validatePassword = (password: string): string | null => {
    if (!password) return null;
    const errors = [];
    if (password.length < 8)
      errors.push(`at least 8 characters (${password.length}/8)`);
    if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("one number");
    if (!/[@$!%*?&#^()_\-+=]/.test(password))
      errors.push("one special character");

    if (errors.length > 0) {
      return `Password needs: ${errors.join(", ")}`;
    }
    return null;
  };

  // Get field-specific error message
  const getFieldError = (field: string) => {
    const value = formData[field as keyof typeof formData];

    switch (field) {
      case "firstName":
        return validateName(value, "First name");
      case "lastName":
        return validateName(value, "Last name");
      case "username":
        return validateUsername(value);
      case "email":
        return validateEmail(value);
      case "phoneNumber":
        return validatePhone(value);
      case "password":
        return validatePassword(value);
      case "role":
        if (!value) return "Please select a role";
        return null;
    }
    return null;
  };

  // Check if form has any validation errors
  const hasValidationErrors = () => {
    const fieldsToValidate = [
      "firstName",
      "lastName",
      "username",
      "email",
      "phoneNumber",
      "password",
      "role",
    ];
    return fieldsToValidate.some((field) => getFieldError(field));
  };

  const handleSubmit = async () => {
    // Check for real-time validation errors first
    if (hasValidationErrors()) {
      const fieldsToCheck = [
        "firstName",
        "lastName",
        "username",
        "email",
        "phoneNumber",
        "password",
        "role",
      ];

      const firstError = fieldsToCheck
        .map((field) => getFieldError(field))
        .find((error) => error !== null);

      setSubmitMessage({
        type: "error",
        message: firstError || "Please correct the validation errors above",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Transform form data to match API structure
      const userData: CreateUserData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        phoneNo: formData.phoneNumber, // Note: API expects phoneNo, not phoneNumber
        password: formData.password,
        role: formData.role,
      };

      await createUser(userData);

      setSubmitMessage({
        type: "success",
        message: "User created successfully!",
      });
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        phoneNumber: "",
        password: "",
        role: "",
      });
    } catch (error) {
      setSubmitMessage({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while creating user",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center gap-4">
        <h1 className="text-[28px] font-bold text-[#E5E5E5] sm:text-[24px] md:text-[26px] lg:text-[28px] xl:text-[30px]">
          User
        </h1>
        <span className="mt-2 text-[17px] font-semibold text-[#E5E5E5] sm:text-[18px] md:text-[19px] lg:text-[20px] xl:text-[20px]">
          Add User
        </span>
      </div>

      {/* Form Sections */}
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl bg-[#0000004D]/30 p-6 backdrop-blur-[500px]">
          {/* Credential Section */}
          <Credential
            formData={formData}
            onInputChange={handleInputChange}
            getFieldError={getFieldError}
          />

          {/* Submit Message */}
          {submitMessage && (
            <div
              className={`mt-4 rounded-md p-3 ${
                submitMessage.type === "success"
                  ? "border border-green-500 bg-green-500/20 text-green-400"
                  : "border border-red-500 bg-red-500/20 text-red-400"
              }`}
            >
              {submitMessage.message}
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <Savebutton
              identifier="add-user-btn"
              buttonText="Save Changes"
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
