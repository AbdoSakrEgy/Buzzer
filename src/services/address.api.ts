import axios from "axios";
import { API_BASE_URL } from "@/src/lib/config";

// Address type
export interface Address {
  id: number;
  user_id: number;
  user_type: string;
  label: string | null;
  city: string;
  area: string | null;
  street: string | null;
  building: string | null;
  floor: string | null;
  apartment: string | null;
  isDefault: boolean;
}

export interface AddressResponse {
  status: number;
  message: string;
  data: {
    addresses: Address[];
  };
}

/**
 * Address API Service
 * Handles address-related API calls
 */
export const addressApi = {
  /**
   * Get all addresses
   */
  getAllAddresses: async (): Promise<Address[]> => {
    try {
      const response = await axios.get<AddressResponse>(
        `${API_BASE_URL}/address/get-all-addresses`
      );
      return response.data.data.addresses;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // If 401, return empty array (or handle as needed by caller)
        if (error.response?.status === 401) {
          console.warn(
            "Fetching addresses requires authentication. Returning empty list."
          );
          return [];
        }
        throw new Error(
          error.response?.data?.message || "Failed to fetch addresses"
        );
      }
      throw error;
    }
  },
};

export default addressApi;
