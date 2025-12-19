"use client";

import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
}

/**
 * AuthLayout - Shared layout for authentication pages
 * Two-column layout: form on left, illustration on right
 * Responsive: full width on mobile, split on desktop
 */
export function AuthLayout({ children, imageSrc, imageAlt }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-start px-6 sm:px-8 md:px-16 lg:px-24 py-8 sm:py-12">
        {/* Logo */}
        <div className="mb-8 sm:mb-12">
          <Image
            src="/logo.png"
            alt="Buzzer App"
            width={100}
            height={100}
            className="mb-2"
          />
        </div>

        {/* Form Content */}
        <div className="max-w-md w-full">{children}</div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-white p-8">
        <div className="relative w-full max-w-lg">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={600}
            height={600}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
