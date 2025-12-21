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
import { toast } from "@/components/toast";

import MediaUploader from "./MediaUploader";
import MediaGallery from "./MediaGallery";
import MediaGallerySkeleton from "@/components/skeletons/MediaGallerySkeleton";

export default function MediaTab({ selectedImages = [], setSelectedImages }) {
  const [isLoading, setIsLoading] = useState(false);

  // تابع برای آپلود فایل به سرور
  const uploadFileToServer = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/tours/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        // تغییر این خط: بررسی وجود message در result
        throw new Error(result.message || result.error || "خطا در آپلود عکس");
      }

      return {
        success: true,
        url: result.url,
        filename: result.filename,
      };
    } catch (error) {
      console.error("❌ Upload error:", error);
      throw error;
    }
  };

  const handleFilesUpload = async (files) => {
    if (!files || files.length === 0) return;

    setIsLoading(true);
    const uploadedImages = [];

    try {
      // آپلود هر فایل به سرور
      for (const file of files) {
        try {
          const uploadResult = await uploadFileToServer(file);

          if (uploadResult.success) {
            uploadedImages.push({
              id: crypto.randomUUID(),
              file,
              name: file.name,
              size: file.size,
              preview: uploadResult.url, // ✅ URL واقعی از سرور
              url: uploadResult.url, // ✅ URL واقعی از سرور
              status: "uploaded",
              serverFilename: uploadResult.filename,
            });
          }
        } catch (error) {
          console.error(`❌ Error uploading ${file.name}:`, error);
          toast.error(`خطا در آپلود "${file.name}": ${error.message}`);
        }
      }

      // اضافه کردن عکس‌های آپلود شده
      if (uploadedImages.length > 0) {
        setSelectedImages((prev) => [...prev, ...uploadedImages]);
        toast.success(`${uploadedImages.length} عکس با موفقیت آپلود شد`);
      }
    } catch (error) {
      console.error("❌ Upload process error:", error);
      toast.error("خطا در آپلود عکس‌ها");
    } finally {
      setIsLoading(false);
    }
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
          <MediaUploader onUpload={handleFilesUpload} disabled={isLoading} />
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
