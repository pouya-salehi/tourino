// components/skeletons/TourCardSkeleton.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TourCardSkeleton() {
  return (
    <Card className="group relative h-[400px] overflow-hidden rounded-2xl shadow-xl bg-gradient-to-b from-gray-50 to-white">
      {/* Image Skeleton */}
      <Skeleton className="absolute inset-0 w-full h-full" />

      {/* Overlay Gradient */}

      {/* Avatar Skeleton - Top Right */}
      <div className="absolute top-0 right-0 p-4 flex items-center gap-2">
        <Skeleton className="h-4 w-20 rounded-full" />
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>

      {/* Content Skeleton - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4 mb-3" />

        {/* Info Icons Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Price & Button Skeleton */}
        <div className="flex items-center justify-between mt-6">
          <Skeleton className="h-6 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </Card>
  );
}
