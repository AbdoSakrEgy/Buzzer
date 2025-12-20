"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { useAuth } from "@/src/context";
import { useAuthFetch } from "@/src/hooks";
import { API_BASE_URL } from "@/src/lib/config";
import { UserType } from "@/src/services/auth.api";

interface UserProfile {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  profileImage_public_id: string | null;
}

export default function ProfileEditView() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const authFetch = useAuthFetch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(isAuthenticated && !!token);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // User type - defaults to customer (could be enhanced to store in auth context)
  const [userType] = useState<UserType>(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("buzzer_user_type") as UserType) || "customer"
      );
    }
    return "customer";
  });

  // Get API endpoint based on user type
  const getApiEndpoint = (
    action: "upload-profile-image" | "update-basic-info"
  ) => {
    const endpoints: Record<UserType, string> = {
      customer: `${API_BASE_URL}/customer/${action}`,
      admin: `${API_BASE_URL}/admin/${action}`,
      cafe: `${API_BASE_URL}/cafe/${action}`,
      restaurant: `${API_BASE_URL}/restaurant/${action}`,
    };
    return endpoints[userType];
  };

  // Fetch user profile
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    authFetch(`${API_BASE_URL}/auth/profile`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.user) {
          const userData = data.data.user;
          setUser(userData);
          setFullName(userData.fullName || "");
          setPhone(userData.phone || "");
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

  // Handle image upload
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await authFetch(getApiEndpoint("upload-profile-image"), {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Show local preview immediately
        const localUrl = URL.createObjectURL(file);
        setProfileImage(localUrl);
        setSuccess("Image uploaded successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error(data.message || "Failed to upload image");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await authFetch(getApiEndpoint("update-basic-info"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          phone,
          email: user?.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        // Redirect to profile after short delay
        setTimeout(() => router.push("/profile"), 1000);
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Please login to edit your profile
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

  return (
    <section className="max-w-xl mx-auto px-4 pb-16 pt-36">
      {/* Avatar Section */}
      <div className="flex flex-col items-center mb-10">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingImage}
          className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group disabled:cursor-not-allowed"
        >
          {/* Profile Image */}
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
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

          {/* Add Image Bar at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-amber-500 py-1.5 text-white text-xs font-medium text-center">
            Add Image
          </div>

          {/* Loading Overlay */}
          {uploadingImage && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm text-center">
          {success}
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-gray-900 font-medium mb-2">Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900"
          />
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-gray-900 font-medium mb-2">
            Phone No
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+966 0000 000"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900"
          />
        </div>

        {/* Update Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-12 py-3 border-2 border-amber-500 text-amber-500 font-medium rounded-full hover:bg-amber-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </section>
  );
}
