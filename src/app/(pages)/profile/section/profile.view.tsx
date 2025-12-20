"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "@/src/context";
import { useAuthFetch } from "@/src/hooks";
import { API_BASE_URL } from "@/src/lib/config";

interface UserProfile {
  id: number;
  fullName: string;
  age: number | null;
  phone: string;
  email: string;
  isEmailConfirmed: boolean;
  isActive: boolean;
  is2FAActive: boolean;
  profileImage_public_id: string | null;
  pricingPlan: string;
  availableCredits: number;
}

type TabType = "information" | "manage";

export default function ProfileView() {
  const router = useRouter();
  const { token, isAuthenticated, logout } = useAuth();
  const authFetch = useAuthFetch();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  // Only show loading if user is authenticated (we need to fetch data)
  const [loading, setLoading] = useState(isAuthenticated && !!token);
  const [activeTab, setActiveTab] = useState<TabType>("information");
  const [loggingOut, setLoggingOut] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/home");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoggingOut(false);
    }
  };

  // Fetch user profile
  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    authFetch(`${API_BASE_URL}/auth/profile`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.user) {
          setUser(data.data.user);
        }
      })
      .catch((err) => console.error("Failed to fetch profile", err))
      .finally(() => setLoading(false));
  }, [isAuthenticated, token, authFetch]);

  // Fetch profile image
  useEffect(() => {
    if (!token || !user?.profileImage_public_id) return;

    authFetch(`${API_BASE_URL}/auth/get-file/${user.profileImage_public_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.url) {
          setProfileImage(data.data.url);
        }
      })
      .catch((err) => console.error("Failed to fetch profile image", err));
  }, [user?.profileImage_public_id, token, authFetch]);

  if (!isAuthenticated) {
    return (
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Please login to view your profile
        </h2>
        <Link
          href="/login"
          className="text-amber-500 hover:underline font-medium"
        >
          Login here
        </Link>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-20 text-center">
        <p className="text-gray-500">Loading profile...</p>
      </section>
    );
  }

  const manageOptions = [
    { label: "Edit Profile", href: "/profile-edit" },
    { label: "My Orders", href: "/orders-history" },
    { label: "Manage Cards", href: "/profile-cards" },
  ];

  return (
    <section className="max-w-xl mx-auto px-4 pb-16 pt-36">
      {/* Avatar Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={user?.fullName || "Profile"}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-8">
        <button
          onClick={() => setActiveTab("information")}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === "information"
              ? "bg-amber-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          My Information
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === "manage"
              ? "bg-amber-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          Manage Account
        </button>
      </div>

      {/* Content */}
      {activeTab === "information" ? (
        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-center py-3">
            <span className="w-28 text-gray-600 font-medium">Name</span>
            <span className="text-gray-400 mx-4">:</span>
            <span className="text-gray-900">{user?.fullName || "-"}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center py-3">
            <span className="w-28 text-gray-600 font-medium">Phone No</span>
            <span className="text-gray-400 mx-4">:</span>
            <span className="text-gray-900">{user?.phone || "-"}</span>
          </div>

          {/* Email */}
          <div className="flex items-center py-3">
            <span className="w-28 text-gray-600 font-medium">Email</span>
            <span className="text-gray-400 mx-4">:</span>
            <span className="text-gray-900">{user?.email || "-"}</span>
          </div>

          {/* Age */}
          {user?.age && (
            <div className="flex items-center py-3">
              <span className="w-28 text-gray-600 font-medium">Age</span>
              <span className="text-gray-400 mx-4">:</span>
              <span className="text-gray-900">{user.age}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {manageOptions.map((option) => (
            <Link
              key={option.label}
              href={option.href}
              className="flex items-center justify-between py-4 px-4 bg-white border border-gray-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-colors group"
            >
              <span className="text-gray-700 font-medium">{option.label}</span>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" />
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-between py-4 px-4 bg-white border border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors group disabled:opacity-50"
          >
            <span className="text-red-600 font-medium">
              {loggingOut ? "Logging out..." : "Logout"}
            </span>
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      )}
    </section>
  );
}
