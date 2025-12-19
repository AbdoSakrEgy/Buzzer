import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

// Type definitions
export interface Cafe {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  isActive: boolean;
  profileImage_public_id: string | null;
  profileImage_secure_url: string | null;
}

export interface CafesResponse {
  status: number;
  message: string;
  data: {
    cafes: Cafe[];
  };
}

/**
 * Cafe API Service
 * Handles cafe-related API calls
 */
export const cafeApi = {
  /**
   * Get all cafes
   */
  getAllCafes: async (): Promise<Cafe[]> => {
    try {
      const response = await axios.get<CafesResponse>(
        `${API_BASE_URL}/cafe/all-cafes`
      );
      return response.data.data.cafes;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch cafes"
        );
      }
      throw error;
    }
  },
};

export default cafeApi;
