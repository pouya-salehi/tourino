"use client";

import { useState } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Hash,
  Users,
  MessageCircle,
  Info,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const tabs = [
  { value: "info", label: "اطلاعات", icon: Info },
  { value: "details", label: "جزئیات", icon: Hash },
  { value: "comments", label: "کامنت‌ها", icon: MessageCircle },
  { value: "participants", label: "شرکت‌کنندگان", icon: Users },
];

export default function TourModalDetailTabs() {
  const TABS_PER_VIEW = 2;
  const TOTAL_TABS = tabs.length;

  const [index, setIndex] = useState(0);
  const maxIndex = TOTAL_TABS - TABS_PER_VIEW;

  const triggerClass = cn(
    "flex items-center gap-2 rounded-lg px-4 text-sm font-medium transition-all cursor-pointer",
    "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500",
    "data-[state=active]:text-white data-[state=active]:shadow-lg dark:text-white"
  );

  /* ===================== DESKTOP (UNCHANGED) ===================== */
  const DesktopTabs = () => (
    <TabsList className="hidden md:grid grid-cols-4 gap-2 bg-muted/50 rounded-xl w-full mb-6 dark:bg-transparent">
      {tabs.map(({ value, label, icon: Icon }) => (
        <TabsTrigger key={value} value={value} className={triggerClass}>
          <Icon className="h-4 w-4" />
          {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );

  /* ===================== MOBILE (SLIDER) ===================== */
  const MobileTabs = () => (
    <div className="md:hidden w-full mb-6">
      {/* arrows */}
      <div className="flex justify-between mb-2">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="p-1 disabled:opacity-30"
        >
          <ChevronsLeft />
        </button>

        <button
          onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
          disabled={index === maxIndex}
          className="p-1 disabled:opacity-30"
        >
          <ChevronsRight />
        </button>
      </div>

      <div className="overflow-hidden">
        <motion.div
          animate={{ x: `-${index * 50}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className="flex w-[200%]"
        >
          <TabsList className="grid grid-cols-4 gap-2 bg-muted/50 rounded-xl w-full dark:bg-transparent">
            {tabs.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className={triggerClass}>
                <Icon className="h-4 w-4" />
                {label}
              </TabsTrigger>
            ))}
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
