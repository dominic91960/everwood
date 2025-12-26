import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  id,
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative mb-[1.5em]">
      <label htmlFor={id} className="font-light">
        {label}
      </label>
      <input
        type={isVisible ? "text" : "password"}
        id={id}
        {...props}
        className={cn(
          "border-foreground/15 focus:border-foreground/30 placeholder:text-foreground/80 mt-[0.4em] h-[2em] w-full rounded-[0.5em] border px-[1em] transition-colors focus:outline-none",
          className,
        )}
      />
      <button
        type="button"
        className="text-primary absolute right-[1em] bottom-0 h-[2em] opacity-80 brightness-150 hover:opacity-100"
        onClick={() => setIsVisible((prev) => !prev)}
      >
        {isVisible ? <IoMdEyeOff /> : <IoMdEye />}
      </button>
      {error && (
        <p className="absolute top-full left-0 mt-[0.2em] text-[0.8em] font-light text-[#FF8E72]">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
