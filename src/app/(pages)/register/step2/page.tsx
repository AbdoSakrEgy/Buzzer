"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthLayout, AuthInput } from "@/src/components/auth";
import { PrimaryButton } from "@/src/components/common";
import { authApi, RegisterRequest } from "@/src/services/auth.api";

export default function RegisterStep2() {
  const router = useRouter();
  const [step1Data, setStep1Data] = useState<RegisterRequest | null>(null);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!step1Data) {
        throw new Error("Registration data missing. Please start from step 1.");
      }

      // ============================================
      // 🔥 FIREBASE OTP VERIFICATION POINT
      // Add Firebase OTP confirmation here before registration:
      // 1. Get the confirmation result from step1
      // 2. Call confirmationResult.confirm(otpCode)
      // 3. Proceed with registration only after verification
      // ============================================

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

      // Redirect to login on success
      router.push("/login");
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
        Register As Cafe/Restaurant
      </h1>
      <p className="text-gray-500 text-sm mb-6">Register Now!</p>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="pt-4">
          <PrimaryButton
            type="submit"
            isLoading={isLoading}
            loadingText="Registering..."
          >
            Submit
          </PrimaryButton>
        </div>
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
