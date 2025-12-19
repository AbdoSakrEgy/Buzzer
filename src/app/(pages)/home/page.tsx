"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Navbar, Footer } from "@/src/components/layout";
import { cafeApi, Cafe } from "@/src/services/cafe.api";
import { restaurantApi, Restaurant } from "@/src/services/restaurant.api";
import { addressApi, Address } from "@/src/services/address.api"; // Import from service
import {
  HeroSection,
  AboutSection,
  RestaurantsSection,
  FeaturesSection,
  GallerySection,
  NearestRestaurantSection,
} from "./sections";

const API_BASE_URL = "http://localhost:3000/api/v1";

export default function Home() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"restaurants" | "cafes">(
    "restaurants"
  );
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  // Function to fetch image URL from API
  const fetchImageUrl = useCallback(
    async (publicId: string, itemKey: string) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/auth/get-file/${encodeURIComponent(publicId)}`
        );
        if (response.data?.data?.url) {
          setImageUrls((prev) => ({
            ...prev,
            [itemKey]: response.data.data.url,
          }));
        }
      } catch (error) {
        console.error(`Failed to fetch image for ${itemKey}:`, error);
      }
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cafesData, restaurantsData] = await Promise.all([
          cafeApi.getAllCafes(),
          restaurantApi.getAllRestaurants(),
        ]);
        setCafes(cafesData);
        setRestaurants(restaurantsData);

        // Fetch addresses using new service
        try {
          const addressesData = await addressApi.getAllAddresses();
          setAddresses(addressesData);
        } catch (addressError) {
          console.warn(
            "Could not fetch addresses (may require authentication):",
            addressError
          );
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch image URLs when restaurants or cafes data changes
  useEffect(() => {
    const fetchAllImageUrls = async () => {
      // Fetch restaurant images
      restaurants.forEach((restaurant) => {
        if (restaurant.profileImage_public_id) {
          const itemKey = `restaurant-${restaurant.id}`;
          if (!imageUrls[itemKey]) {
            fetchImageUrl(restaurant.profileImage_public_id, itemKey);
          }
        }
      });

      // Fetch cafe images
      cafes.forEach((cafe) => {
        if (cafe.profileImage_public_id) {
          const itemKey = `cafe-${cafe.id}`;
          if (!imageUrls[itemKey]) {
            fetchImageUrl(cafe.profileImage_public_id, itemKey);
          }
        }
      });
    };

    fetchAllImageUrls();
  }, [restaurants, cafes, fetchImageUrl, imageUrls]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <RestaurantsSection
        restaurants={restaurants}
        cafes={cafes}
        addresses={addresses}
        imageUrls={imageUrls}
        isLoading={isLoading}
        activeTab={activeTab}
      />
      <FeaturesSection />
      <NearestRestaurantSection
        restaurants={restaurants}
        addresses={addresses}
        imageUrls={imageUrls}
      />
      <GallerySection />
      <Footer />
    </div>
  );
}
