import Image from "next/image";
import { MapPin, Star } from "lucide-react";

interface RestaurantCardProps {
  id: number;
  fullName: string;
  imageUrl?: string;
  hasPublicId: boolean;
  category: "Restaurant" | "Cafe" | string;
  city: string;
  isActive: boolean;
  className?: string; // for custom sizing if needed
}

export default function RestaurantCard({
  id,
  fullName,
  imageUrl,
  hasPublicId,
  category,
  city,
  isActive,
  className = "w-70",
}: RestaurantCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group ${className}`}
    >
      {/* Image Placeholder */}
      <div className="relative h-64 bg-linear-to-br from-white to-white flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={fullName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-b-[80%]"
          />
        ) : hasPublicId ? (
          <div className="animate-pulse w-full h-full bg-white" />
        ) : (
          <div className="text-center">
            {/* Fallback Icon logic could be here if we want to pass icons, 
                but keeping it simple: if no image, just show text or blank 
                since parent handled Store/Coffee icons specifically. 
                For generic card, we might want to handle it or expect parent to ensure image.
                Let's use a generic placeholder or keep content simple. 
            */}
            <p className="text-amber-700 font-medium text-sm">No Image</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex items-center justify-center px-5 pt-5">
        <div className="flex items-center gap-0.5">
          {/* 4 Yellow Stars */}
          {[1, 2, 3, 4].map((i) => (
            <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
          ))}
          {/* 1 Gray Star */}
          <Star size={16} className="text-gray-300 fill-gray-300" />
        </div>
        {/* <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isActive ? "Open" : "Closed"}
        </span> */}
      </div>
      <div className="p-5 flex flex-col justify-center items-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{fullName}</h3>
        <h3 className="font-semibold text-sm text-red-500 mb-2">{category}</h3>
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
          <MapPin size={16} className="text-amber-500" />
          <span>{city}</span>
        </div>
      </div>
    </div>
  );
}
