"use client";

import React from "react";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
} from "firebase/auth";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoArrowUpRight } from "react-icons/go";
import { MdArrowBackIosNew } from "react-icons/md";
import { toast } from "sonner";

import api from "@/lib/axios-instance";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/lib/types";
import {
  CredentialPasswordFormSchema,
  CredentialPasswordType,
} from "@/lib/validation";
import PasswordInput from "./PasswordInput";

type PasswordSubFormProps = {
  user: User;
  handleClose: () => void;
};

const PasswordSubForm: React.FC<PasswordSubFormProps> = ({
  user,
  handleClose,
}) => {
  const { user: adminUser, setSkipAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitting, errors },
    reset,
  } = useForm<CredentialPasswordType>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(CredentialPasswordFormSchema),
  });

  const onSubmit = async (data: CredentialPasswordType) => {
    try {
      setSkipAuth(true);

      const firebaseUser = auth.currentUser;
      if (!adminUser || !firebaseUser) return;

      if (adminUser.providerId === "email/password" && data.password) {
        const credential = EmailAuthProvider.credential(
          adminUser.email,
          data.password,
        );
        await reauthenticateWithCredential(firebaseUser, credential);
      } else if (adminUser.providerId === "google.com") {
        await reauthenticateWithPopup(firebaseUser, googleProvider);
      }

      const idToken = await firebaseUser.getIdToken(true);
      api.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;

      await api.patch(`/user/${user._id}?field=password`, {
        password: data.password,
        newPassword: data.newPassword,
      });
      reset();

      toast.success("Update successful.");
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";

      if (err instanceof FirebaseError) {
        errorMessage = err.code.replaceAll("-", " ");
      } else if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setSkipAuth(false);
    }
  };

  return (
    <>
      <div className="mb-[1em] flex items-center gap-[0.5em]">
        <button type="button" onClick={handleClose}>
          <MdArrowBackIosNew />
        </button>
        <p>Account Credential</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-[12px] sm:text-[13px] md:text-[15px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]"
      >
        <PasswordInput
          id="new-password"
          label="User's New Password"
          {...register("newPassword")}
          error={errors.newPassword?.message}
        />
        <PasswordInput
          id="confirm-password"
          label="Confirm New Password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
        {adminUser && adminUser.providerId === "email/password" && (
          <PasswordInput
            id="password"
            label="Your Password (For Verification)"
            {...register("password")}
            error={errors.password?.message}
          />
        )}

        <button
          className="bg-primary ms-auto flex w-fit items-center gap-[0.5em] rounded-[0.5em] px-[1em] py-[0.5em] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting || !isDirty}
        >
          <span>{isSubmitting ? "Saving" : "Save Changes"}</span>
          <GoArrowUpRight />
        </button>
      </form>
    </>
  );
};

export default PasswordSubForm;
