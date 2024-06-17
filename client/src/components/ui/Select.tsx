import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  register: any;
  validation: any;
  name: string;
  label: string;
}

export default function Select({
  children,
  register,
  validation,
  name,
  label,
  ...inputProps
}: SelectProps) {
  return (
    <div>
      <label className="text-gray-700 text-sm font-bold mr-2">{label}</label>
      <select {...register(name, validation)} {...inputProps}>
        {children}
      </select>
    </div>
  );
}
