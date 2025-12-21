"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import TourTabs from "./create-tour-components/Tabs";
import BasicTab from "./create-tour-components/BasicTab";
import MediaTab from "./create-tour-components/MediaTab";
import DetailsTab from "./create-tour-components/DetailsTab";
import ScheduleTab from "./create-tour-components/ScheduleTab";
import SettingsTab from "./create-tour-components/SettingTab";
import SeoTab from "./create-tour-components/SeoTab";
import PreviewTab from "./create-tour-components/PreviewTab";

export default function CreateTourForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedImages, setSelectedImages] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [formData, setFormData] = useState({
    title: "",
    ownerSlug: "",
    description: "",
    price: "",
    maxPeople: "",
    location: "",
    features: [],
    includes: [],
    excludes: [],
    schedule: [{ day: 1, title: "", description: "" }],
    faqs: [],
    enableComments: true,
    showLikes: true,
    showRating: true,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
    seoSlug: "",
  });

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // برای اضافه کردن آیتم‌های آرایه‌ای
  const addArrayItem = (field, defaultValue = "") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], defaultValue],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title.trim()) errors.push("عنوان تور الزامی است");
    if (!formData.ownerSlug) errors.push("برگزارکننده الزامی است");
    if (!formData.description.trim() || formData.description.length < 10)
      errors.push("توضیحات باید حداقل ۱۰ کاراکتر باشد");
    if (!formData.price || Number(formData.price) <= 0)
      errors.push("قیمت معتبر وارد کنید");
    if (!formData.location.trim()) errors.push("مکان برگزاری الزامی است");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length) {
      errors.forEach((e) => toast.error(e));
      setActiveTab("basic");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        maxPeople: formData.maxPeople ? Number(formData.maxPeople) : null,
        // فقط URLهای معتبر (http://, https://, /uploads/)
        images: selectedImages
          .map((img) => img.url || img.preview)
          .filter(
            (url) =>
              url &&
              (url.startsWith("http://") ||
                url.startsWith("https://") ||
                url.startsWith("/uploads/") ||
                url.startsWith("data:image/"))
          ),
        startDate: startDate?.toISOString() || null,
        endDate: endDate?.toISOString() || null,
        schedule: formData.schedule
          .filter((day) => day.title.trim() || day.description.trim())
          .map((day, index) => ({
            day: index + 1,
            title: day.title.trim(),
            description: day.description.trim(),
          })),
      };

      console.log("📦 Submitting payload:", payload);

      const res = await fetch("/api/tours/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "خطا در ایجاد تور");
      }

      toast.success("✅ تور با موفقیت ایجاد شد");

      // تأخیر قبل از ریدایرکت
      setTimeout(() => {
        router.push("/tours");
      }, 1500);
    } catch (err) {
      console.error("❌ Submit error:", err);
      toast.error(err.message || "خطا در ایجاد تور");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.title && !formData.seoSlug) {
      handleChange(
        "seoSlug",
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
      );
    }
  }, [formData.title]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TourTabs />

        <TabsContent value="basic">
          <BasicTab
            formData={formData}
            handleChange={handleChange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </TabsContent>

        <TabsContent value="media">
          <MediaTab
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />
        </TabsContent>

        <TabsContent value="details">
          <DetailsTab
            formData={formData}
            handleChange={handleChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleTab
            formData={formData}
            handleChange={handleChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab formData={formData} handleChange={handleChange} />
        </TabsContent>

        <TabsContent value="seo">
          <SeoTab formData={formData} handleChange={handleChange} />
        </TabsContent>

        <TabsContent value="preview">
          <PreviewTab formData={formData} />
        </TabsContent>
      </Tabs>

      {/* دکمه‌های اقدام */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {selectedImages.length > 0 && `📸 ${selectedImages.length} عکس`}
          </p>
          <p className="text-xs text-gray-500">
            قبل از ارسال تمام اطلاعات را بررسی کنید
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            بازگشت
          </Button>

          <Button type="submit" disabled={loading} className="min-w-[120px]">
            {loading ? (
              <>
                <span className="animate-pulse">⏳</span>
                <span className="mr-2">در حال ایجاد...</span>
              </>
            ) : (
              "ایجاد تور"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
