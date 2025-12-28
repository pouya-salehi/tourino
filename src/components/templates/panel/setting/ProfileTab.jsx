// app/panel/settings/components/ProfileTab.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { toast } from "@/components/toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Upload,
  Camera,
  Save,
  X,
  CheckCircle,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfileTab({ userData, onUpdate, profile }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    bio: userData?.bio || "",
    phone: userData?.phone || "",
    city: userData?.city || "",
  });
  console.log(profile);
  // Handle form input changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("فقط فایل‌های تصویری مجاز هستند");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/users/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "خطا در آپلود عکس");
      }

      toast.success("عکس پروفایل با موفقیت آپلود شد");
      onUpdate(); // Refresh user data
    } catch (error) {
      toast.error(error.message);
      setAvatarPreview(null);
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/users/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "خطا در به‌روزرسانی پروفایل");
      }

      toast.success("پروفایل با موفقیت به‌روزرسانی شد");
      setIsEditing(false);
      onUpdate(); // Refresh user data
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "نامشخص";
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get user initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
      {/* Left Column - Avatar & Basic Info */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-1"
      >
        <Card className="sticky top-24 border-none shadow-xl rounded-4xl">
          <CardContent className="p-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4">
                <Avatar className="h-40 w-40 border-4 border-white shadow-xl">
                  <AvatarImage
                    src={avatarPreview || userData?.avatar}
                    alt={userData?.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-4xl font-bold">
                    {getInitials(userData?.name)}
                  </AvatarFallback>
                </Avatar>

                {/* Upload Button */}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-2 right-2 cursor-pointer"
                >
                  <div className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
                    <Camera className="h-5 w-5 text-gray-700" />
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </label>
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                {userData?.name}
              </h2>
              <p className="text-gray-600 mt-1">@{userData?.slug}</p>

              {/* Role Badge */}
              <Badge
                className={cn(
                  "mt-3 px-3 py-1 text-sm",
                  userData?.role === "ADMIN"
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                    : userData?.role === "OWNER"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                )}
              >
                {userData?.role === "ADMIN" && "مدیر سیستم"}
                {userData?.role === "OWNER" && "صاحب تور"}
                {userData?.role === "USER" && "کاربر عادی"}
              </Badge>
            </div>

            <Separator className="my-6" />

            {/* Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  تاریخ عضویت
                </span>
                <span className="font-medium">
                  {formatDate(userData?.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  وضعیت حساب
                </span>
                <Badge
                  variant={
                    userData?.verifyStatus === "APPROVED"
                      ? "success"
                      : "secondary"
                  }
                >
                  {userData?.verifyStatus === "APPROVED"
                    ? "تأیید شده"
                    : "در انتظار تأیید"}
                </Badge>
              </div>

              {userData?.lastLogin && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    آخرین ورود
                  </span>
                  <span className="font-medium">
                    {formatDate(userData.lastLogin)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Right Column - Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2 space-y-6"
      >
        <Card className="border-none shadow-xl rounded-4xl">
          <CardHeader>
            <div className="flex items-center justify-between ">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  اطلاعات پروفایل
                </CardTitle>
                <CardDescription>
                  اطلاعات شخصی خود را در این بخش مدیریت کنید
                </CardDescription>
              </div>

              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <motion.div
                    key="edit-button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Button onClick={() => setIsEditing(true)}>
                      ویرایش اطلاعات
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cancel-button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-2"
                  >
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                    >
                      <X className="h-4 w-4 ml-2" />
                      لغو
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full ml-2" />
                          در حال ذخیره...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 ml-2" />
                          ذخیره تغییرات
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  نام و نام خانوادگی
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="نام خود را وارد کنید"
                    required
                  />
                ) : (
                  <div className="p-3 rounded-lg bg-gray-50 border">
                    <p className="text-gray-900">
                      {userData?.name || "وارد نشده"}
                    </p>
                  </div>
                )}
              </div>

              {/* Bio Field */}
              <div className="space-y-2">
                <Label htmlFor="bio">بیوگرافی</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="درباره خودتان بنویسید..."
                    rows={4}
                  />
                ) : (
                  <div className="p-3 rounded-lg bg-gray-50 border min-h-[100px]">
                    <p className="text-gray-900 whitespace-pre-line">
                      {userData?.bio || "بیوگرافی وارد نشده است"}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    شماره تماس
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="09XXXXXXXXX"
                    />
                  ) : (
                    <div className="p-3 rounded-lg bg-gray-50 border">
                      <p className="text-gray-900">
                        {userData?.phone || "وارد نشده"}
                      </p>
                    </div>
                  )}
                </div>

                {/* City Field */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    شهر
                  </Label>
                  {isEditing ? (
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder="شهر خود را وارد کنید"
                    />
                  ) : (
                    <div className="p-3 rounded-lg bg-gray-50 border">
                      <p className="text-gray-900">
                        {userData?.city || "وارد نشده"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Email Field (Readonly) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  آدرس ایمیل
                </Label>
                <div className="p-3 rounded-lg bg-gray-50 border">
                  <p className="text-gray-900">
                    {userData?.email || "ایمیل وارد نشده"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    برای تغییر ایمیل به بخش امنیت مراجعه کنید
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Social Links Card */}
        <Card className="border-none shadow-xl rounded-4xl">
          <CardHeader>
            <CardTitle>لینک‌های اجتماعی</CardTitle>
            <CardDescription>
              لینک‌های شبکه‌های اجتماعی خود را اضافه کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  platform: "اینستاگرام",
                  icon: "/images/instagram.png",
                  placeholder: "https://instagram.com/username",
                },
                {
                  platform: "تلگرام",
                  icon: "/images/telegram.png",
                  placeholder: "https://t.me/username",
                },
              ].map((social) => (
                <div key={social.platform} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <img src={social.icon} alt={`${social.platform}.img`} className="h-10" />
                    {social.platform}
                  </Label>
                  <Input
                    placeholder={social.placeholder}
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        {isEditing && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">⚠️ ناحیه خطر</CardTitle>
              <CardDescription className="text-red-600">
                تغییرات خود را قبل از ذخیره بررسی کنید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-red-700 font-medium">تغییرات اعمال نشده</p>
                  <p className="text-red-600 text-sm mt-1">
                    تغییرات شما هنوز ذخیره نشده‌اند. برای ذخیره روی دکمه "ذخیره
                    تغییرات" کلیک کنید.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4 ml-2" />
                  کنسل کردن تغییرات
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
