"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout, AuthInput } from "@/src/components/auth";
import { PrimaryButton } from "@/src/components/common";
import { authApi } from "@/src/services/auth.api";

export default function LoginStep2() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get phone from sessionStorage (set in step1)
    const storedPhone = sessionStorage.getItem("loginPhone");
    if (storedPhone) {
      setPhone(storedPhone);
    } else {
      // If no phone stored, redirect back to step1
      router.push("/login/step1");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Verify the login code
      await authApi.verifyLoginCode(phone.replace(/\s/g, ""), loginCode);

      // ============================================
      // 🔥 FIREBASE OTP VERIFICATION POINT
      // Add Firebase OTP confirmation here:
      // 1. Get the confirmation result from step1
      // 2. Call confirmationResult.confirm(loginCode)
      // 3. Handle successful login (store token, redirect)
      // ============================================

      // Clear session storage
      sessionStorage.removeItem("loginPhone");

      // Redirect to home on success
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setIsLoading(false);
    }
  };

  // Mask phone for display
  const getMaskedPhone = () => {
    if (phone.length < 4) return "*******896";
    return (
      phone.slice(0, 4) +
      "*".repeat(Math.max(0, phone.length - 7)) +
      phone.slice(-3)
    );
  };

  return (
    <AuthLayout
      imageSrc="/login/login img.png"
      imageAlt="Login Code Illustration"
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
        Login Code
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Enter the authentication code we sent at{getMaskedPhone()}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+971 2356 5896"
          disabled
        />

        <AuthInput
          type="text"
          value={loginCode}
          onChange={(e) => setLoginCode(e.target.value)}
          placeholder="Login Code"
          required
          maxLength={6}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="pt-8">
          <PrimaryButton
            type="submit"
            isLoading={isLoading}
            loadingText="Verifying..."
          >
            Submit
          </PrimaryButton>
        </div>
      </form>
    </AuthLayout>
  );
}
