"use client";

import * as React from "react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * PrimaryButton - A reusable primary action button with loading state
 * Used throughout the app for main CTAs like Submit, Continue, Save, etc.
 */
export function PrimaryButton({
  isLoading = false,
  loadingText = "Loading...",
  children,
  fullWidth = true,
  className,
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      disabled={isLoading || disabled}
      className={cn(
        "py-3 bg-white hover:bg-amber-50 text-gray-800 font-medium rounded-full border-2 border-amber-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}

export default PrimaryButton;
