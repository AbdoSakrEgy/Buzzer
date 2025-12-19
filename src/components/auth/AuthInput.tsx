"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm text-gray-600 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full px-4 py-3 rounded-lg bg-white border border-gray-200",
            "text-gray-700 placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent",
            "transition-all duration-200",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
