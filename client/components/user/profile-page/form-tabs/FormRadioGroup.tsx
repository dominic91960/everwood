import React from "react";

import { cn } from "@/lib/utils";
import { RadioGroupProps } from "@radix-ui/react-radio-group";
import { RadioGroup, RadioGroupItem } from "@/components/user/ui/RadioGroup";

type FormRadioGroupProps = RadioGroupProps & {
  options: { value: string; placeholder: string }[];
  error?: string;
};

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  options,
  className,
  error,
  ...props
}) => {
  return (
    <div className="relative mb-[2em]">
      <RadioGroup
        className={cn("flex items-center gap-[1em] border-none", className)}
        {...props}
      >
        {options.map(({ value, placeholder }) => (
          <div key={value} className="flex items-center gap-[0.3em]">
            <RadioGroupItem value={value} id={value} />
            <label htmlFor={value}>{placeholder}</label>
          </div>
        ))}
      </RadioGroup>

      {error && (
        <p className="absolute top-full left-0 mt-[0.2em] text-[0.8em] font-light text-[#FF8E72]">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormRadioGroup;
