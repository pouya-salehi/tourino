"use client";

import { useState } from "react";
import {
  Hash,
  Image,
  Tag,
  Clock,
  Eye,
  Globe,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function TourTabs() {
  const baseTrigger =
    "flex items-center gap-2 justify-center rounded-md px-3 text-sm font-medium transition-all duration-300 cursor-pointer";

  const triggerActive =
    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-muted-foreground/10";

  const TABS_PER_VIEW = 3;
  const TOTAL_TABS = 7;
  const [index, setIndex] = useState(0);
  const maxIndex = TOTAL_TABS - TABS_PER_VIEW;

  /* ===================== DESKTOP (UNTUCHED) ===================== */
  const DesktopTabs = () => (
    <TabsList className="hidden lg:grid grid-cols-7 w-full bg-muted rounded-xl">
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

  /* ===================== MOBILE (SLIDER) ===================== */
  const MobileTabs = () => (
    <div className="md:hidden w-full">
      {/* arrows */}
      <div className="flex justify-between mb-2">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="p-1 disabled:opacity-30 bg-black/50 rounded-full"
        >
          <ChevronsLeft />
        </button>

        <button
          onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
          disabled={index === maxIndex}
          className="p-1 disabled:opacity-30 bg-black/50 rounded-full"
        >
          <ChevronsRight />
        </button>
      </div>

      <div className="overflow-hidden">
        <motion.div
          animate={{ x: `-${index * 33.333}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className="flex w-[233%]"
        >
          <TabsList className="grid grid-cols-7 w-full bg-muted rounded-xl">
            <TabsTrigger
              value="basic"
              className={cn(baseTrigger, triggerActive)}
            >
              <Hash />
              اطلاعات
            </TabsTrigger>

            <TabsTrigger
              value="media"
              className={cn(baseTrigger, triggerActive)}
            >
              <Image />
              عکس‌ها
            </TabsTrigger>

            <TabsTrigger
              value="details"
              className={cn(baseTrigger, triggerActive)}
            >
              <Tag />
              جزئیات
            </TabsTrigger>

            <TabsTrigger
              value="schedule"
              className={cn(baseTrigger, triggerActive)}
            >
              <Clock />
              برنامه
            </TabsTrigger>

            <TabsTrigger
              value="settings"
              className={cn(baseTrigger, triggerActive)}
            >
              <Eye />
              تنظیمات
            </TabsTrigger>

            <TabsTrigger value="seo" className={cn(baseTrigger, triggerActive)}>
              <Globe />
              SEO
            </TabsTrigger>

            <TabsTrigger
              value="preview"
              className={cn(baseTrigger, triggerActive)}
            >
              <Eye />
              پیش‌نمایش
            </TabsTrigger>
          </TabsList>
        </motion.div>
      </div>
    </div>
  );

  return (
    <>
      <DesktopTabs />
      <MobileTabs />
    </>
  );
}
