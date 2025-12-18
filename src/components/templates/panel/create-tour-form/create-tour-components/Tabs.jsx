import { Hash, Image, Tag, Clock, Eye, Globe, List } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function TourTabs() {
  const baseTrigger =
    "flex items-center gap-2 justify-center rounded-md px-3 text-sm font-medium transition-all duration-300 cursor-pointer";

  return (
    <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full bg-muted rounded-xl">
      <TabsTrigger
        value="basic"
        className={cn(
          baseTrigger,
          "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500",
          "data-[state=active]:text-white data-[state=active]:shadow-md",
          "hover:bg-muted-foreground/10"
        )}
      >
        <Hash />
        اطلاعات
      </TabsTrigger>

      <TabsTrigger value="media" className={cn(baseTrigger, triggerActive)}>
        <Image />
        عکس‌ها
      </TabsTrigger>

      <TabsTrigger value="details" className={cn(baseTrigger, triggerActive)}>
        <Tag />
        جزئیات
      </TabsTrigger>

      <TabsTrigger value="schedule" className={cn(baseTrigger, triggerActive)}>
        <Clock />
        برنامه
      </TabsTrigger>

      <TabsTrigger value="settings" className={cn(baseTrigger, triggerActive)}>
        <Eye />
        تنظیمات
      </TabsTrigger>

      <TabsTrigger value="seo" className={cn(baseTrigger, triggerActive)}>
        <Globe />
        SEO
      </TabsTrigger>

      <TabsTrigger value="preview" className={cn(baseTrigger, triggerActive)}>
        <Eye />
        پیش‌نمایش
      </TabsTrigger>
    </TabsList>
  );
}

const triggerActive =
  "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-muted-foreground/10";
