"use client";
import { Star, Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "@/src/components/common";
import { API_BASE_URL } from "@/src/lib/config";
import { Product } from "@/src/types/product.types";
import { useAuth } from "@/src/context";

interface RateCardProps {
  productId: string;
}

export default function RateCard({ productId }: RateCardProps) {
  const { token, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/product/get-product/${productId}`
        );
        if (res.ok) {
          const data = await res.json();
          setProduct(data.data.product);
        }
      } catch (err) {
        console.error("Failed to fetch product for RateCard", err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  const handleIncrement = () => {
    const maxQty = product?.availableQuantity || 99;
    setQuantity((prev) => (prev < maxQty ? prev + 1 : prev));
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!productId || addingToCart) return;

    // Check if user is authenticated
    if (!isAuthenticated || !token) {
      setCartMessage("Please login to add items");
      return;
    }

    // Check quantity
    if (quantity < 1) {
      setCartMessage("Quantity must be at least 1");
      return;
    }

    setAddingToCart(true);
    setCartMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/cart/add-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setCartMessage(`Added ${quantity} to basket!`);
        setTimeout(() => setCartMessage(null), 3000);
      } else {
        setCartMessage(data.message || "Failed to add");
      }
    } catch (err) {
      console.error("Failed to add to cart", err);
      setCartMessage("Error adding to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center gap-4 max-w-sm mx-auto w-full -translate-y-1/2">
        <div className="animate-pulse h-6 w-32 bg-gray-200 rounded"></div>
        <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center gap-4 max-w-sm mx-auto w-full -translate-y-1/2">
      {/* Stars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <Star key={i} size={24} className="text-amber-400 fill-amber-400" />
        ))}
        <Star size={24} className="text-gray-300 fill-gray-300" />
      </div>

      {/* Product Name */}
      <h2 className="text-xl font-bold text-gray-900 text-center">
        {product?.name || "Product"}
      </h2>

      {/* Price */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl font-bold text-gray-900">
          SAR {product?.price || "0"}
        </span>
      </div>

      {/* Available Quantity */}
      {product?.availableQuantity !== undefined && (
        <div className="text-xs text-gray-400">
          {product.availableQuantity} available
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
        <button
          onClick={handleDecrement}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
          disabled={quantity <= 1}
        >
          <Minus size={18} />
        </button>
        <span className="font-bold text-lg w-8 text-center">{quantity}</span>
        <button
          onClick={handleIncrement}
          className="p-2 hover:bg-amber-100 rounded-full transition-colors text-amber-500"
          disabled={
            product?.availableQuantity !== undefined &&
            quantity >= product.availableQuantity
          }
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Cart Message */}
      {cartMessage && (
        <div
          className={`text-sm font-medium ${
            cartMessage.includes("Added") ? "text-green-600" : "text-red-500"
          }`}
        >
          {cartMessage}
        </div>
      )}

      {/* Add Button */}
      <PrimaryButton
        onClick={handleAddToCart}
        isLoading={addingToCart}
        loadingText="Adding..."
        className="w-full bg-white hover:bg-amber-50 text-gray-800 border-2 border-amber-400 font-semibold uppercase tracking-wide text-sm py-3 shadow-none"
      >
        Add to Basket
      </PrimaryButton>
    </div>
  );
}
