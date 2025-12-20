"use client";

import Link from "next/link";
import { XCircle, ShoppingCart, Home, RefreshCw } from "lucide-react";

export default function PaymentResult() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Failed Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-14 h-14 text-red-500" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-2">Your payment was not completed.</p>
        <p className="text-gray-500 text-sm mb-8">
          Don&apos;t worry, no charges were made to your account. Your cart
          items are still saved.
        </p>

        {/* Info Card */}
        <div className="from-gray-50 to-slate-100 border border-gray-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
            <RefreshCw size={20} />
            <span className="font-medium">Want to try again?</span>
          </div>
          <p className="text-gray-500 text-sm">
            You can return to your cart and complete your order anytime.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/cart"
            className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            <ShoppingCart size={20} />
            Return to Cart
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
          Having issues?{" "}
          <Link href="/contact" className="text-amber-500 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </section>
  );
}
