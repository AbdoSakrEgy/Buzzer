import { Footer, Navbar } from "@/src/components/layout";
import HeroSection from "./sections/HeroSection";
import RateCard from "./sections/rate.card";
import ProductView from "./sections/product.view";

// ProductDetails.tsx (Server Component)
export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <RateCard productId={id} />
      <ProductView productId={id} />
      <Footer />
    </div>
  );
}
