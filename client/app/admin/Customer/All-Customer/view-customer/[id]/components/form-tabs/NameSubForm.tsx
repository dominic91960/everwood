"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { User } from "@/lib/types";
import { CredentialNameFormSchema, CredentialNameType } from "@/lib/validation";
import FormInput from "./FormInput";

type NameSubFormProps = { user: User };

const NameSubForm: React.FC<NameSubFormProps> = ({ user }) => {
  const {
    register,
    formState: { errors },
  } = useForm<CredentialNameType>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(CredentialNameFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      role: user._id,
    },
  });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="text-[12px] sm:text-[13px] md:text-[15px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]"
    >
      <FormInput
        type="text"
        id="studentFirstName"
        label="First Name"
        {...register("firstName")}
        error={errors.firstName?.message}
        disabled
      />
      <FormInput
        type="text"
        id="studentLastName"
        label="Last Name"
        {...register("lastName")}
        error={errors.lastName?.message}
        disabled
      />
      <FormInput
        id="rd-email"
        label="Email"
        value={user ? user.email : ""}
        disabled
      />
      <FormInput
        id="rd-username"
        label="Username"
        value={user ? user.username : ""}
        disabled
      />
      <FormInput
        id="rd-tel"
        label="Phone number"
        value={user ? (user.phoneNo ?? "") : ""}
        disabled
      />
    </form>
  );
};

export default NameSubForm;
