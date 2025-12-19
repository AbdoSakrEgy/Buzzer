import { DecorativeLine, RestaurantCard } from "@/src/components/common";
import { Cafe } from "@/src/services/cafe.api";
import { Restaurant } from "@/src/services/restaurant.api";
import { Address } from "@/src/services/address.api";

interface RestaurantsSectionProps {
  restaurants: Restaurant[];
  cafes: Cafe[];
  addresses: Address[];
  imageUrls: Record<string, string>;
  isLoading: boolean;
  activeTab: "restaurants" | "cafes";
}

export default function RestaurantsSection({
  restaurants,
  cafes,
  addresses,
  imageUrls,
  isLoading,
  activeTab,
}: RestaurantsSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-gray-50" id="restaurants">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Restaurants
          </h2>
          <DecorativeLine />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {(activeTab === "restaurants" ? restaurants : cafes)
              .slice(0, 3)
              .map((item) => (
                <RestaurantCard
                  key={item.id}
                  id={item.id}
                  fullName={item.fullName}
                  imageUrl={
                    imageUrls[
                      `${activeTab === "restaurants" ? "restaurant" : "cafe"}-${
                        item.id
                      }`
                    ]
                  }
                  hasPublicId={!!item.profileImage_public_id}
                  category={activeTab === "restaurants" ? "Restaurant" : "Cafe"}
                  city={
                    addresses.find(
                      (addr) =>
                        addr.user_id == item.id &&
                        addr.user_type ==
                          (activeTab === "restaurants" ? "restaurant" : "cafe")
                    )?.city || "Location unavailable"
                  }
                  isActive={item.isActive}
                />
              ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading &&
          (activeTab === "restaurants" ? restaurants : cafes).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No {activeTab} found at the moment.
              </p>
            </div>
          )}
      </div>
    </section>
  );
}
