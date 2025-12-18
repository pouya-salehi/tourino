"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export default function MediaGallerySkeleton({
  items = 6, // تعداد عکس‌های اسکلت
}) {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
          <Badge variant="outline">
            <Skeleton className="h-3 w-10" />
          </Badge>
        </Label>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: items }).map((_, index) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden border"
          >
            {/* Image placeholder */}
            <Skeleton className="w-full h-36" />

            {/* Hover actions (fake) */}
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>

            {/* Bottom gradient text */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
