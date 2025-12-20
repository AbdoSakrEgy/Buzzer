"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/src/context";
import { useAuthFetch } from "@/src/hooks";
import { API_BASE_URL } from "@/src/lib/config";

interface Order {
  id: number;
  customer_id: number;
  totalAmount: string;
  status: "pending" | "paid" | "cancelled" | "refunded";
  payment_id: number | null;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    label: "Pending",
  },
  paid: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    label: "Paid",
  },
  cancelled: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Cancelled",
  },
  refunded: {
    icon: AlertCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Refunded",
  },
};

export default function OrdersView() {
  const { token, isAuthenticated } = useAuth();
  const authFetch = useAuthFetch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(isAuthenticated && !!token);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const controller = new AbortController();

    authFetch(`${API_BASE_URL}/order/get-orders`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.data?.orders || []);
        console.log({ data });
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch orders", err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [isAuthenticated, token, authFetch]);

  if (!isAuthenticated) {
    return (
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Please login to view your orders
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
        <p className="text-gray-500">Loading orders...</p>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="py-16 text-center">
        <div className="mb-6">
          <Package className="w-16 h-16 text-gray-300 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">
          Start shopping to see your orders here
        </p>
        <Link
          href="/products"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusConfig[order.status] || statusConfig.pending;
          const StatusIcon = status.icon;

          return (
            <Link
              key={order.id}
              href={`/orders-history/order-details/${order.id}`}
              className={`block bg-white border ${status.borderColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Order Info */}
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${status.bgColor}`}>
                    <StatusIcon className={`w-6 h-6 ${status.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Customer ID: {order.customer_id}
                    </p>
                    {order.payment_id && (
                      <p className="text-gray-400 text-xs mt-1">
                        Payment ID: {order.payment_id}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status & Total */}
                <div className="flex flex-col sm:items-end gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}
                  >
                    <StatusIcon className="w-4 h-4" />
                    {status.label}
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    SAR {parseFloat(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
