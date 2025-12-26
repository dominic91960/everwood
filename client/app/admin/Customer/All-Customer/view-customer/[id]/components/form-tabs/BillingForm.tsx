"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { User } from "@/lib/types";
import { ShippingFormSchema, ShippingType } from "@/lib/validation";
import FormInput from "./FormInput";

type BillingFormProps = { user: User };

const BillingForm: React.FC<BillingFormProps> = ({ user }) => {
  const {
    register,
    formState: { errors },
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

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="text-[12px] sm:text-[13px] md:text-[15px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]"
    >
      <div className="grid grid-cols-1 gap-[1.5em] lg:grid-cols-2">
        <FormInput
          type="text"
          id="firstName"
          label="First Name"
          {...register("firstName")}
          error={errors.firstName?.message}
          disabled
        />
        <FormInput
          type="text"
          id="lastName"
          label="Last Name"
          {...register("lastName")}
          error={errors.lastName?.message}
          disabled
        />
      </div>

      <div className="grid grid-cols-1 gap-[1.5em] lg:grid-cols-2">
        <FormInput
          type="tel"
          id="tel"
          label="Phone Number"
          {...register("tel")}
          error={errors.tel?.message}
          disabled
        />
        <FormInput
          type="email"
          id="email"
          label="Email Address"
          {...register("email")}
          error={errors.email?.message}
          disabled
        />
      </div>

      <FormInput
        type="text"
        id="address"
        label="Address"
        {...register("address")}
        error={errors.address?.message}
        disabled
      />

      <div className="grid grid-cols-1 gap-[1.5em] lg:grid-cols-2">
        <FormInput
          type="text"
          id="apartment"
          label="Apartment (optional)"
          {...register("apartment")}
          error={errors.apartment?.message}
          disabled
        />
        <FormInput
          type="text"
          id="city"
          label="City"
          {...register("city")}
          error={errors.city?.message}
          disabled
        />
      </div>

      <div className="grid grid-cols-1 gap-[1.5em] lg:grid-cols-2">
        <FormInput
          type="text"
          id="state"
          label="State or Province"
          {...register("state")}
          error={errors.state?.message}
          disabled
        />
        <FormInput
          type="text"
          id="zip"
          label="Zip code"
          {...register("zip")}
          error={errors.zip?.message}
          disabled
        />
      </div>
    </form>
  );
};

export default BillingForm;
