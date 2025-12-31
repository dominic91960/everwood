import React from "react";
import { SelectProps } from "@radix-ui/react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/user/ui/Select";

interface FormSelectProps extends SelectProps {
  id: string;
  label: string;
  placeholder: string;
  content: {
    value: string;
    placeholder: string;
  }[];
  error?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  id,
  label,
  placeholder,
  content,
  error,
  ...props
}) => {
  return (
    <div className="relative mb-[2em]">
      <label htmlFor={id}>{label}</label>
      <Select {...props}>
        <SelectTrigger
          id={id}
          className="mt-[0.4em] h-[2em] capitalize disabled:cursor-default disabled:opacity-100"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {content.map(({ value, placeholder }) => (
            <SelectItem key={value} value={value} className="capitalize">
              {placeholder}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="absolute top-full left-0 mt-[0.2em] text-[0.8em] font-light text-[#FF8E72]">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormSelect;
