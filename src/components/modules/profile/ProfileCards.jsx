"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserRound,
  ShieldX,
  ShieldCheck,
  Users,
  CalendarDays,
  Tent,
  Settings,
  ExternalLink,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
function ProfileCards({ user, tour }) {
  console.log(user);

  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const isSelf = user.isCurrentUser; // ✅ بررسی می‌کند که کاربر خودش است یا نه
  const followHandler = async () => {
    if (isSelf) return; // اگر خودش است، کاری نکند

    try {
      const response = await fetch(`/api/users/${user.id}/follow`, {
        method: "POST",
      });
      const result = await response.json();

      if (result.success) {
        setIsFollowing(result.following);
      }
    } catch (error) {
      console.error("Error following:", error);
    }
  };

  const goToDashboard = () => {
    router.push(`/${user.slug}/panel`);
  };

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "US";

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 shadow-sm dark:bg-transparent">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3 relative">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="">
                    <h3 className="font-semibold truncate">{user.slug}</h3>
                    <h3 className="font-light text-sm text-gray-500 truncate">
                      {user.name}
                    </h3>
                  </div>
                  {user.verifyStatus === "PENDING" ? (
                    <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white p-2 rounded-full border-2 border-white shadow-lg">
                      <ShieldX className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full border-2 border-white shadow-lg">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex items-center gap-1">
            {isSelf ? (
              <Button
                onClick={goToDashboard}
                variant="default"
                className="w-full rounded-md"
              >
                <Settings className="w-4 h-4 ml-2" />
                داشبورد
              </Button>
            ) : (
              <Button
                onClick={followHandler}
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                className="w-full"
              >
                {isFollowing ? "دنبال می‌کنید" : "دنبال کردن"}
              </Button>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="rounded-md">
                  <Link
                    href={`/${user.slug}`}
                    className="text-sm text-white w-full text-center block items-center justify-center gap-1"
                  >
                    <UserRound />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>برو به صفحه اصلی</p>
              </TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>
      </HoverCardTrigger>

      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-2 flex-1">
            {/* آمارها */}
            <div className="flex justify-between space-x-4 items-center h-10">
              <div className="text-center">
                <div className="font-bold">{tour?.length || 0}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Tent className="w-3 h-3" />
                  تور
                </div>
              </div>
              <Separator orientation="vertical" />
              <div className="text-center">
                <div className="font-bold">{user.stats?.followers || 0}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  دنبال‌کننده
                </div>
              </div>
            </div>

            {isSelf ? (
              <Button
                onClick={goToDashboard}
                variant="default"
                size="sm"
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
              >
                <Settings className="w-4 h-4 ml-2" />
                رفتن به داشبورد
              </Button>
            ) : (
              <Button
                onClick={followHandler}
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                className="w-full mt-2"
              >
                {isFollowing ? "لغو دنبال کردن" : "دنبال کردن"}
              </Button>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default ProfileCards;
