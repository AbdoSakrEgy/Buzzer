import { Footer, Navbar } from "@/src/components/layout";
import HeroSection from "./sections/HeroSection";
import CartView from "./sections/cart.view";

export default function Products() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <CartView />
      <Footer />
    </div>
  );
}
