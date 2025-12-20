import { Footer, Navbar } from "@/src/components/layout";
import HeroSection from "./sections/HeroSection";
import AvilableProducts from "./sections/avilable.products";

export default function Products() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AvilableProducts />
      <Footer />
    </div>
  );
}
