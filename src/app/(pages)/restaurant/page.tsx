import { Footer, Navbar } from "@/src/components/layout";
import Image from "next/image";
import React from "react";
import HeroSection from "./sections/HeroSection";
import AvilableRestaurants from "./sections/avilable.restaurants";

export default function Restaurant() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AvilableRestaurants />
      <Footer />
    </div>
  );
}
