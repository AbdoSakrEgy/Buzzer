import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-[300px] md:h-[500px] flex items-center justify-center">
      <div className="absolute inset-0 z-0 brightness-30">
        <Image
          src="/restaurant/restaurant.png"
          alt="restaurant"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="z-10 w-full flex flex-col justify-center items-center gap-3">
        <div className="text-4xl font-semibold text-white">Products</div>
        <div className="text-xl font-light text-white">Home/Product</div>
      </div>
    </section>
  );
}
