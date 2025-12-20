import { Footer, Navbar } from "@/src/components/layout";
import React from "react";
import HeroSection from "./sections/HeroSection";
import OrdersView from "./sections/orders.view";

export default function OrdersHistory() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <OrdersView />
      <Footer />
    </div>
  );
}
