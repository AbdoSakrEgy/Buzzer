import Image from "next/image";
import { Star } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  imageUrl?: string;
  price: string;
  description: string;
  sourceType: string;
  sourceName: string;
  className?: string;
  // keeping some optional props for compatibility if needed, but simplifying for product
}

export default function ProductCard({
  name,
  imageUrl,
  price,
  sourceType,
  sourceName,
  className = "w-70",
}: ProductCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group ${className}`}
    >
      {/* Image Placeholder */}
      <div className="relative h-64 bg-linear-to-br from-white to-white flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-b-[80%]"
          />
        ) : (
          <div className="text-center">
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
      </div>
      <div className="p-5 flex flex-col justify-center items-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{name}</h3>
        <div className="text-sm text-gray-500 mb-1">
          {sourceName}
        </div>
        <div className="text-red-300 mb-3 uppercase tracking-wider text-xs">
          {sourceType}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3 font-bold text-amber-600 text-lg">
          ${price}
        </div>
      </div>
    </div>
  );
}
