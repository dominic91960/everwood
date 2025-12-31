"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";

type AuthRouteGuardProps = { children: React.ReactNode };

const AuthRouteGuard: React.FC<AuthRouteGuardProps> = ({ children }) => {
  const { loading, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role.name === "CUSTOMER") router.replace("/");
    else if (!loading && user) router.replace("/admin");
  }, [loading, user, router]);

  if (loading || user)
    return (
      <div className="from-background dark:to-background fixed inset-0 z-100 flex h-screen flex-col items-center justify-center bg-linear-to-br to-[#0A2A4A] text-white dark:from-[#0A2A4A]">
        <p className="animate-pulse text-[2em] tracking-wider uppercase">
          Loading...
        </p>
      </div>
    );

  return <>{children}</>;
};

export default AuthRouteGuard;
