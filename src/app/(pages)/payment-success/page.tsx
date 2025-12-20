import { Footer, Navbar } from "@/src/components/layout";
import React from "react";
import PaymentResult from "./sections/payment.result";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-white">
      <PaymentResult />
    </div>
  );
}
