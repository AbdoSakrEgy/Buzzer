import { DecorativeLine } from "@/src/components/common";
import Image from "next/image";

const galleryImages = [
  "/home/gallery1.png",
  "/home/gallery2.png",
  "/home/gallery3.png",
  "/home/gallery4.png",
];

export default function GallerySection() {
  // Triple the array to ensure we have enough width for seamless scrolling on large screens
  // and loop effectively.
  const displayImages = [
    ...galleryImages,
    ...galleryImages,
    ...galleryImages,
    ...galleryImages,
  ];

  return (
    <section className="py-16 md:py-24 overflow-hidden" id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Gallery
          </h2>
          <DecorativeLine />
        </div>
      </div>

      <div className="relative w-full">
        <div className="flex w-max animate-scroll-right">
          {/* We render two sets of the multiplied images for the seamless loop technique */}
          {[...displayImages, ...displayImages].map((image, index) => (
            <div
              key={index}
              className="relative w-72 h-48 sm:w-80 sm:h-56 md:w-96 md:h-64 rounded-2xl overflow-hidden mx-3 group shrink-0"
            >
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
