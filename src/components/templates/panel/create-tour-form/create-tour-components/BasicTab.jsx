"use client";

import { Calendar, Users, MapPin, DollarSign, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import OwnerSearch from "./OwnerSearch";
import { formatPriceForUI } from "@/app/helper/price";
export default function BasicTab({
  formData,
  handleChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  // تابع برای مدیریت مالک‌های انتخاب شده
  const handleOwnersChange = (ownerSlugs) => {
    console.log("✅ Selected owners:", ownerSlugs);

    // برای تک انتخابی، اولین رو بگیر
    if (ownerSlugs.length > 0) {
      handleChange("ownerSlug", ownerSlugs[0]);
    } else {
      handleChange("ownerSlug", "");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          اطلاعات اصلی تور
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* عنوان تور */}
          <div className="space-y-3">
            <Label htmlFor="title">عنوان تور *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="مثال: تور کویر مرنجاب"
              required
            />
            <p className="text-xs text-gray-500">
              عنوان جذاب و کلمات کلیدی را استفاده کنید
            </p>
          </div>

          {/* OwnerSearch */}
          <div className="space-y-3">
            <OwnerSearch
              value={formData.ownerSlug ? [formData.ownerSlug] : []}
              onChange={handleOwnersChange}
              maxSelect={1} // تک انتخابی
              placeholder="جستجوی برگزارکننده..."
              required
            />
          </div>

          {/* مکان برگزاری */}
          <div className="space-y-3">
            <Label htmlFor="location">
              <MapPin className="inline h-4 w-4 mr-1" />
              مکان برگزاری *
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="مثال: کویر مرنجاب، کاشان"
              required
            />
          </div>

          {/* قیمت و نفرات */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="price">
                <DollarSign className="inline h-4 w-4 mr-1" />
                قیمت (تومان) *
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="مثال: 1500000"
                required
              />
              {formData.price && (
                <div className="text-sm text-gray-600 space-y-1">
                  <p>💰 {formatPriceForUI(formData.price)?.numeric}</p>
                  <p className="text-xs text-gray-500">
                    {formatPriceForUI(formData.price)?.words}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="maxPeople">
                <Users className="inline h-4 w-4 mr-1" />
                حداکثر نفرات
              </Label>
              <Input
                id="maxPeople"
                type="number"
                min="1"
                value={formData.maxPeople}
                onChange={(e) => handleChange("maxPeople", e.target.value)}
                placeholder="مثال: 20"
              />
            </div>
          </div>
        </div>

        {/* توضیحات */}
        <div className="space-y-3">
          <Label htmlFor="description">توضیحات تور *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="تور خود را با جزئیات کامل شرح دهید..."
            rows={8}
            required
            className="min-h-[200px] resize-none"
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              حداقل ۳۰۰ کاراکتر برای سئو بهتر
            </p>
            <span
              className={`text-xs ${
                formData.description.length < 300
                  ? "text-amber-600"
                  : "text-green-600"
              }`}
            >
              {formData.description.length} کاراکتر
            </span>
          </div>
        </div>

        {/* تاریخ‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label>تاریخ شروع</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-right font-normal"
                >
                  <Calendar className="ml-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP", { locale: faIR })
                  ) : (
                    <span>انتخاب تاریخ</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  locale={faIR}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            <Label>تاریخ پایان</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-right font-normal"
                >
                  <Calendar className="ml-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, "PPP", { locale: faIR })
                  ) : (
                    <span>انتخاب تاریخ</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  locale={faIR}
                  disabled={(date) => date < (startDate || new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
