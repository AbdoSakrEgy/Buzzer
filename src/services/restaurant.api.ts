import axios from "axios";
import { API_BASE_URL } from "@/src/lib/config";

// Type definitions
export interface Restaurant {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  isActive: boolean;
  profileImage_public_id: string | null;
}

export interface RestaurantsResponse {
  status: number;
  message: string;
  data: {
    restaurants: Restaurant[];
  };
}

/**
 * Restaurant API Service
 * Handles restaurant-related API calls
 */
export const restaurantApi = {
  /**
   * Get all restaurants
   */
  getAllRestaurants: async (): Promise<Restaurant[]> => {
    try {
      const response = await axios.get<RestaurantsResponse>(
        `${API_BASE_URL}/restaurant/all-restaurants`
      );
      return response.data.data.restaurants;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch restaurants"
        );
      }
      throw error;
    }
  },
};

export default restaurantApi;
