import axios from "axios";
import { API_BASE_URL } from "@/src/lib/config";

// Type definitions
export interface Cafe {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  isActive: boolean;
  profileImage_public_id: string | null;
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
