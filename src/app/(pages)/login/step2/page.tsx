"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout, AuthInput } from "@/src/components/auth";
import { PrimaryButton } from "@/src/components/common";
import { authApi } from "@/src/services/auth.api";
import { useAuth } from "@/src/context";

export default function LoginStep2() {
  const router = useRouter();
  const { login } = useAuth();
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
      // Get the user type from sessionStorage (set in step1)
      const userType = (sessionStorage.getItem("loginUserType") ||
        "customer") as "admin" | "customer" | "cafe" | "restaurant";

      // Call real login API
      const tokens = await authApi.login({
        type: userType,
        phone: phone.replace(/\s/g, ""),
      });

      // Store tokens and fetch profile using new AuthContext login
      await login(tokens);

      // Clear session storage
      sessionStorage.removeItem("loginPhone");
      sessionStorage.removeItem("loginUserType");

      // Redirect to home on success
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
