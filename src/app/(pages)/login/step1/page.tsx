"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout, AuthInput } from "@/src/components/auth";
import { PrimaryButton } from "@/src/components/common";
import { authApi } from "@/src/services/auth.api";

export default function LoginStep1() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Call login API to initiate OTP
      await authApi.login({
        type: "customer",
        phone: phone.replace(/\s/g, ""),
      });

      // ============================================
      // 🔥 FIREBASE OTP INTEGRATION POINT
      // Add Firebase phone authentication here:
      // 1. Initialize Firebase RecaptchaVerifier
      // 2. Call signInWithPhoneNumber(auth, phone, recaptchaVerifier)
      // 3. Store confirmation result for verification in step2
      // ============================================

      // Store phone in sessionStorage for step2
      sessionStorage.setItem("loginPhone", phone);

      // Navigate to step2 for code verification
      router.push("/login/step2");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  // Mask phone number for display (e.g., +971*****896)
  const getMaskedPhone = () => {
    if (phone.length < 4) return "*******";
    return (
      phone.slice(0, 4) +
      "*".repeat(Math.max(0, phone.length - 7)) +
      phone.slice(-3)
    );
  };

  return (
    <AuthLayout imageSrc="/login/login1 img.png" imageAlt="Login Illustration">
      <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
        Welcome!
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Enter the authentication code we sent at{getMaskedPhone()}
      </p>

      <form onSubmit={handleNext} className="space-y-4">
        <AuthInput
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="pt-8">
          <PrimaryButton
            type="submit"
            isLoading={isLoading}
            loadingText="Sending..."
          >
            Next
          </PrimaryButton>
        </div>
      </form>

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
