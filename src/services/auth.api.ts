import axios from "axios";
import { API_BASE_URL } from "@/src/lib/config";

// Type definitions
export type UserType = "admin" | "customer" | "cafe" | "restaurant";

export interface LoginRequest {
  type: UserType;
  phone: string;
}

export interface RegisterRequest {
  type: UserType;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  // Additional fields for cafe/restaurant registration
  address?: string;
  city?: string;
  displayPicture?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user?: unknown;
    token?: string;
  };
}

/**
 * Auth API Service
 * Handles authentication-related API calls
 */
export const authApi = {
  /**
   * Login - Send OTP to phone
   * Note: Firebase OTP integration will be added here
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
      throw error;
    }
  },

  /**
   * Verify Login Code
   * Called after user enters OTP code
   * TODO: Implement when backend endpoint is available
   */
  verifyLoginCode: async (
    phone: string,
    code: string
  ): Promise<AuthResponse> => {
    // Placeholder - will be replaced with actual API call
    console.log("Verifying code:", { phone, code });
    return {
      success: true,
      message: "Code verified successfully",
    };
  },

  /**
   * Register - Create new user account
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Registration failed");
      }
      throw error;
    }
  },

  /**
   * Upload Profile Image
   * Uploads profile picture based on user type
   */
  uploadProfileImage: async (
    type: UserType,
    file: File
  ): Promise<{ success: boolean; imageKey?: string; message?: string }> => {
    // Determine the correct API endpoint based on user type
    const endpointMap: Record<UserType, string> = {
      admin: `${API_BASE_URL}/admin/upload-profile-image`,
      customer: `${API_BASE_URL}/customer/upload-profile-image`,
      cafe: `${API_BASE_URL}/cafe/upload-profile-image`,
      restaurant: `${API_BASE_URL}/restaurant/upload-profile-image`,
    };

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await axios.post(endpointMap[type], formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // API returns: { status, message, data: { Key } }
      return {
        success: true,
        imageKey: response.data.data?.Key,
        message: response.data.message,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to upload image"
        );
      }
      throw error;
    }
  },
};

export default authApi;
