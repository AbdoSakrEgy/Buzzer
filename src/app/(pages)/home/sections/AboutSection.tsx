import Image from "next/image";
import { PrimaryButton, DecorativeLine } from "@/src/components/common";

export default function AboutSection() {
  return (
    <section className="py-16 md:py-24" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Image
              src="/home/sec2 img.png"
              alt="About Buzzer"
              width={600}
              height={500}
              className="rounded-2xl object-cover"
            />
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-400 rounded-2xl -z-10" />
          </div>

          <div>
            <div className="text-lg md:text-2xl text-center font-bold text-gray-900 mb-6">
              Welcome TO Our <br /> Luxury Restaurant
            </div>
            <DecorativeLine />
            <p className="text-gray-600 mb-6 text-center leading-relaxed py-10">
              Welcome to our exquisite salon, where beauty meets expertise. Step
              into a world of luxury and indulgence, where we are dedicated to
              enhancing your natural beauty and leaving you feeling radiant.
            </p>
            <div className="flex justify-center">
              <PrimaryButton fullWidth={false} className="rounded-lg">
                View all
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
