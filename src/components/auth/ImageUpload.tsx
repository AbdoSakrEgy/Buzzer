"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

/**
 * ImageUpload - Component for uploading display pictures
 * Supports adding and removing images with preview
 */
export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 2,
}: ImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = [...images];
      for (let i = 0; i < files.length && newImages.length < maxImages; i++) {
        newImages.push(files[i]);
      }
      onImagesChange(newImages);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="w-full">
      <p className="text-sm text-gray-600 mb-3">Attach Your Display Picture</p>
      <div className="flex gap-4 flex-wrap">
        {/* Add Image Button */}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={handleAddClick}
            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-amber-400 hover:bg-amber-50 transition-all duration-200"
          >
            <Plus className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Add Image</span>
          </button>
        )}

        {/* Image Previews */}
        {images.map((image, index) => (
          <div key={index} className="relative w-24 h-24">
            <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden">
              <Image
                src={URL.createObjectURL(image)}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}

        {/* Placeholder for second image slot */}
        {images.length === 1 && (
          <div className="w-24 h-24 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
            <ImageIcon className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default ImageUpload;
