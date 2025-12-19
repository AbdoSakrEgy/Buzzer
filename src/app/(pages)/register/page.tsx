"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Register Page - Redirects to step1
 * Main entry point for the registration flow
 */
export default function Register() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/register/step1");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading...</div>
    </div>
  );
}
