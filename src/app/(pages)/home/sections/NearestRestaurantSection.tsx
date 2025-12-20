import {
  DecorativeLine,
  RestaurantCard,
  MapComponent,
} from "@/src/components/common";
import { Restaurant } from "@/src/services/restaurant.api";
import { Address } from "@/src/services/address.api";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface NearestRestaurantSectionProps {
  restaurants: Restaurant[];
  addresses: Address[];
  imageUrls: Record<string, string>;
}

export default function NearestRestaurantSection({
  restaurants,
  addresses,
  imageUrls,
}: NearestRestaurantSectionProps) {
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 24.7136, // Default: Riyadh
    lng: 46.6753,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          if (error.code === 2) {
            console.warn("Location unavailable (using default map center).");
          } else {
            console.error(
              `Error fetching location (Code ${error.code}):`,
              error.message
            );
          }
        }
      );
    }
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white" id="nearest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nearest Restaurants
          </h2>
          <DecorativeLine />
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex shadow-md rounded-md overflow-hidden border border-gray-100">
            <div className="flex-1 flex items-center bg-white px-4 py-3">
              <Search className="text-gray-400 w-5 h-5 mr-3" />
              <input
                type="text"
                placeholder="Search"
                className="w-full outline-none text-gray-600 placeholder-gray-400"
              />
            </div>
            <button className="bg-amber-400 hover:bg-amber-500 text-white font-medium px-8 py-3 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="relative w-full h-[400px] rounded-3xl overflow-hidden mb-12 shadow-lg">
          <MapComponent center={center} zoom={14} />

          {/* Location Request Button - functionality could be added to MapComponent or here to update center */}
          {/* MapComponent handles basic map rendering */}
        </div>

        {/* Restaurant Cards */}
        <div className="flex flex-wrap justify-center gap-6">
          {restaurants &&
            restaurants
              .slice(0, 4)
              .map((item) => (
                <RestaurantCard
                  key={item.id}
                  id={item.id}
                  fullName={item.fullName}
                  imageUrl={imageUrls[`restaurant-${item.id}`]}
                  hasPublicId={!!item.profileImage_public_id}
                  category="Restaurant"
                  city={
                    addresses.find(
                      (addr) =>
                        addr.user_id == item.id &&
                        addr.user_type == "restaurant"
                    )?.city || "Location unavailable"
                  }
                  isActive={item.isActive}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
