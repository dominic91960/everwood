"use client";

import React, { useRef } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  identifier: string;
  buttonText: string;
  loading?: boolean;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ identifier, buttonText, className, loading = false, disabled, ...props }, ref) => {
    const spanRef = useRef<HTMLSpanElement | null>(null);

    const calSpanPosition = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
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
        disabled={loading || disabled}
        className={cn(
          identifier,
          "relative flex items-center bg-[#028EFC] text-white rounded-md p-2 shadow-md transition-all duration-300 ease-in hover:bg-[#5FA3B6] overflow-hidden w-full",
          loading && "opacity-70 cursor-not-allowed",
          className
        )}
        onMouseEnter={calSpanPosition}
        {...props}
      >
        <span className="flex-1 text-center pr-6">
          {loading ? 'Adding Product...' : buttonText}
        </span>

        {/* Properly positioned arrow icon */}
        <span className="absolute right-1 flex items-center justify-center w-6 h-6  rounded-full ">
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoArrowUpRight size={14} className="text-white" />
          )}
        </span>
      </Button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";

export default PrimaryButton;