"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { FaUser } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { IoLogOut } from "react-icons/io5";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/user/ui/DropdownMenu";
import { useAuthStore } from "@/store/auth-store";

const Navbar = () => {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsDisabled(true);
      toast.info("Signing out...");

      await signOut(auth);
      setUser(null);

      toast.success("Sign out successful");
    } catch {
      toast.error("Sign out failed");
    } finally {
      setIsDisabled(false);
    }
  };

  const navigate = (href: string) => {
    router.push(href);
  };

  if (!user) return null;

  return (
    <div className="container mx-auto mb-[1em] flex flex-col-reverse items-end sm:flex-row sm:justify-between">
      <h1 className="hidden text-gray-700 sm:block">
        Welcome Back {user.firstName} 👋🏼
      </h1>

      <DropdownMenu>
        <DropdownMenuTrigger className="border-foreground relative size-[2em] overflow-hidden rounded-full border-2 opacity-80 hover:opacity-100 focus:opacity-100 lg:size-[1.8em]">
          <Image
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            fill
            className="rounded-full object-contain object-center"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate("/admin/Profile")}>
            <FaUser />
            <p>Profile</p>
          </DropdownMenuItem>

          {user.role.name !== "CUSTOMER" && (
            <DropdownMenuItem onClick={() => navigate("/")}>
              <GoHomeFill className="text-[1.2em]" />
              <p>Back To Home</p>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={handleSignOut} disabled={isDisabled}>
            <IoLogOut className="text-[1.2em]" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Navbar;
