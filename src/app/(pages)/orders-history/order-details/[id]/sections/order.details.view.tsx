"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { useAuth } from "@/src/context";
import { useAuthFetch } from "@/src/hooks";
import { API_BASE_URL } from "@/src/lib/config";

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_price: string;
  quantity: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: string;
    images: { public_id: string; secure_url: string }[];
    restaurant_id?: number;
    cafe_id?: number;
  };
}

interface Order {
  id: number;
  customer_id: number;
  totalAmount: string;
  status: "pending" | "paid" | "cancelled" | "refunded";
  payment_id: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  order_items: OrderItem[];
  order_coupons: unknown[];
}

interface OrderDetailsViewProps {
  orderId: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "text-amber-500",
    stamp: "NOT PAID",
    stampColor: "text-red-500 border-red-500",
  },
  paid: {
    label: "Accepted",
    color: "text-green-500",
    stamp: "PAID",
    stampColor: "text-green-500 border-green-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-500",
    stamp: null,
    stampColor: "",
  },
  refunded: {
    label: "Refunded",
    color: "text-blue-500",
    stamp: "REFUNDED",
    stampColor: "text-blue-500 border-blue-500",
  },
};

export default function OrderDetailsView({ orderId }: OrderDetailsViewProps) {
  const { token, isAuthenticated } = useAuth();
  const authFetch = useAuthFetch();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productImages, setProductImages] = useState<Record<number, string>>(
    {}
  );
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch order details
  useEffect(() => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    authFetch(`${API_BASE_URL}/order/get-order/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.order) {
          setOrder(data.data.order);
        } else {
          setError("Order not found");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch order", err);
        setError("Failed to load order details");
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, token, orderId, authFetch]);

  // Fetch product images
  useEffect(() => {
    if (!order?.order_items || !token) return;

    order.order_items.forEach(async (item) => {
      if (item.product?.images?.[0]?.public_id) {
        try {
          const res = await authFetch(
            `${API_BASE_URL}/auth/get-file/${encodeURIComponent(
              item.product.images[0].public_id
            )}`
          );
          const data = await res.json();
          if (data.data?.url) {
            setProductImages((prev) => ({
              ...prev,
              [item.product_id]: data.data.url,
            }));
          }
        } catch (err) {
          console.error("Failed to fetch product image", err);
        }
      }
    });
  }, [order?.order_items, token, authFetch]);

  // Calculate order summary
  const subtotal =
    order?.order_items.reduce((sum, item) => {
      return sum + parseFloat(item.product_price) * item.quantity;
    }, 0) || 0;
  const vatRate = 0.15; // 15% VAT
  const vat = subtotal * vatRate;
  const total = subtotal + vat;

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      " " +
      date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!token || actionLoading) return;
    setActionLoading(true);

    try {
      const res = await authFetch(
        `${API_BASE_URL}/order/cancel-order/${orderId}`,
        {
          method: "PATCH",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : null));
      } else {
        setError(data.message || "Failed to cancel order");
      }
    } catch (err) {
      setError("Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle refund order
  const handleRefundOrder = async () => {
    if (!token || actionLoading) return;
    setActionLoading(true);

    try {
      const res = await authFetch(
        `${API_BASE_URL}/order/refund-order/${orderId}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setOrder((prev) => (prev ? { ...prev, status: "refunded" } : null));
      } else {
        setError(data.message || "Failed to refund order");
      }
    } catch (err) {
      setError("Failed to refund order");
    } finally {
      setActionLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Please login to view order details
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
      <section className="py-20 text-center">
        <p className="text-gray-500">Loading order details...</p>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="py-20 text-center">
        <p className="text-red-500">{error || "Order not found"}</p>
        <Link
          href="/orders-history"
          className="text-amber-500 hover:underline font-medium mt-4 inline-block"
        >
          Back to Orders
        </Link>
      </section>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 pt-24">
      {/* Order Info Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Order# {order.id}
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex gap-4">
                <span className="text-gray-500 w-16">Time</span>
                <span className="text-gray-400">:</span>
                <span className="text-gray-900">
                  {formatDate(order.createdAt || order.updatedAt)}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-16">Status</span>
                <span className="text-gray-400">:</span>
                <span className={`font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>
          </div>
          {/* Stamp */}
          {status.stamp && (
            <div
              className={`border-2 ${status.stampColor} rounded-full px-4 py-2 transform rotate-12`}
            >
              <span
                className={`font-bold text-sm ${
                  status.stampColor.split(" ")[0]
                }`}
              >
                {status.stamp}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Method Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
          Payment Method
        </h3>
        <p className="text-gray-500 text-sm">
          {order.payment_id ? "Online Payment" : "Cash on pickup"}
        </p>
      </div>

      {/* Supplier Card - Placeholder since API doesn't return supplier info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
          Supplier
        </h3>
        <div className="flex gap-4">
          <div className="w-24 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-500 text-xs">
              No Image
            </div>
          </div>
          <div>
            <div className="flex text-amber-400 gap-0.5 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} size={14} className="fill-amber-400" />
              ))}
              <Star size={14} className="text-gray-200 fill-gray-200" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Restaurant/Cafe</h4>
            <p className="text-amber-500 text-xs">Restaurant</p>
            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
              <MapPin size={12} className="text-amber-500" />
              <span>Main Market Riyadh, KSA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items */}
      <h3 className="text-lg font-bold text-gray-900 mb-4">Ordered Items</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {order.order_items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                {productImages[item.product_id] ? (
                  <Image
                    src={productImages[item.product_id]}
                    alt={item.product_name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200" />
                )}
              </div>
              <div className="flex-1">
                {/* Stars */}
                <div className="flex text-amber-400 gap-0.5 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} size={12} className="fill-amber-400" />
                  ))}
                  <Star size={12} className="text-gray-200 fill-gray-200" />
                </div>
                {/* Product Name */}
                <h4 className="font-bold text-gray-900 text-sm mb-1">
                  {item.product_name}
                </h4>
                {/* View Details Link */}
                <Link
                  href={`/product-details/${item.product_id}`}
                  className="text-amber-500 text-xs hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
            {/* Price Info */}
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Price</span>
                <span className="text-gray-400">:</span>
                <span className="text-gray-900 font-medium">
                  SAR {parseFloat(item.product_price).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Quantity</span>
                <span className="text-gray-400">:</span>
                <span className="text-gray-900 font-medium">
                  x {item.quantity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-400">:</span>
                <span className="text-gray-900 font-bold">
                  SAR{" "}
                  {(parseFloat(item.product_price) * item.quantity).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 text-center mb-4 pb-2 border-b border-gray-100">
          Order Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-center gap-8">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-400">:</span>
            <span className="text-gray-900 font-medium">
              SAR {subtotal.toFixed(0)}
            </span>
          </div>
          <div className="flex justify-center gap-8">
            <span className="text-gray-500">VAT</span>
            <span className="text-gray-400">:</span>
            <span className="text-gray-900 font-medium">
              SAR {vat.toFixed(0)}
            </span>
          </div>
          <div className="flex justify-center gap-8 pt-2">
            <span className="text-gray-500">Total</span>
            <span className="text-gray-400">:</span>
            <span className="text-amber-500 font-bold">
              SAR {total.toFixed(0)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        {order.status === "pending" && (
          <button
            onClick={handleCancelOrder}
            disabled={actionLoading}
            className="px-8 py-2.5 border-2 border-amber-500 text-amber-500 font-medium rounded-lg hover:bg-amber-500 hover:text-white transition-colors disabled:opacity-50"
          >
            {actionLoading ? "Processing..." : "Cancel Order"}
          </button>
        )}
        {order.status === "paid" && (
          <>
            <button
              onClick={handleRefundOrder}
              disabled={actionLoading}
              className="px-8 py-2.5 border-2 border-blue-500 text-blue-500 font-medium rounded-lg hover:bg-blue-500 hover:text-white transition-colors disabled:opacity-50"
            >
              {actionLoading ? "Processing..." : "Request Refund"}
            </button>
            <button className="px-8 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Invoice
            </button>
          </>
        )}
      </div>
    </section>
  );
}
