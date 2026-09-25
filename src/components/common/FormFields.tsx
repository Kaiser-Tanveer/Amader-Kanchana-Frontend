import { forwardRef } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const baseFieldClasses =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100";

interface FieldWrapperProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
}

export const FieldWrapper = ({
  label,
  htmlFor,
  error,
  required,
  children,
}: FieldWrapperProps & { children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    {children}
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input ref={ref} className={`${baseFieldClasses} ${className}`} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => (
    <textarea ref={ref} rows={4} className={`${baseFieldClasses} resize-y ${className}`} {...props} />
  ),
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = "", children, ...props }, ref) => (
    <select ref={ref} className={`${baseFieldClasses} ${className}`} {...props}>
      {children}
    </select>
  ),
);
Select.displayName = "Select";
