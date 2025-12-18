"use client";

import { useState } from "react";
import { Image as ImageIcon, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import MediaUploader from "./MediaUploader";
import MediaGallery from "./MediaGallery";
import MediaGallerySkeleton from "@/components/skeletons/MediaGallerySkeleton";

export default function MediaTab({ selectedImages = [], setSelectedImages }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFilesUpload = (files) => {
    if (!files || files.length === 0) return;

    setIsLoading(true);

    // شبیه‌سازی لود (برای UX بهتر)
    setTimeout(() => {
      const newImages = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        preview: URL.createObjectURL(file),
        status: "uploaded",
      }));

      setSelectedImages((prev) => [...prev, ...newImages]);
      setIsLoading(false);
    }, 800); // ⏱️ می‌تونی کم یا زیادش کنی
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => {
      const newImages = [...prev];
      const img = newImages[index];
      if (img?.preview) {
        URL.revokeObjectURL(img.preview);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          گالری عکس‌ها
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          عکس‌های با کیفیت تور را آپلود کنید
          <Info className="h-4 w-4 text-gray-400" />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* uploader */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            آپلود عکس‌های جدید
          </h3>
          <MediaUploader onUpload={handleFilesUpload} />
        </div>

        {/* gallery / skeleton */}
        <div className="pt-6 border-t">
          {isLoading ? (
            <MediaGallerySkeleton items={6} />
          ) : selectedImages.length > 0 ? (
            <MediaGallery
              images={selectedImages}
              onRemove={handleRemoveImage}
            />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
