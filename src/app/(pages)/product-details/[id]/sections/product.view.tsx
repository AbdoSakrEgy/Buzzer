"use client";
import { Star, MapPin } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/src/lib/config";
import { Product } from "@/src/types/product.types";
import {
  CafesResponse,
  RestaurantsResponse,
} from "@/src/types/restaurant.types";

interface ProductViewProps {
  productId: string;
}

export default function ProductView({ productId }: ProductViewProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [supplierName, setSupplierName] = useState<string>("Loading...");
  const [supplierType, setSupplierType] = useState<string>("");
  const location = "Main Market Riyadh, KSA"; // Static default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supplierImage, setSupplierImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // Fetch Product
        const prodRes = await fetch(
          `${API_BASE_URL}/product/get-product/${productId}`
        );
        if (!prodRes.ok) throw new Error("Failed to fetch product");
        const prodData = await prodRes.json();
        const fetchedProduct = prodData.data.product;
        setProduct(fetchedProduct);

        // Determine Supplier (Restaurant or Cafe)
        if (fetchedProduct.restaurant_id) {
          setSupplierType("Restaurant");
          // Fetch all restaurants to find name (since we don't have get-by-id)
          const resRes = await fetch(
            `${API_BASE_URL}/restaurant/all-restaurants`
          );
          if (resRes.ok) {
            const resData: RestaurantsResponse = await resRes.json();
            const found = resData.data.restaurants.find(
              (r) => r.id === fetchedProduct.restaurant_id
            );
            if (found) {
              setSupplierName(found.fullName);
              // If we had location in API we'd set it here
              // Fetch image if needed
              if (found.profileImage_public_id) {
                const imgRes = await fetch(
                  `${API_BASE_URL}/auth/get-file/${encodeURIComponent(
                    found.profileImage_public_id
                  )}`
                );
                if (imgRes.ok) {
                  const imgData = await imgRes.json();
                  if (imgData.data?.url) setSupplierImage(imgData.data.url);
                }
              }
            }
          }
        } else if (fetchedProduct.cafe_id) {
          setSupplierType("Cafe");
          const cafeRes = await fetch(`${API_BASE_URL}/cafe/all-cafes`);
          if (cafeRes.ok) {
            const cafeData: CafesResponse = await cafeRes.json();
            const found = cafeData.data.cafes.find(
              (c) => c.id === fetchedProduct.cafe_id
            );
            if (found) {
              setSupplierName(found.fullName);
              // Setup image
              if (found.profileImage_public_id) {
                const imgRes = await fetch(
                  `${API_BASE_URL}/auth/get-file/${encodeURIComponent(
                    found.profileImage_public_id
                  )}`
                );
                if (imgRes.ok) {
                  const imgData = await imgRes.json();
                  if (imgData.data?.url) setSupplierImage(imgData.data.url);
                }
              }
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProductData();
  }, [productId]);

  if (loading)
    return <div className="p-10 text-center">Loading details...</div>;
  if (error || !product)
    return (
      <div className="p-10 text-red-500">Error loading product: {error}</div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-10">
      {/* 1. Supplier Section */}
      <section>
        <h2 className="text-2xl font-bold text-red-500 mb-6">Supplier</h2>
        <div className="flex items-start gap-6">
          {/* Supplier Image */}
          <div className="relative w-40 h-32 rounded-r-full overflow-hidden bg-gray-100 shrink-0 border border-gray-100 shadow-sm">
            {supplierImage ? (
              <Image
                src={supplierImage}
                alt={supplierName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>

          {/* Supplier Info */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex text-amber-400 gap-1">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} size={20} className="fill-amber-400" />
              ))}
              <Star size={20} className="text-gray-200 fill-gray-200" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>{" "}
            {/* Note: Design showed product name here, or maybe supplier? sticking to design text 'Butter Sandwich' which looks like product */}
            <span className="text-red-400 font-medium">{supplierType}</span>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin size={16} />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Description Section */}
      <section>
        <h2 className="text-2xl font-bold text-red-500 mb-4">Description</h2>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          {product.description || "No description available."}
        </p>
      </section>

      {/* 3. Customer Reviews (Static) */}
      <section>
        <h2 className="text-2xl font-bold text-red-500 mb-6">
          Customer Reviews
        </h2>
        <div className="flex flex-col gap-6">
          {/* Static Reviews */}
          {[1, 2, 3].map((reviewNum) => (
            <div
              key={reviewNum}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-amber-100">
                    {/* Avatar placeholder - gradient background */}
                    <div className="w-full h-full from-amber-300 via-yellow-400 to-amber-500" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Linda</div>
                    <div className="text-sm text-gray-400">Jun 28,2021</div>
                  </div>
                </div>
                <div className="flex text-amber-400 gap-0.5">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} size={18} className="fill-amber-400" />
                  ))}
                  <Star size={18} className="text-gray-200 fill-gray-200" />
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Hotel Booking System is complete Hotel Booking IT Solution comes
                with Hotel Quotation Booking System for travel agent, tour
                operator and hotel chains to collect the inventory of hotels
                from multiple sources .
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
