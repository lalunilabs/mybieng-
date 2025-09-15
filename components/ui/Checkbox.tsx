"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 select-none">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "h-5 w-5 rounded-md border border-gray-300 bg-white",
            "focus:outline-none focus:ring-2 focus:ring-brand-500",
            "checked:bg-brand-600 checked:border-brand-600 checked:accent-brand-600",
            className
          )}
          {...props}
        />
        {label ? (
          <span className="text-sm text-gray-700">{label}</span>
        ) : null}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export default Checkbox;
