import {
  UserPen,
  UsersRound,
  Shield,
  MonitorCog,
  Eye,
  Globe,
  CircleAlert,
  List,
} from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function TourTabs({ activeTab, onTabChange, isAdmin }) {
  const baseTrigger =
    "flex items-center gap-2 justify-center rounded-md px-3 text-sm font-medium transition-all duration-300 cursor-pointer";

  return (
    <TabsList className="grid grid-cols-4 lg:grid-cols-5 w-full bg-muted rounded-xl">
      <TabsTrigger
        value="profile"
        className={cn(
          baseTrigger,
          "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500",
          "data-[state=active]:text-white data-[state=active]:shadow-md",
          "hover:bg-muted-foreground/10"
        )}
      >
        <UserPen />
        پروفایل
      </TabsTrigger>

      <TabsTrigger value="media" className={cn(baseTrigger, triggerActive)}>
        <UsersRound />
        کاربران
      </TabsTrigger>

      <TabsTrigger value="details" className={cn(baseTrigger, triggerActive)}>
        <Shield />
        امنیت
      </TabsTrigger>
      <TabsTrigger value="info" className={cn(baseTrigger, triggerActive)}>
        <CircleAlert />
        تکمیل اطلاعات
      </TabsTrigger>

      <TabsTrigger value="schedule" className={cn(baseTrigger, triggerActive)}>
        <MonitorCog />
        تنظیمات کلی
      </TabsTrigger>
    </TabsList>
  );
}

const triggerActive =
  "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-muted-foreground/10";
