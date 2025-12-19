"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw curved arrow on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Arrow settings
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Draw curved path (top to bottom with curve to right)
    ctx.beginPath();
    ctx.moveTo(0, 115); // Start: top
    ctx.quadraticCurveTo(70, 150, 15, 230); // Curve right, end at bottom-left
    ctx.stroke();

    // Draw arrowhead pointing down-left (follows curve direction)
    ctx.beginPath();
    ctx.moveTo(15, 230); // Connect to curve end point
    ctx.lineTo(15, 220); // Upper arm
    ctx.moveTo(15, 230); // Back to tip
    ctx.lineTo(25, 222); // Lower arm
    ctx.stroke();
  }, []);

  return (
    <section className="relative h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/home/landing.png"
          alt="Delicious Food"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Hero Content - Left Center */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Heading */}
          <div className="relative mb-4">
            {/* half circle with curved arrow canvas */}
            <div className="hidden lg:flex absolute w-50 h-42 top-41 right-20 -z-50 border-40 border-[#393536] rounded-r-full border-l-0 -translate-y-1/2" />
            {/* Canvas for curved arrow */}
            <canvas
              ref={canvasRef}
              className="hidden lg:block absolute -z-40 pointer-events-none"
              style={{
                width: "220px",
                height: "260px",
                top: "-20px",
                right: "-80px",
              }}
              width={200}
              height={250}
            />
            <h1 className="relative text-7xl md:text-9xl font-bold text-white leading-none">
              <div className="hidden lg:flex absolute bottom-2 left-2 -z-40 w-130 h-10 text-2xl font-normal justify-end items-center pr-5 rounded-r-full text-[#9e989a] bg-[#393536]">
                CAN
              </div>
              FOOD
            </h1>
            <h1 className="relative text-7xl md:text-9xl font-bold text-white leading-none">
              <div className="hidden lg:flex absolute bottom-2 left-2 -z-40 w-130 h-10 text-2xl font-normal justify-end items-center pr-5 rounded-r-full text-[#9e989a] bg-[#393536]">
                CHANGE
              </div>
              MOOD
            </h1>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-md">
            Welcome to our exquisite restaurant finder, where taste meets
            convenience. Discover the best dining experiences in your area.
          </p>

          {/* Search bar */}
          <div className="flex items-center bg-linear-to-r from-gray-800 to-gray-600 rounded-full p-1.5 shadow-2xl max-w-lg">
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent text-white placeholder-gray-300 px-6 py-3 outline-none text-lg"
            />
            <button
              className="w-12 h-12 bg-amber-400 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all shrink-0"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
