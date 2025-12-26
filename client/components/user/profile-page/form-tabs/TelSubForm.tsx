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
import { CredentialTelFormSchema, CredentialTelType } from "@/lib/validation";
import FormInput from "./FormInput";
import PasswordInput from "./PasswordInput";

const TelSubForm: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const { user, setUser, setSkipAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<CredentialTelType>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(CredentialTelFormSchema),
    defaultValues: {
      tel: user ? (user.phoneNo ?? "") : "",
      validatePassword:
        user && user.providerId === "email/password" ? true : false,
    },
  });

  const onSubmit = async (data: CredentialTelType) => {
    try {
      setSkipAuth(true);

      const firebaseUser = auth.currentUser;
      if (!user || !firebaseUser) return;

      if (user.providerId === "email/password" && data.password) {
        const credential = EmailAuthProvider.credential(
          user.email,
          data.password,
        );
        await reauthenticateWithCredential(firebaseUser, credential);
      } else if (user.providerId === "google.com") {
        await reauthenticateWithPopup(firebaseUser, googleProvider);
      }

      await api.patch(`/user/${user._id}?field=phoneNo`, { phoneNo: data.tel });
      setUser({ ...user, phoneNo: data.tel });
      toast.success("Update successful");
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
        <FormInput
          type="tel"
          id="tel"
          label="Phone number"
          {...register("tel")}
          error={errors.tel?.message}
        />
        {user && user.providerId === "email/password" && (
          <PasswordInput
            id="password"
            label="Password"
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

export default TelSubForm;
