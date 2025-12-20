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
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  status: number;
  message: string;
  data: AuthTokens;
}

export interface ProfileResponse {
  status: number;
  message: string;
  data: {
    user: {
      id: number;
      fullName: string;
      phone: string;
      email: string;
      isActive: boolean;
      profileImage_public_id: string | null;
      pricingPlan: string;
      availableCredits: number;
    };
  };
}

/**
 * Auth API Service
 * Handles authentication-related API calls
 */
export const authApi = {
  /**
   * Login - Returns access and refresh tokens
   */
  login: async (data: LoginRequest): Promise<AuthTokens> => {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/auth/login`,
        data
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
      throw error;
    }
  },

  /**
   * Register - Create new user account and return tokens
   */
  register: async (data: RegisterRequest): Promise<AuthTokens> => {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/auth/register`,
        data
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Registration failed");
      }
      throw error;
    }
  },

  /**
   * Refresh Token - Get new access token using refresh token
   */
  refreshToken: async (
    refreshToken: string
  ): Promise<{ accessToken: string }> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/refresh-token`, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Token refresh failed"
        );
      }
      throw error;
    }
  },

  /**
   * Get Profile - Fetch user profile using access token
   */
  getProfile: async (
    accessToken: string
  ): Promise<ProfileResponse["data"]["user"]> => {
    try {
      const response = await axios.get<ProfileResponse>(
        `${API_BASE_URL}/auth/profile`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return response.data.data.user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch profile"
        );
      }
      throw error;
    }
  },

  /**
   * Logout - Clear session on server
   */
  logout: async (accessToken: string, type: UserType): Promise<void> => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        { type },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Logout failed");
      }
      throw error;
    }
  },

  /**
   * Upload Profile Image
   */
  uploadProfileImage: async (
    type: UserType,
    file: File,
    accessToken: string
  ): Promise<{ success: boolean; imageKey?: string; message?: string }> => {
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
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
