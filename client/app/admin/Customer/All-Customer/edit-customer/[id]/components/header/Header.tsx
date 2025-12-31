"use client";

import React from "react";
import Image from "next/image";

import { User } from "@/lib/types";
import AvatarDialog from "./AvatarDialog";

type HeaderProps = { user: User; setUser: (user: User) => void };

const Header: React.FC<HeaderProps> = ({ user, setUser }) => {
  const handleAvatarChange = (avatar: string) => {
    if (user) setUser({ ...user, avatar });
  };

  return (
    <>
      <div className="flex items-center gap-[1.2em] text-[1.5em]">
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
            user={user}
            avatar={user.avatar}
            onAvatarChange={handleAvatarChange}
          />
        </div>
        <div>
          <p className="font-semibold">
            {user.firstName} {user.lastName}
          </p>
          <p className="mt-[0.3em] mb-[0.6em] text-[0.7em]">{user.email}</p>
          <hr />
        </div>
      </div>
    </>
  );
};

export default Header;
