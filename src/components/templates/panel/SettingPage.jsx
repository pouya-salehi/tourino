// app/panel/settings/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "@/components/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Settings,
  User,
  Users,
  Shield,
  Bell,
  Globe,
  Lock,
  AlertCircle,
} from "lucide-react";

// Import Tabs
import SettingsTabs from "./setting/SettingTabs";
import ProfileTab from "./setting/ProfileTab";
// import UsersTab from "./components/UsersTab";
// import SystemTab from "./components/SystemTab";
// import SecurityTab from "./components/SecurityTab";
// import NotificationsTab from "./components/NotificationsTab";
export default function SettingsPage() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  console.log(user);
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [tours, setTours] = useState([]);
  const [error, setError] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  useEffect(() => {
    async function fetchProfile() {
      try {
        setProfileLoading(true);
        setError(null);

        const response = await fetch(`/api/users/me`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("خطا در دریافت اطلاعات");
        }

        const data = await response.json();

        setProfile(data.user);
        setTours(data.tours || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setProfileLoading(false);
      }
    }

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (profileLoading) {
    return <SettingsSkeleton />;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 px-6">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">تنظیمات پنل</h1>
                <p className="text-sm text-gray-500">
                  مدیریت حساب کاربری و سیستم
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <SettingsTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isAdmin={isAdmin}
          />

          <TabsContent value="profile">
            <ProfileTab userData={user} profile={profile} />
          </TabsContent>

          {isAdmin && <TabsContent value="users">{/* UsersTab */}</TabsContent>}
        </Tabs>
      </div>
    </div>
  );
}

// Skeleton Loader
function SettingsSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-lg" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-140 rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
