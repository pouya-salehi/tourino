// components/modules/tour/TourSidebar.jsx
"use client";

import { useState } from "react";
import { Filter, X, Calendar, DollarSign, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function TourSidebar({
  tour,
  filters,
  onFilterChange,
  className,
}) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories = [
    "همه",
    "طبیعت گردی",
    "تاریخی",
    "ماجراجویی",
    "دریایی",
    "کوهنوردی",
    "شهری",
  ];

  const handlePriceChange = (value) => {
    onFilterChange({ ...filters, priceRange: value });
  };

  const handleDateChange = (e) => {
    onFilterChange({ ...filters, date: e.target.value });
  };

  const handleLocationChange = (e) => {
    onFilterChange({ ...filters, location: e.target.value });
  };

  const handleCategoryChange = (value) => {
    onFilterChange({ ...filters, category: value });
  };

  const handleSortChange = (value) => {
    onFilterChange({ ...filters, sortBy: value });
  };

  const resetFilters = () => {
    onFilterChange({
      category: "all",
      priceRange: [0, 10000000],
      date: null,
      location: "",
      sortBy: "newest",
    });
  };

  return (
    <>
      {/* دکمه فیلتر موبایل */}
      <Button
        variant="outline"
        className="lg:hidden flex items-center gap-2 mb-4 w-full"
        onClick={() => setIsMobileFilterOpen(true)}
      >
        <Filter className="w-4 h-4" />
        فیلترها
      </Button>

      {/* سایدبار اصلی */}
      <aside
        className={`${className} ${
          isMobileFilterOpen
            ? "fixed inset-0 z-50 bg-white p-4 overflow-y-auto lg:static lg:bg-transparent"
            : "hidden lg:block"
        }`}
      >
        {isMobileFilterOpen && (
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <h3 className="text-lg font-bold">فیلترها</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {/* اطلاعات مالک */}
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <h4 className="font-bold text-gray-800 mb-3">اطلاعات مجموعه</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">
                    {tour.owner?.name?.charAt(0) || "?"}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">{tour.owner?.name}</div>
                  <div className="text-sm text-gray-500">صاحب مجموعه</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {tour.totalTours || 0} تور فعال
              </div>
            </div>
          </div>

          {/* دسته‌بندی */}
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <h4 className="font-bold text-gray-800 mb-3">دسته‌بندی</h4>
            <Select
              value={filters.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب دسته" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat === "همه" ? "all" : cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* محدوده قیمت */}
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-green-600" />
              <h4 className="font-bold text-gray-800">محدوده قیمت</h4>
            </div>
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              max={10000000}
              step={100000}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{filters.priceRange[0].toLocaleString()} تومان</span>
              <span>{filters.priceRange[1].toLocaleString()} تومان</span>
            </div>
          </div>

          {/* تاریخ */}
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-gray-800">تاریخ شروع</h4>
            </div>
            <Input
              type="date"
              value={filters.date || ""}
              onChange={handleDateChange}
              className="w-full"
            />
          </div>

          {/* مکان */}
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-red-600" />
              <h4 className="font-bold text-gray-800">مکان</h4>
            </div>
            <Input
              type="text"
              placeholder="جستجوی مکان..."
              value={filters.location}
              onChange={handleLocationChange}
              className="w-full"
            />
          </div>

          {/* مرتب‌سازی */}
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <h4 className="font-bold text-gray-800 mb-3">مرتب‌سازی</h4>
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="مرتب‌سازی بر اساس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">جدیدترین</SelectItem>
                <SelectItem value="price-low">ارزان‌ترین</SelectItem>
                <SelectItem value="price-high">گران‌ترین</SelectItem>
                <SelectItem value="popular">محبوب‌ترین</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* دکمه‌های اکشن */}
          <div className="flex gap-3">
            <Button onClick={resetFilters} variant="outline" className="flex-1">
              پاک کردن فیلترها
            </Button>
            {isMobileFilterOpen && (
              <Button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1"
              >
                اعمال فیلترها
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
