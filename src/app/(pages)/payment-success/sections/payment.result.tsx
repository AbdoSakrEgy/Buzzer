"use client";

import Link from "next/link";
import { CheckCircle, ShoppingBag, Home, Receipt } from "lucide-react";

export default function PaymentResult() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
        </div>

        {/* Thank You Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 mb-2">
          Your payment was successful and your order has been placed.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          You will receive a confirmation email shortly with your order details.
        </p>

        {/* Order Info Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-2 text-amber-600 mb-2">
            <Receipt size={20} />
            <span className="font-medium">Order Confirmed</span>
          </div>
          <p className="text-gray-600 text-sm">
            Your delicious food is being prepared and will be on its way soon!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/orders-history"
            className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            <ShoppingBag size={20} />
            View My Orders
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
          >
            <Home size={20} />
            Back to Home
          </Link>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-gray-400 text-sm">
          Need help?{" "}
          <Link href="/contact" className="text-amber-500 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </section>
  );
}
