// components/skeletons/ProfileSkeleton.jsx
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TourCardSkeleton from "./TourCardSkeleton";

export default function ProfileSkeleton() {
  return (
    <div className="mt-10">
      <div className="mx-auto px-4 lg:px-8 ">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center gap-2 mb-12 ">
          {/* Avatar */}
          <Skeleton className="w-40 h-40 rounded-full bg-gradient-to-b from-gray-50 to-white" />

          {/* Info */}
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-64 bg-gradient-to-b from-gray-50 to-white" />
            <Skeleton className="h-4 w-48 bg-gradient-to-b from-gray-50 to-white" />
            <Skeleton className="h-4 w-64 bg-gradient-to-b from-gray-50 to-white" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-10 w-22 rounded-lg bg-gradient-to-b from-gray-50 to-white" />
              <Skeleton className="h-10 w-22 rounded-lg bg-gradient-to-b from-gray-50 to-white" />
              <Skeleton className="h-10 w-22 rounded-lg bg-gradient-to-b from-gray-50 to-white" />
            </div>
          </div>
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div> */}

        {/* Tours Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48 bg-gradient-to-b from-gray-50 to-white" />
            <Skeleton className="h-10 w-32 rounded-lg bg-gradient-to-b from-gray-50 to-white" />
          </div>

          {/* Tour Cards Grid - grid-cols-4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <TourCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Loading More Indicator */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <Skeleton className="h-4 w-32 mx-auto mt-2" />
        </div>
      </div>
    </div>
  );
}
