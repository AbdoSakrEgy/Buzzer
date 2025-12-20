"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout, AuthInput } from "@/src/components/auth";
import { PrimaryButton } from "@/src/components/common";
import { initRecaptcha, sendOTP, formatPhoneNumber } from "@/src/lib/firebase";

export default function LoginStep1() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState<
    "admin" | "customer" | "cafe" | "restaurant"
  >("customer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false);

  // Initialize reCAPTCHA on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        initRecaptcha("login-button");
        setRecaptchaInitialized(true);
      } catch (err) {
        console.error("Failed to initialize reCAPTCHA:", err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!phone) {
        throw new Error("Please enter your phone number");
      }

      if (!recaptchaInitialized) {
        throw new Error("Please wait for security check to complete");
      }

      // Format phone number to E.164 format
      const formattedPhone = formatPhoneNumber(phone);

      // Send OTP via Firebase
      await sendOTP(formattedPhone);

      // Store phone and user type in sessionStorage for step2
      sessionStorage.setItem("loginPhone", formattedPhone);
      sessionStorage.setItem("loginUserType", userType);

      // Navigate to step2 for code verification
      router.push("/login/step2");
    } catch (err) {
      console.error("Login OTP error:", err);
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout imageSrc="/login/login1 img.png" imageAlt="Login Illustration">
      <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
        Welcome!
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Enter your phone number to receive a verification code
      </p>

      <form onSubmit={handleNext} className="space-y-4">
        {/* User Type Dropdown */}
        <div className="w-full">
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as typeof userType)}
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.75rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.25rem",
            }}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="cafe">Cafe</option>
            <option value="restaurant">Restaurant</option>
          </select>
        </div>

        <AuthInput
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number (e.g., 01234567890)"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="pt-8">
          <PrimaryButton
            id="login-button"
            type="submit"
            isLoading={isLoading}
            loadingText="Sending OTP..."
          >
            Next
          </PrimaryButton>
        </div>
      </form>

      {/* reCAPTCHA notice */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        This site is protected by reCAPTCHA and the Google Privacy Policy
        applies.
      </p>

      <p className="text-center text-gray-500 text-sm mt-6">
        Don&apos;t have an Account?{" "}
        <Link
          href="/register"
          className="text-amber-500 font-medium hover:text-amber-600 transition-colors"
        >
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
