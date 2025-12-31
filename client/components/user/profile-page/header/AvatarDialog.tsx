"use client";

import React, { useState } from "react";
import Image from "next/image";

import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FaRegEdit } from "react-icons/fa";

import api from "@/lib/axios-instance";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { AvatarFormSchema, AvatarType } from "@/lib/validation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/user/ui/Dialog";

type AvatarDialogProps = {
  avatar: string;
  onAvatarChange: (avatar: string) => void;
};

const AvatarDialog: React.FC<AvatarDialogProps> = ({
  avatar,
  onAvatarChange,
}) => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AvatarType>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(AvatarFormSchema),
  });

  const watchedFile = watch("avatar");

  const onSubmit = async (data: AvatarType) => {
    try {
      if (!user) return;

      const formData = new FormData();
      formData.append("avatar", data.avatar);
      formData.append("email", user.email);

      const res = await api.patch(`/user/${user._id}?field=avatar`, formData, {
        headers: {
          ...api.defaults.headers.common,
          "Content-Type": "multipart/form-data",
        },
      });
      onAvatarChange(res.data.avatar);
      reset();
      setIsOpen(false);
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
    <Dialog open={isOpen}>
      <DialogTrigger
        className="absolute bottom-0 left-full text-[0.8em] opacity-70 hover:opacity-100"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <FaRegEdit />
      </DialogTrigger>
      <DialogContent
        onClose={() => setIsOpen(false)}
        className="overflow-hidden rounded-[1em] p-[2em] text-[12px] sm:text-[13px] md:text-[15px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]"
      >
        <div className="border-foreground/30 absolute inset-0 rounded-[1em] border"></div>

        <DialogTitle className="relative mx-auto my-[0.5em] w-[20ch] max-w-4/5 text-center text-[1.5em] font-medium">
          Edit Profie Image
        </DialogTitle>

        <div className="border-primary relative mx-auto w-fit rounded-full border-2 p-1">
          <div className="bg-foreground/20 relative size-[3.5em] rounded-full text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] 2xl:text-[36px]">
            <Image
              src={
                watchedFile && watchedFile[0]
                  ? URL.createObjectURL(watchedFile[0])
                  : avatar
              }
              alt=""
              className="rounded-full object-cover object-center"
              fill
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative mt-[1.5em] mb-[0.5em] flex flex-col gap-[0.5em]"
        >
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            className="hidden"
            {...register("avatar")}
            disabled={isSubmitting}
          />
          <div className="flex flex-col">
            <label
              htmlFor="profile-image"
              className={cn(
                "bg-foreground text-background hover:text-primary w-full cursor-pointer rounded-[0.5em] px-[1em] py-[0.5em] text-center uppercase transition-colors duration-300 ease-in",
                isSubmitting && "pointer-events-none opacity-50"
              )}
            >
              Choose File
            </label>
          </div>
          {errors.avatar && typeof errors.avatar.message === "string" && (
            <p className="text-destructive absolute top-full left-0 mt-[0.2em] text-[0.8em] font-light">
              {errors.avatar.message}
            </p>
          )}

          <button
            type="submit"
            className="bg-foreground text-background hover:text-primary w-full rounded-[0.5em] px-[1em] py-[0.5em] text-center uppercase transition-colors duration-300 ease-in disabled:pointer-events-none disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving" : "Save"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarDialog;
