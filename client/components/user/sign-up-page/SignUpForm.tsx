"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { toast } from "sonner";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, googleProvider } from "@/lib/firebase";
import { SignUpFormSchema, SignUpType } from "@/lib/validation";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/axios-instance";
import FormInput from "./FormInput";
import PasswordInput from "./PasswordInput";

import logo from "@/public/images/logo.png";

const SignUpForm = () => {
  const router = useRouter();
  const { setSkipAuth, setUser } = useAuthStore();
  const [isDisabled, setIsDisabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignUpType>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(SignUpFormSchema),
  });

  const onSubmit = async (data: SignUpType) => {
    try {
      const payload = {
        avatar: `https://ui-avatars.com/api/?name=${encodeURI(
          data.firstName.charAt(0)
        )}+${encodeURI(
          data.lastName.charAt(0)
        )}&background=random&size=128&format=png`,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        phoneNo: data.tel,
        password: data.password,
        role: process.env.NEXT_PUBLIC_CUSTOMER_ROLE_ID,
      };

      await api.post("/user", payload);

      toast.success("Sign up successful");
      router.push("/sign-in");
    } catch (err: unknown) {
      let errorMessage = "Something went wrong. Please try again.";
      if (err instanceof AxiosError) errorMessage = err.response?.data?.message;
      else if (err instanceof Error) errorMessage = err.message;
      toast.error(errorMessage);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setSkipAuth(true);
      setIsDisabled(true);

      await auth.signOut();
      await signInWithPopup(auth, googleProvider);

      const user = auth.currentUser;
      if (!user) throw new Error("Couldn't sign in");

      const email = user.providerData[0].email;
      if (!email) throw new Error("Your email address is not verified");
      if (!user.displayName)
        throw new Error("Your Google profile is missing a name");

      const avatar =
        user.photoURL ??
        `https://ui-avatars.com/api/?name=${encodeURI(
          user.displayName
        )}&background=random&size=200&format=png`;
      const username = email.split("@")[0];
      const firstName = user.displayName?.split(" ")[0];
      const lastName = user.displayName?.split(" ")[1];
      const phoneNumber = user.phoneNumber;
      const role = process.env.NEXT_PUBLIC_CUSTOMER_ROLE_ID;

      const payload: Record<string, string> = {
        providerId: user.providerData[0].providerId,
        avatar,
        uid: user.uid,
        firstName,
        username,
        email,
      };
      if (lastName) payload.lastName = lastName;
      if (phoneNumber) payload.phoneNumber = phoneNumber;
      if (role) payload.role = role;

      const res = await api.post("/user/google-auth", payload);
      const userData = res.data;

      setSkipAuth(false);
      setUser(userData);

      toast.success("Sign up successful");
    } catch (err: unknown) {
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
      setIsDisabled(false);
    }
  };

  return (
    <section className="relative py-[8em]">
      <div className="from-primary absolute bottom-0 left-0 aspect-square w-2/5 -translate-x-1/2 translate-y-1/2 rounded-full bg-radial to-transparent blur-[5em]"></div>

      <div className="px-container relative container mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-foreground/5 border-foreground/30 mx-auto max-w-[50ch] rounded-[1em] border p-[1.5em] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]"
        >
          <Image
            src={logo}
            alt="TecHCD logo"
            className="mx-auto mb-[1.5em] size-[5em] object-contain"
          />

          <div className="bg-background/20 mx-auto mb-[1em] flex w-fit items-center justify-center gap-[0.5em] rounded-full p-[0.3em]">
            <Link href="/sign-in">
              <button className="rounded-full px-[1em] py-[0.7em]">
                Sign In
              </button>
            </Link>
            <button className="bg-foreground/10 hover:bg-foreground/20 pointer-events-none rounded-full px-[1em] py-[0.7em]">
              Sign Up
            </button>
          </div>

          <div className="grid grid-cols-2 gap-[1em]">
            <FormInput
              type="text"
              id="first-name"
              label="First Name"
              {...register("firstName")}
              error={errors.firstName?.message}
            />

            <FormInput
              type="text"
              id="last-name"
              label="Last Name"
              {...register("lastName")}
              error={errors.lastName?.message}
            />
          </div>

          <FormInput
            type="text"
            id="username"
            label="Username"
            {...register("username")}
            error={errors.username?.message}
            containerClasses="mb-[2.6em] sm:mb-[1.5em]"
          />

          <div className="grid grid-cols-1 gap-[1em] sm:grid-cols-2">
            <FormInput
              type="email"
              id="email"
              label="Email"
              {...register("email")}
              error={errors.email?.message}
            />

            <FormInput
              type="tel"
              id="tel"
              label="Phone Number"
              {...register("tel")}
              error={errors.tel?.message}
            />
          </div>

          <PasswordInput
            id="password"
            label="Password"
            {...register("password")}
            error={errors.password?.message}
          />

          <PasswordInput
            id="confirm-password"
            label="Confirm Password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <button
            type="submit"
            className="bg-foreground text-background hover:text-primary w-full rounded-[0.5em] px-[1em] py-[0.8em] text-center uppercase transition-colors duration-300 ease-in disabled:pointer-events-none disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up" : "Sign Up"}
          </button>

          <div className="text-foreground/80 my-[1.5em] flex items-center gap-[1em] text-[11px] font-light sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]">
            <div className="border-foreground/80 h-px grow border"></div>
            <p className="shrink-0">OR SIGN UP WITH</p>
            <div className="border-foreground/80 h-px grow border"></div>
          </div>

          <button
            type="button"
            className="bg-foreground/10 text-background hover:text-foreground hover:bg-foreground/20 w-full rounded-[0.5em] px-[1em] py-[0.4em] text-center uppercase transition-colors duration-300 ease-in disabled:pointer-events-none disabled:opacity-50"
            onClick={signInWithGoogle}
            disabled={isDisabled}
          >
            <FcGoogle className="mx-auto text-[1.5em]" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default SignUpForm;
