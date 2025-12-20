"use client";
import React, { useState, useEffect } from "react";
import { RestaurantCard } from "@/src/components/common";
import { Search, Star, MessageCircleWarning, Filter, X } from "lucide-react";
import { API_BASE_URL } from "@/src/lib/config";
import {
  Restaurant, // eslint-disable-line @typescript-eslint/no-unused-vars
  Cafe, // eslint-disable-line @typescript-eslint/no-unused-vars
  Category,
  RestaurantsResponse,
  CafesResponse,
  CategoriesResponse,
} from "@/src/types/restaurant.types";

interface DisplayItem {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  profileImage_public_id?: string | null;
  type: "Restaurant" | "Cafe";
}

export default function AvilableRestaurants() {
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Image URLs State
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Function to fetch image URL from API
  const fetchImageUrl = async (publicId: string, itemId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/get-file/${encodeURIComponent(publicId)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.data?.url) {
          setImageUrls((prev) => ({
            ...prev,
            [itemId]: data.data.url,
          }));
        }
      }
    } catch (error) {
      console.error(`Failed to fetch image for ${itemId}:`, error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(`Fetching from: ${API_BASE_URL}`);

        const [resResponse, cafeResponse, catResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/restaurant/all-restaurants`),
          fetch(`${API_BASE_URL}/cafe/all-cafes`),
          fetch(`${API_BASE_URL}/admin/all-categories`),
        ]);

        if (!resResponse.ok) {
          console.error(
            `Restaurant API Error: ${resResponse.status} ${resResponse.statusText}`
          );
        }
        if (!cafeResponse.ok) {
          console.error(
            `Cafe API Error: ${cafeResponse.status} ${cafeResponse.statusText}`
          );
        }
        if (!catResponse.ok) {
          console.error(
            `Category API Error: ${catResponse.status} ${catResponse.statusText}`
          );
        }

        if (!resResponse.ok || !cafeResponse.ok || !catResponse.ok) {
          throw new Error(
            `Failed to fetch data. Res: ${resResponse.status}, Cafe: ${cafeResponse.status}, Cat: ${catResponse.status}`
          );
        }

        const resData: RestaurantsResponse = await resResponse.json();
        const cafeData: CafesResponse = await cafeResponse.json();
        const catData: CategoriesResponse = await catResponse.json();

        const formattedRestaurants: DisplayItem[] =
          resData.data.restaurants.map((r) => ({
            ...r,
            type: "Restaurant",
          })) || [];

        const formattedCafes: DisplayItem[] =
          cafeData.data.cafes.map((c) => ({
            ...c,
            type: "Cafe",
          })) || [];

        setItems([...formattedRestaurants, ...formattedCafes]);
        setCategories(catData.data.categories || []);
      } catch (err) {
        console.error("Fetch Data Error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load restaurants and cafes."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch images when items are loaded
  useEffect(() => {
    items.forEach((item) => {
      if (item.profileImage_public_id) {
        const itemKey = `${item.type}-${item.id}`;
        // Only fetch if we haven't already
        if (!imageUrls[itemKey]) {
          fetchImageUrl(item.profileImage_public_id, itemKey);
        }
      }
    });
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter Logic
  const filteredItems = items.filter((item) =>
    item.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Mobile Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ... (existing helper functions)

  const renderFilters = () => (
    <>
      {/* Rating */}
      <div className="text-lg font-bold my-3">Rating</div>
      {[5, 4, 3, 2, 1].map((stars) => (
        <div key={stars} className="flex justify-between items-center mb-2">
          <div className="flex gap-1">
            {Array.from({ length: stars }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className="text-amber-400 fill-amber-400"
              />
            ))}
          </div>
          <input type="checkbox" className="w-4 h-4 accent-amber-500" />
        </div>
      ))}

      {/* Category */}
      <div className="text-lg font-bold my-3 mt-6">Category</div>
      {categories.length > 0 ? (
        categories.map((cat) => (
          <div key={cat.id} className="flex justify-between items-center mb-2">
            <div className="text-gray-600 capitalize">{cat.name}</div>
            <input type="checkbox" className="w-4 h-4 accent-amber-500" />
          </div>
        ))
      ) : (
        <div className="text-sm text-gray-400">Loading categories...</div>
      )}

      {/* Price Range */}
      <div className="text-lg font-bold my-3 mt-6">Price Range</div>
      <div className="mb-2">
        <input
          type="range"
          min="0"
          max="1000"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>$0</span>
          <span>$1000</span>
        </div>
      </div>

      {/* Special Requirements */}
      <div className="text-lg font-bold my-3 mt-6">Special Requirements</div>
      {[
        "No Fish",
        "Vegetarian",
        "Vegan",
        "Gluten Free",
        "Halal",
        "Kosher",
        "Dairy Free",
      ].map((req, index) => (
        <div key={index} className="flex justify-between items-center mb-2">
          <div className="text-gray-600">{req}</div>
          <input type="checkbox" className="w-4 h-4 accent-amber-500" />
        </div>
      ))}
    </>
  );

  return (
    <section className="flex flex-col md:flex-row justify-between items-start gap-8 p-4 md:p-8 relative">
      {/* Search Bar - Mobile Only Position (Optional, but keeping it in main content for now) */}

      {/* Mobile Filter Toggle Button */}
      <button
        className="md:hidden flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-md shadow-sm mb-4 w-full justify-center"
        onClick={() => setIsFilterOpen(true)}
      >
        <Filter size={20} className="text-gray-600" />
        <span className="font-medium text-gray-700">Filters</span>
      </button>

      {/* Mobile Filter Drawer Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFilterOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-sm h-full bg-white shadow-xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            {renderFilters()}
            {/* Apply Button for Mobile */}
            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full mt-8 bg-amber-400 text-white font-bold py-3 rounded-lg hover:bg-amber-500 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar Filters */}
      <div className="hidden md:flex w-full md:w-1/4 flex-col rounded-md p-5 border border-gray-100 bg-white shadow-sm sticky top-24">
        {renderFilters()}
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4">
        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex shadow-md rounded-md overflow-hidden border border-gray-100">
            <div className="flex-1 flex items-center bg-white px-4 py-3">
              <Search className="text-gray-400 w-5 h-5 mr-3" />
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full outline-none text-gray-600 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to page 1 on search
                }}
              />
            </div>
            <button className="bg-amber-400 hover:bg-amber-500 text-white font-medium px-8 py-3 transition-colors hidden sm:block">
              Search
            </button>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-red-500 bg-red-50 rounded-lg">
              <MessageCircleWarning size={48} className="mb-2" />
              <p>{error}</p>
            </div>
          ) : currentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((item) => (
                <RestaurantCard
                  key={`${item.type}-${item.id}`}
                  id={item.id}
                  fullName={item.fullName}
                  imageUrl={imageUrls[`${item.type}-${item.id}`] || undefined}
                  hasPublicId={!!item.profileImage_public_id}
                  category={item.type}
                  isActive={true} // Defaulting to true as not in API
                  city="" // Not in API, optional now
                  className="w-full"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400 bg-gray-50 rounded-lg">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="text-lg">
                No restaurants found matching &quot;{searchQuery}&quot;
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                  currentPage === i + 1
                    ? "bg-amber-400 text-white font-medium"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
