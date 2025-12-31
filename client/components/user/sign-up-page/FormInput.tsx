import { cn } from "@/lib/utils";
import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClasses?: string;
  label: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  containerClasses = "",
  label,
  error,
  id,
  className,
  ...props
}) => {
  return (
    <div className={cn("relative mb-[1.5em]", containerClasses)}>
      <label htmlFor={id} className="font-light">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={cn(
          "border-foreground/15 focus:border-foreground/30 placeholder:text-foreground/80 mt-[0.4em] h-[2em] w-full rounded-[0.5em] border px-[1em] transition-colors focus:outline-none",
          className,
        )}
      />
      {error && (
        <p className="absolute top-full left-0 mt-[0.2em] text-[0.8em] font-light text-[#FF8E72]">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
