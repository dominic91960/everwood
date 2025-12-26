"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoArrowUpRight } from "react-icons/go";
import { toast } from "sonner";
import { AxiosError } from "axios";

import api from "@/lib/axios-instance";
import { useAuthStore } from "@/store/auth-store";
import { User, UserRole } from "@/lib/types";
import { CredentialNameFormSchema, CredentialNameType } from "@/lib/validation";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

type NameSubFormProps = {
  user: User;
  roles: UserRole[];
  setUser: (user: User) => void;
  setActiveSubForm: (name: string) => void;
};

const NameSubForm: React.FC<NameSubFormProps> = ({
  user,
  roles,
  setUser,
  setActiveSubForm,
}) => {
  const { user: currentUser } = useAuthStore();

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<CredentialNameType>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(CredentialNameFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role._id,
    },
  });

  const getRoles = () => {
    const allRoles = roles.map((r) => ({
      value: r._id,
      placeholder: r.name.toLowerCase(),
    }));

    return allRoles.filter(
      (role) => role.value !== process.env.NEXT_PUBLIC_SUPER_ADMIN_ROLE_ID,
    );
  };

  const onSubmit = async (data: CredentialNameType) => {
    try {
      await api.patch(`/user/${user._id}?field=profile`, {
        ...data,
      });

      const role = roles.find((r) => r._id === data.role);
      setUser({
        ...user,
        firstName: data.firstName,
        lastName: data.lastName,
        role: role ?? user.role,
      });
      reset(data);
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
      <FormInput
        type="text"
        id="studentFirstName"
        label="First Name"
        {...register("firstName")}
        error={errors.firstName?.message}
      />
      <FormInput
        type="text"
        id="studentLastName"
        label="Last Name"
        {...register("lastName")}
        error={errors.lastName?.message}
      />
      {currentUser &&
        user.role._id !== process.env.NEXT_PUBLIC_SUPER_ADMIN_ROLE_ID &&
        currentUser.role._id ===
          process.env.NEXT_PUBLIC_SUPER_ADMIN_ROLE_ID && (
          <FormSelect
            id="user-role"
            label="Role"
            content={getRoles()}
            defaultValue={getValues("role")}
            placeholder="Select Role"
            onValueChange={(value) =>
              setValue("role", value, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
            error={errors.role?.message}
          />
        )}

      <div className="relative">
        {user && user.providerId === "email/password" && (
          <button
            type="button"
            className="text-primary absolute top-0 right-0 z-[1] flex items-center"
            onClick={() => setActiveSubForm("email")}
          >
            <span>Change e-mail address</span> <GoArrowUpRight />
          </button>
        )}
        <FormInput
          id="rd-email"
          label="Email"
          value={user ? user.email : ""}
          readOnly
          className="cursor-not-allowed"
        />
      </div>

      <div className="relative">
        <button
          type="button"
          className="text-primary absolute top-0 right-0 z-[1] flex items-center"
          onClick={() => setActiveSubForm("username")}
        >
          <span>Change username</span> <GoArrowUpRight />
        </button>
        <FormInput
          id="rd-username"
          label="Username"
          value={user ? user.username : ""}
          readOnly
          className="cursor-not-allowed"
        />
      </div>

      {user && user.providerId === "email/password" && (
        <div className="relative">
          <button
            type="button"
            className="text-primary absolute top-0 right-0 z-[1] flex items-center"
            onClick={() => setActiveSubForm("password")}
          >
            <span>Change password</span> <GoArrowUpRight />
          </button>
          <FormInput
            id="rd-password"
            label="Password"
            value=""
            readOnly
            className="cursor-not-allowed"
          />
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          className="text-primary absolute top-0 right-0 z-[1] flex items-center"
          onClick={() => setActiveSubForm("phone")}
        >
          <span>Change phone number</span> <GoArrowUpRight />
        </button>
        <FormInput
          id="rd-tel"
          label="Phone number"
          value={user ? (user.phoneNo ?? "") : ""}
          readOnly
          className="cursor-not-allowed"
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

export default NameSubForm;
