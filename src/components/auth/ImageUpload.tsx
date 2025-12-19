"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, X, Loader2 } from "lucide-react";
import { authApi, UserType } from "@/src/services/auth.api";

interface ImageUploadProps {
  image: File | null;
  onImageChange: (image: File | null, imageKey: string | null) => void;
  userType: UserType;
  onUploadError?: (error: string) => void;
}

/**
 * ImageUpload - Component for uploading profile picture
 * Uploads to API based on user type, only 1 image allowed
 */
export function ImageUpload({
  image,
  onImageChange,
  userType,
  onUploadError,
}: ImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = React.useState<string | null>(
    null
  );

  // Use uploaded imageKey for tracking (local preview comes from file)
  const previewUrl = localPreviewUrl;

  // Create preview URL when image changes
  React.useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setLocalPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLocalPreviewUrl(null);
    }
  }, [image]);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setIsUploading(true);

      try {
        // Upload to API
        const result = await authApi.uploadProfileImage(userType, file);

        if (result.success) {
          onImageChange(file, result.imageKey || null);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        onUploadError?.(errorMessage);
        console.error("Upload error:", errorMessage);
      } finally {
        setIsUploading(false);
      }
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null, null);
  };

  return (
    <div className="w-full">
      <p className="text-sm text-gray-600 mb-3">Attach Your Display Picture</p>
      <div className="flex gap-4 flex-wrap">
        {/* Add Image Button - show when no image */}
        {!image && !isUploading && (
          <button
            type="button"
            onClick={handleAddClick}
            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-amber-400 hover:bg-amber-50 transition-all duration-200"
          >
            <Plus className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Add Image</span>
          </button>
        )}

        {/* Loading State */}
        {isUploading && (
          <div className="w-24 h-24 border-2 border-amber-400 rounded-lg flex flex-col items-center justify-center gap-1 bg-amber-50">
            <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
            <span className="text-xs text-amber-500">Uploading...</span>
          </div>
        )}

        {/* Image Preview */}
        {image && previewUrl && !isUploading && (
          <div className="relative w-24 h-24">
            <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden">
              <Image
                src={previewUrl}
                alt="Profile picture"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <X className="w-3 h-3 text-white" />
            </button>
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
