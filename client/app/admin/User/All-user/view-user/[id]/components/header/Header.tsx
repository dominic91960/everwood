"use client";

import React from "react";
import Image from "next/image";

import { User } from "@/lib/types";

type HeaderProps = { user: User };

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <>
      <div className="flex items-center gap-[0.5em] text-[1.5em]">
        <div className="border-primary relative rounded-full border-2 p-[4px]">
          <div className="bg-foreground/20 relative size-[3.5em] rounded-full">
            <Image
              src={user.avatar}
              alt=""
              className="rounded-full object-contain object-center"
              fill
            />
          </div>
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
