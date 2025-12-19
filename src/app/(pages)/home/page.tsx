"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Navbar, Footer } from "@/src/components/layout";
import { cafeApi, Cafe } from "@/src/services/cafe.api";
import { restaurantApi, Restaurant } from "@/src/services/restaurant.api";
import { Store, Coffee, MapPin, Star } from "lucide-react";
import { PrimaryButton, DecorativeLine } from "@/src/components/common";

const API_BASE_URL = "http://localhost:3000/api/v1";

export default function Home() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"restaurants" | "cafes">(
    "restaurants"
  );
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Draw curved arrow on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Arrow settings
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Draw curved path (top to bottom with curve to right)
    ctx.beginPath();
    ctx.moveTo(0, 115); // Start: top
    ctx.quadraticCurveTo(70, 150, 15, 230); // Curve right, end at bottom-left
    ctx.stroke();

    // Draw arrowhead pointing down-left (follows curve direction)
    ctx.beginPath();
    ctx.moveTo(15, 230); // Connect to curve end point
    ctx.lineTo(15, 220); // Upper arm
    ctx.moveTo(15, 230); // Back to tip
    ctx.lineTo(25, 222); // Lower arm
    ctx.stroke();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cafesData, restaurantsData] = await Promise.all([
          cafeApi.getAllCafes(),
          restaurantApi.getAllRestaurants(),
        ]);
        setCafes(cafesData);
        setRestaurants(restaurantsData);
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

  const features = [
    {
      icon: "/home/icon1png.png",
      title: "Fresh Food",
      description:
        "We serve the freshest food prepared daily with quality ingredients.",
    },
    {
      icon: "/home/icon2.png",
      title: "Fast Delivery",
      description:
        "Quick and reliable delivery to your doorstep within minutes.",
    },
    {
      icon: "/home/icon3.png",
      title: "Easy Ordering",
      description:
        "Simple and intuitive ordering process with just a few taps.",
    },
    {
      icon: "/home/icon4.png",
      title: "Best Quality",
      description: "Premium quality food from the best restaurants in town.",
    },
  ];

  const galleryImages = [
    "/home/gallery1.png",
    "/home/gallery2.png",
    "/home/gallery3.png",
    "/home/gallery4.png",
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/home/landing.png"
            alt="Delicious Food"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Hero Content - Left Center */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Heading */}
            <div className="relative mb-4">
              {/* half circle with curved arrow canvas */}
              <div className="hidden lg:flex absolute w-50 h-42 top-41 right-20 -z-50 border-40 border-[#393536] rounded-r-full border-l-0 -translate-y-1/2" />
              {/* Canvas for curved arrow */}
              <canvas
                ref={canvasRef}
                className="hidden lg:block absolute -z-40 pointer-events-none"
                style={{
                  width: "220px",
                  height: "260px",
                  top: "-20px",
                  right: "-80px",
                }}
                width={200}
                height={250}
              />
              <h1 className="relative text-7xl md:text-9xl font-bold text-white leading-none">
                <div className="hidden lg:flex absolute bottom-2 left-2 -z-40 w-130 h-10 text-2xl font-normal justify-end items-center pr-5 rounded-r-full text-[#9e989a] bg-[#393536]">
                  CAN
                </div>
                FOOD
              </h1>
              <h1 className="relative text-7xl md:text-9xl font-bold text-white leading-none">
                <div className="hidden lg:flex absolute bottom-2 left-2 -z-40 w-130 h-10 text-2xl font-normal justify-end items-center pr-5 rounded-r-full text-[#9e989a] bg-[#393536]">
                  CHANGE
                </div>
                MOOD
              </h1>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-md">
              Welcome to our exquisite restaurant finder, where taste meets
              convenience. Discover the best dining experiences in your area.
            </p>

            {/* Search bar */}
            <div className="flex items-center bg-linear-to-r from-gray-800 to-gray-600 rounded-full p-1.5 shadow-2xl max-w-lg">
              <input
                type="text"
                placeholder="Search"
                className="flex-1 bg-transparent text-white placeholder-gray-300 px-6 py-3 outline-none text-lg"
              />
              <button
                className="w-12 h-12 bg-amber-400 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all shrink-0"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/home/sec2 img.png"
                alt="About Buzzer"
                width={600}
                height={500}
                className="rounded-2xl object-cover"
              />
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-400 rounded-2xl -z-10" />
            </div>

            <div>
              <div className="text-lg md:text-2xl text-center font-bold text-gray-900 mb-6">
                Welcome TO Our <br /> Luxury Restaurant
              </div>
              <DecorativeLine />
              <p className="text-gray-600 mb-6 text-center leading-relaxed py-10">
                Welcome to our exquisite salon, where beauty meets expertise.
                Step into a world of luxury and indulgence, where we are
                dedicated to enhancing your natural beauty and leaving you
                feeling radiant.
              </p>
              <div className="flex justify-center">
                <PrimaryButton fullWidth={false} className="rounded-lg">
                  View all
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Restaurants Section */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(activeTab === "restaurants" ? restaurants : cafes)
                .slice(0, 3)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                  >
                    {/* Image Placeholder */}
                    <div className="relative h-48 bg-linear-to-br from-amber-100 to-amber-200 flex items-center justify-center overflow-hidden">
                      {imageUrls[
                        `${
                          activeTab === "restaurants" ? "restaurant" : "cafe"
                        }-${item.id}`
                      ] ? (
                        <Image
                          src={
                            imageUrls[
                              `${
                                activeTab === "restaurants"
                                  ? "restaurant"
                                  : "cafe"
                              }-${item.id}`
                            ]
                          }
                          alt={item.fullName}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : item.profileImage_public_id ? (
                        <div className="animate-pulse w-full h-full bg-amber-200" />
                      ) : (
                        <div className="text-center">
                          {activeTab === "restaurants" ? (
                            <Store
                              size={48}
                              className="text-amber-500 mx-auto mb-2"
                            />
                          ) : (
                            <Coffee
                              size={48}
                              className="text-amber-500 mx-auto mb-2"
                            />
                          )}
                          <p className="text-amber-700 font-medium text-sm">
                            No Image
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.fullName}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                        <MapPin size={16} className="text-amber-500" />
                        <span>Available Now</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star
                            size={16}
                            className="text-amber-400 fill-amber-400"
                          />
                          <span className="text-gray-700 font-medium">4.5</span>
                          <span className="text-gray-400 text-sm">(120+)</span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.isActive ? "Open" : "Closed"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading &&
            (activeTab === "restaurants" ? restaurants : cafes).length ===
              0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No {activeTab} found at the moment.
                </p>
              </div>
            )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best service to ensure your dining experience is
              exceptional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center group-hover:bg-amber-100 transition-all">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-24" id="gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Gallery
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Take a look at some of the delicious food we offer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Order?
          </h2>
          <p className="text-gray-800 max-w-2xl mx-auto mb-8">
            Join thousands of happy customers and start ordering from the best
            restaurants today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-full transition-all"
            >
              Get Started
            </Link>
            <Link
              href="#restaurants"
              className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-full transition-all"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
