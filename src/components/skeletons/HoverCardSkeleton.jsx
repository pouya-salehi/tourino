// components/HoverCardSkeleton.jsx
"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileCardSkeleton from "./ProfileCardSkeleton";
function HoverCardSkeleton() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {/* کامپوننت اصلی */}
        <div className="cursor-pointer">
          <ProfileCardSkeleton />
        </div>
      </HoverCardTrigger>

      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-4 flex-1">
            {/* آمارها */}
            <div className="flex justify-between space-x-4 items-center h-10">
              {/* تعداد تورها */}
              <div className="text-center flex-1">
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>

              <Separator orientation="vertical" />

              {/* تعداد دنبال‌کنندگان */}
              <div className="text-center flex-1">
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            </div>

            {/* دکمه */}
            <Skeleton className="h-9 w-full mt-2" />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default HoverCardSkeleton;
