"use client";

import React from "react";
import Image from "next/image";

import { useAuthStore } from "@/store/auth-store";
import AvatarDialog from "./AvatarDialog";

const Header = () => {
  const { user, setUser } = useAuthStore();

  const handleAvatarChange = (avatar: string) => {
    if (user) setUser({ ...user, avatar });
  };

  if (!user) return null;
  return (
    <>
      <div className="flex items-center gap-[1.2em] text-[16px] sm:text-[20px] md:text-[24px] lg:h-[2.2em] lg:text-[28px] xl:text-[32px] 2xl:text-[36px]">
        <div className="border-primary relative rounded-full border-2 p-[4px]">
          <div className="bg-foreground/20 relative size-[3.5em] rounded-full">
            <Image
              src={user.avatar}
              alt=""
              className="rounded-full object-contain object-center"
              fill
            />
          </div>

          <AvatarDialog
            avatar={user.avatar}
            onAvatarChange={handleAvatarChange}
          />
        </div>
        <div>
          <p className="font-semibold">
            {user.firstName} {user.lastName}
          </p>
          <p className="mt-[0.3em] mb-[0.6em] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]">
            {user.email}
          </p>
          <hr />
        </div>
      </div>
    </>
  );
};

export default Header;
