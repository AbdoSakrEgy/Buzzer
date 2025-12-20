"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthLayout, AuthInput } from "@/src/components/auth";
import { PrimaryButton } from "@/src/components/common";
import { authApi, RegisterRequest } from "@/src/services/auth.api";
import { verifyOTP, sendOTP } from "@/src/lib/firebase";

export default function RegisterStep2() {
  const router = useRouter();
  const [step1Data, setStep1Data] = useState<RegisterRequest | null>(null);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    otpCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    // Get form data from step1
    const storedData = sessionStorage.getItem("registerData");
    if (storedData) {
      setStep1Data(JSON.parse(storedData));
    } else {
      // If no data from step1, redirect back
      router.push("/register/step1");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For OTP, only allow numbers and max 6 digits
    if (name === "otpCode") {
      const numericValue = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleVerifyOTP = async () => {
    if (formData.otpCode.length !== 6) {
      setError("Please enter a 6-digit OTP code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const isValid = await verifyOTP(formData.otpCode);
      if (isValid) {
        setOtpVerified(true);
        setError("");
      } else {
        setError("Invalid OTP code. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!step1Data?.phone) return;

    setIsResending(true);
    setError("");

    try {
      await sendOTP(step1Data.phone);
      setError(""); // Clear any previous errors
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
      if (!step1Data) {
        throw new Error("Registration data missing. Please start from step 1.");
      }

      if (!otpVerified) {
        throw new Error("Please verify your phone number first.");
      }

      // Combine step1 and step2 data
      const registrationData: RegisterRequest = {
        ...step1Data,
        address: formData.address,
        city: formData.city,
      };

      // Call register API
      await authApi.register(registrationData);

      // Clear session storage
      sessionStorage.removeItem("registerData");

      // Redirect to home on success
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      imageSrc="/register/register2 img.png"
      imageAlt="Register Illustration"
    >
      {/* Back Arrow */}
      <button
        type="button"
        onClick={() => router.push("/register/step1")}
        className="mb-4 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
        aria-label="Go back to step 1"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold text-black mb-1">
        Verify Your Phone
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {step1Data?.phone
          ? `Enter the OTP sent to ${step1Data.phone}`
          : "Loading..."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* OTP Input Section */}
        <div className="space-y-2">
          <AuthInput
            name="otpCode"
            type="text"
            inputMode="numeric"
            value={formData.otpCode}
            onChange={handleChange}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            disabled={otpVerified}
            className={otpVerified ? "bg-green-50 border-green-500" : ""}
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-sm text-amber-500 hover:text-amber-600 disabled:text-gray-400"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>

            {!otpVerified ? (
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={isLoading || formData.otpCode.length !== 6}
                className="px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>
            ) : (
              <span className="text-green-600 text-sm font-medium">
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        {/* Address fields - only show after OTP verified */}
        {otpVerified && (
          <>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-700 font-medium mb-4">
                Complete your registration
              </p>
            </div>

            <AuthInput
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />

            <AuthInput
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
          </>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {otpVerified && (
          <div className="pt-4">
            <PrimaryButton
              type="submit"
              isLoading={isLoading}
              loadingText="Registering..."
            >
              Submit
            </PrimaryButton>
          </div>
        )}
      </form>

      <p className="text-center text-gray-500 text-sm mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-amber-500 font-medium hover:text-amber-600 transition-colors"
        >
          Login Here
        </Link>
      </p>
    </AuthLayout>
  );
}
