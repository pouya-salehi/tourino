// components/ProfileCardSkeleton.jsx
"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ProfileCardSkeleton() {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 shadow-sm dark:bg-transparent animate-pulse">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3 relative">
          {/* آواتار */}
          <Skeleton className="w-16 h-16 rounded-full" />

          {/* اطلاعات */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <div className="space-y-2 w-full">
                {/* slug */}
                <Skeleton className="h-4 w-24" />
                {/* name */}
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>

          {/* Badge (verify status) */}
          <Skeleton className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* دکمه */}
        <Skeleton className="h-9 w-full rounded-sm" />
      </CardContent>

      <CardFooter className="pb-4">
        {/* لینک مشاهده پروفایل */}
        <Skeleton className="h-5 w-32 mx-auto rounded-sm" />
      </CardFooter>
    </Card>
  );
}

export default ProfileCardSkeleton;
