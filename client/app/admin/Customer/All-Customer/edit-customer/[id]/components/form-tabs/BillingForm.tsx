"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoArrowUpRight } from "react-icons/go";
import { toast } from "sonner";
import { AxiosError } from "axios";

import api from "@/lib/axios-instance";
import { User } from "@/lib/types";
import { ShippingFormSchema, ShippingType } from "@/lib/validation";
import FormInput from "./FormInput";

type BillingFormProps = {
  user: User;
  setUser: (user: User) => void;
};

const BillingForm: React.FC<BillingFormProps> = ({ user, setUser }) => {
  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<ShippingType>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(ShippingFormSchema),
    defaultValues: {
      firstName: user.billingInfo.firstName,
      lastName: user.billingInfo.lastName,
      tel: user.billingInfo.phoneNo,
      email: user.billingInfo.email,
      address: user.billingInfo.address,
      apartment: user.billingInfo.apartment,
      city: user.billingInfo.city,
      state: user.billingInfo.state,
      zip: user.billingInfo.zipCode,
    },
  });

  const onSubmit = async (data: ShippingType) => {
    try {
      if (!user) return;

      const billingInfo = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNo: data.tel,
        email: data.email,
        address: data.address,
        apartment: data.apartment,
        city: data.city,
        state: data.state,
        zipCode: data.zip,
      };

      await api.patch(`/user/${user._id}?field=billingInfo`, {
        billingInfo,
      });
      setUser({
        ...user,
        billingInfo,
      });
      toast.success("Update successful");
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";

      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="text-[12px] sm:text-[13px] md:text-[15px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]"
    >
      <div className="grid grid-cols-1 gap-[1.5em] lg:grid-cols-2">
        <FormInput
          type="text"
          id="firstName"
          label="First Name"
          {...register("firstName")}
          error={errors.firstName?.message}
        />
        <FormInput
          type="text"
          id="lastName"
          label="Last Name"
          {...register("lastName")}
          error={errors.lastName?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-[1.5em] lg:grid-cols-2">
        <FormInput
          type="tel"
          id="tel"
          label="Phone Number"
          {...register("tel")}
          error={errors.tel?.message}
        />
        <FormInput
          type="email"
          id="email"
          label="Email Address"
          {...register("email")}
          error={errors.email?.message}
        />
      </div>

      <FormInput
        type="text"
        id="address"
        label="Address"
        {...register("address")}
        error={errors.address?.message}
      />

      <div className="grid grid-cols-1 gap-[1.5em] lg:grid-cols-2">
        <FormInput
          type="text"
          id="apartment"
          label="Apartment (optional)"
          {...register("apartment")}
          error={errors.apartment?.message}
        />
        <FormInput
          type="text"
          id="city"
          label="City"
          {...register("city")}
          error={errors.city?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-[1.5em] lg:grid-cols-2">
        <FormInput
          type="text"
          id="state"
          label="State or Province"
          {...register("state")}
          error={errors.state?.message}
        />
        <FormInput
          type="text"
          id="zip"
          label="Zip code"
          {...register("zip")}
          error={errors.zip?.message}
        />
      </div>

      <button
        className="bg-primary ms-auto flex w-fit items-center gap-[0.5em] rounded-[0.5em] px-[1em] py-[0.5em] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSubmitting || !isDirty}
      >
        <span>{isSubmitting ? "Saving" : "Save Changes"}</span>
        <GoArrowUpRight />
      </button>
    </form>
  );
};

export default BillingForm;
