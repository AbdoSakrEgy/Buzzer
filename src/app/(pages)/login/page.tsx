"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Login Page - Redirects to step1
 * Main entry point for the login flow
 */
export default function Login() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login/step1");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading...</div>
    </div>
  );
}
