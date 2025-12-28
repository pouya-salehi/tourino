"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hash, Users, MessageCircle, Send, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { value: "send", label: "ارسال", icon: Send },
  { value: "receive", label: "صندوق دریافتی ها", icon: Inbox },
];
function MessageTabs() {
  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-2 gap-2 bg-muted/50 rounded-xl w-full mb-6 dark:bg-transparent">
      {tabs.map(({ value, label, icon: Icon }) => (
        <TabsTrigger
          key={value}
          value={value}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 text-sm font-medium transition-all cursor-pointer",
            "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500",
            "data-[state=active]:text-white data-[state=active]:shadow-lg dark:text-white"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

export default MessageTabs;
