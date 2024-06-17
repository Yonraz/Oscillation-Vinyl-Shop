import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function FileInput({ label, ...inputProps }: InputProps) {
  return (
    <div className="flex">
      <label className="button-file" htmlFor="upload">
        {label}
      </label>
      <input id="upload" className="hidden" type="file" {...inputProps} />
    </div>
  );
}
