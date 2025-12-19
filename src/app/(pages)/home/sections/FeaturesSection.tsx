import { DecorativeLine } from "@/src/components/common";
import Image from "next/image";

const features = [
  {
    icon: "/home/f1.jpeg",
    title: "Special Menu",
    description:
      "We serve the freshest food prepared daily with quality ingredients.",
  },
  {
    icon: "/home/f2.jpeg",
    title: "Tasty Food",
    description: "Quick and reliable delivery to your doorstep within minutes.",
  },
  {
    icon: "/home/f3.jpeg",
    title: "Free Wi-Fi",
    description: "Simple and intuitive ordering process with just a few taps.",
  },
  {
    icon: "/home/f4.jpeg",
    title: "Special Offer",
    description: "Premium quality food from the best restaurants in town.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <DecorativeLine />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center transition-all">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
