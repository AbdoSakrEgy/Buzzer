import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

// Type definitions
export interface LoginRequest {
  type: "customer" | "cafe" | "restaurant";
  phone: string;
}

export interface RegisterRequest {
  type: "customer" | "cafe" | "restaurant";
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
};

export default authApi;
