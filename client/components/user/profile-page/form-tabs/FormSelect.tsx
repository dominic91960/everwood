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
  placeholder: string;
  content: {
    value: string;
    placeholder: string;
  }[];
  error?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  id,
  placeholder,
  content,
  error,
  ...props
}) => {
  return (
    <div className="relative mb-[2em]">
      <Select {...props}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {content.map(({ value, placeholder }) => (
            <SelectItem key={value} value={value}>
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
