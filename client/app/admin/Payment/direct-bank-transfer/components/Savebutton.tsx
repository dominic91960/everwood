"use client";

import React, { useRef } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  identifier: string;
  buttonText: string;
  isLoading?: boolean;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ identifier, buttonText, className, isLoading = false, ...props }, ref) => {
    const spanRef = useRef<HTMLSpanElement | null>(null);

    const calSpanPosition = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      const btn = document.querySelector(`.${identifier}`);
      if (!spanRef.current || !btn) return;

      const { top, left } = btn.getBoundingClientRect();
      const spanTop = e.clientY - top;
      const spanLeft = e.clientX - left;

      spanRef.current.style.top = `${spanTop}px`;
      spanRef.current.style.left = `${spanLeft}px`;
    };

    return (
      <Button
        ref={ref}
        disabled={isLoading}
        className={cn(
          identifier,
          "xL:w-1/4 relative flex items-center overflow-hidden rounded-md bg-[#028EFC] p-2 text-white shadow-md transition-all duration-300 ease-in disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onMouseEnter={calSpanPosition}
        {...props}
      >
        <span className="flex-1 pr-6 text-center">
          {isLoading ? "Saving..." : buttonText}
        </span>

        {/* Properly positioned arrow icon */}
        <span className="absolute right-1 flex h-6 w-6 items-center justify-center rounded-full">
          <GoArrowUpRight size={14} className="text-white" />
        </span>
      </Button>
    );
  },
);

PrimaryButton.displayName = "PrimaryButton";

export default PrimaryButton;
