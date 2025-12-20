"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Trash2 } from "lucide-react";
import { useAuth, useCart } from "@/src/context";
import { useAuthFetch } from "@/src/hooks";
import { API_BASE_URL } from "@/src/lib/config";

interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: string;
    isAvailable: boolean;
    availableQuantity: number;
    restaurant_id?: number;
    cafe_id?: number;
    images?: { public_id: string; secure_url: string }[];
  };
}

interface CartResponse {
  cart: {
    id: number;
    customer_id: number;
    cart_items: CartItem[];
  };
  items: CartItem[];
  totalItems: number;
  totalPrice: string;
}

export default function CartView() {
  const { token, isAuthenticated } = useAuth();
  const { decrementCartCount } = useCart();
  const authFetch = useAuthFetch();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // Only start in loading state if user is authenticated
  const [loading, setLoading] = useState(isAuthenticated && !!token);
  const [productImages, setProductImages] = useState<Record<number, string>>(
    {}
  );
  const [placingOrder, setPlacingOrder] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // Fetch cart data
  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    const controller = new AbortController();

    authFetch(`${API_BASE_URL}/cart/get-cart`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        const response: CartResponse = data.data;
        setCartItems(response.items || []);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch cart", err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [isAuthenticated, token, authFetch]);

  // Fetch product images using /auth/get-file/{public_id}
  useEffect(() => {
    if (!token || cartItems.length === 0) return;

    const fetchImages = async () => {
      const imageMap: Record<number, string> = {};

      await Promise.all(
        cartItems.map(async (item) => {
          const publicId = item.product.images?.[0]?.public_id;
          if (!publicId) return;

          try {
            const res = await authFetch(
              `${API_BASE_URL}/auth/get-file/${publicId}`
            );
            if (res.ok) {
              const data = await res.json();
              imageMap[item.product.id] = data.url || data.data?.url;
            }
          } catch (err) {
            console.error(
              `Failed to fetch image for product ${item.product.id}`,
              err
            );
          }
        })
      );

      setProductImages(imageMap);
    };

    fetchImages();
  }, [cartItems, token, authFetch]);

  // Delete item
  const handleDeleteItem = async (itemId: number) => {
    if (!token) return;

    // Find the item to get its quantity before deletion
    const itemToDelete = cartItems.find((item) => item.id === itemId);

    try {
      const res = await authFetch(
        `${API_BASE_URL}/cart/delete-item/${itemId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        // Sync cart count with navbar badge
        if (itemToDelete) {
          decrementCartCount(itemToDelete.quantity);
        }
      }
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  // Place order with Stripe
  const handlePlaceOrder = async () => {
    if (!token) return;

    setPlacingOrder(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/payment/pay-with-stripe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userCoupons: couponCode ? [couponCode] : [],
        }),
      });

      const data = await res.json();

      if (res.ok && data.data?.checkoutSession?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.data.checkoutSession.url;
      } else {
        console.error("Failed to create checkout session", data);
        alert(data.message || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Failed to place order", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  if (!isAuthenticated) {
    return (
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Please login to view your cart
        </h2>
        <Link
          href="/login"
          className="text-amber-500 hover:underline font-medium"
        >
          Login here
        </Link>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-16 text-center">
        <p className="text-gray-500">Loading cart...</p>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="py-16 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Link
          href="/products"
          className="text-amber-500 hover:underline font-medium"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Cart Items Section */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-xl p-6 flex gap-4"
            >
              {/* Product Image */}
              <div className="w-20 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0">
                {productImages[item.product.id] ? (
                  <Image
                    src={productImages[item.product.id]}
                    alt={item.product.name}
                    width={80}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-amber-200 to-amber-400" />
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1">
                {/* Rating Stars */}
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                  <Star size={14} className="text-gray-200 fill-gray-200" />
                </div>

                <h3 className="font-bold text-gray-900">{item.product.name}</h3>
                <Link
                  href={`/product-details/${item.product.id}`}
                  className="text-red-400 text-sm hover:underline"
                >
                  View Details
                </Link>

                {/* Price Details */}
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <div className="flex">
                    <span className="w-20">Price</span>
                    <span className="text-gray-400 mr-4">:</span>
                    <span className="font-medium text-gray-900">
                      SAR {item.product.price}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-20">Quantity</span>
                    <span className="text-gray-400 mr-4">:</span>
                    <span className="font-medium text-gray-900">
                      x {item.quantity}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-20">Subtotal</span>
                    <span className="text-gray-400 mr-4">:</span>
                    <span className="font-bold text-gray-900">
                      SAR{" "}
                      {(parseFloat(item.product.price) * item.quantity).toFixed(
                        0
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-red-400 hover:text-red-600 p-2 self-start"
                aria-label="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Order Summary */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
          Order Summary
        </h2>
        <div className="space-y-3 text-gray-600">
          <div className="flex">
            <span className="flex-1">Subtotal</span>
            <span className="text-gray-400 mx-4">:</span>
            <span className="font-medium text-gray-900">
              SAR {subtotal.toFixed(0)}
            </span>
          </div>
          <div className="flex">
            <span className="flex-1">VAT</span>
            <span className="text-gray-400 mx-4">:</span>
            <span className="font-medium text-gray-900">
              SAR {vat.toFixed(0)}
            </span>
          </div>
          <div className="flex pt-2 border-t border-gray-100">
            <span className="flex-1 font-medium">Total</span>
            <span className="text-gray-400 mx-4">:</span>
            <span className="font-bold text-red-500 text-lg">
              SAR {total.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Coupon Input */}
        <div className="mt-6">
          <label
            htmlFor="coupon"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Coupon Code (optional)
          </label>
          <input
            type="text"
            id="coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={placingOrder || cartItems.length === 0}
          className="mt-6 w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-colors"
        >
          {placingOrder ? "Processing..." : "Place Order"}
        </button>
      </section>
    </div>
  );
}
