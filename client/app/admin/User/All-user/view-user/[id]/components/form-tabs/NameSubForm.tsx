"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { User, UserRole } from "@/lib/types";
import { CredentialNameFormSchema, CredentialNameType } from "@/lib/validation";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

type NameSubFormProps = {
  user: User;
  roles: UserRole[];
};

const NameSubForm: React.FC<NameSubFormProps> = ({ user, roles }) => {
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
      <FormSelect
        id="user-role"
        label="Role"
        content={roles.map((r) => ({
          value: r._id,
          placeholder: r.name.toLowerCase(),
        }))}
        defaultValue={user.role._id}
        placeholder="Select Role"
        error={errors.role?.message}
        disabled
      />
      <FormInput
        id="rd-email"
        label="Email"
        value={user ? user.email : ""}
        readOnly
        disabled
      />
      <FormInput
        id="rd-username"
        label="Username"
        value={user ? user.username : ""}
        readOnly
        disabled
      />
      <FormInput
        id="rd-tel"
        label="Phone number"
        value={user ? (user.phoneNo ?? "") : ""}
        readOnly
        disabled
      />
    </form>
  );
};

export default NameSubForm;
