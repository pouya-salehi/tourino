"use client";

import { Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function MediaGallery({ images = [], onRemove }) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          عکس‌های آپلود شده
          <Badge variant="outline">{images.length} عکس</Badge>
        </Label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((img, index) => (
          <div
            key={img.id || index}
            className="relative group rounded-lg overflow-hidden border"
          >
            <div className="w-full h-36 relative overflow-hidden">
              <Image
                src={img.preview}
                alt={img.name || `عکس ${index + 1}`}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onRemove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
              <p className="text-xs text-white truncate">
                {img.name || `عکس ${index + 1}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
