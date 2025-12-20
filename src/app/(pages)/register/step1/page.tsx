"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout, AuthInput } from "@/src/components/auth";
import { PrimaryButton } from "@/src/components/common";
import { initRecaptcha, sendOTP, formatPhoneNumber } from "@/src/lib/firebase";

export default function RegisterStep1() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false);

  // Initialize reCAPTCHA on component mount
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      try {
        initRecaptcha("next-button");
        setRecaptchaInitialized(true);
      } catch (err) {
        console.error("Failed to initialize reCAPTCHA:", err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate form data
      if (
        !formData.type ||
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.password
      ) {
        throw new Error("Please fill in all fields");
      }

      if (!recaptchaInitialized) {
        throw new Error("Please wait for security check to complete");
      }

      // Format phone number to E.164 format (e.g., +201234567890)
      const formattedPhone = formatPhoneNumber(formData.phone);

      // Send OTP to phone
      await sendOTP(formattedPhone);

      // Store form data in sessionStorage for step2
      sessionStorage.setItem(
        "registerData",
        JSON.stringify({
          ...formData,
          phone: formattedPhone, // Store formatted phone
        })
      );

      // Navigate to step2 for OTP verification
      router.push("/register/step2");
    } catch (err) {
      console.error("OTP send error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      imageSrc="/register/register1 img.png"
      imageAlt="Register Illustration"
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-black mb-1">
        Register As Cafe/Restaurant
      </h1>
      <p className="text-gray-500 text-sm mb-6">Register Now!</p>

      <form onSubmit={handleNext} className="space-y-4">
        {/* Type Dropdown */}
        <div className="w-full">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.75rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.25rem",
            }}
          >
            <option value="" disabled>
              Type
            </option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
            <option value="cafe">Cafe</option>
            <option value="restaurant">Restaurant</option>
          </select>
        </div>

        <AuthInput
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />

        <AuthInput
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <AuthInput
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number (e.g., 01234567890)"
          required
        />

        <AuthInput
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          minLength={8}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="pt-4">
          <PrimaryButton
            id="next-button"
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
    </AuthLayout>
  );
}
