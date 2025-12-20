"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout, AuthInput } from "@/src/components/auth";
import { PrimaryButton } from "@/src/components/common";
import { authApi } from "@/src/services/auth.api";
import { useAuth } from "@/src/context";
import { verifyOTP, sendOTP } from "@/src/lib/firebase";

export default function LoginStep2() {
  const router = useRouter();
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState<
    "admin" | "customer" | "cafe" | "restaurant"
  >("customer");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get phone and user type from sessionStorage (set in step1)
    const storedPhone = sessionStorage.getItem("loginPhone");
    const storedUserType = sessionStorage.getItem(
      "loginUserType"
    ) as typeof userType;

    if (storedPhone) {
      setPhone(storedPhone);
    } else {
      // If no phone stored, redirect back to step1
      router.push("/login/step1");
    }

    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, [router]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and max 6 digits
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtpCode(numericValue);
  };

  const handleResendOTP = async () => {
    if (!phone) return;

    setIsResending(true);
    setError("");

    try {
      await sendOTP(phone);
      alert("OTP sent successfully!");
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (otpCode.length !== 6) {
        throw new Error("Please enter a 6-digit OTP code");
      }

      // Verify OTP with Firebase
      const isValid = await verifyOTP(otpCode);
      if (!isValid) {
        throw new Error("Invalid OTP code. Please try again.");
      }

      // Call backend login API after successful OTP verification
      const tokens = await authApi.login({
        type: userType,
        phone: phone.replace(/\s/g, ""),
      });

      // Store tokens and fetch profile using AuthContext login
      await login(tokens);

      // Clear session storage
      sessionStorage.removeItem("loginPhone");
      sessionStorage.removeItem("loginUserType");

      // Redirect to home on success
      router.push("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Mask phone for display
  const getMaskedPhone = () => {
    if (phone.length < 4) return "*******";
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
        Verify Your Phone
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Enter the code sent to {getMaskedPhone()}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          type="tel"
          value={phone}
          placeholder="Phone Number"
          disabled
          className="bg-gray-50"
        />

        <AuthInput
          type="text"
          inputMode="numeric"
          value={otpCode}
          onChange={handleOtpChange}
          placeholder="Enter 6-digit OTP"
          required
          maxLength={6}
        />

        <div className="flex justify-start">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isResending}
            className="text-sm text-amber-500 hover:text-amber-600 disabled:text-gray-400"
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="pt-8">
          <PrimaryButton
            type="submit"
            isLoading={isLoading}
            loadingText="Verifying..."
            disabled={otpCode.length !== 6}
          >
            Login
          </PrimaryButton>
        </div>
      </form>
    </AuthLayout>
  );
}
