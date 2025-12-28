// components/tours/TourFiltersForm.jsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Check, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
//components
import ComboboxSearch from "../search/TourSearchDialog";
export default function TourFiltersForm({ filters, setFilter }) {
  const handlePriceChange = (value) => {
    setFilter("minPrice", value[0]);
    setFilter("maxPrice", value[1]);
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "۰";
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  return (
    <div className="space-y-6 py-4">
      {/* Search */}
      <div>
        <Label htmlFor="search">جستجو</Label>
        <ComboboxSearch
          value={filters.search}
          onChange={(newValue) => setFilter("search", newValue)}
        />
        {filters.search && filters.search.length < 2 && (
          <p className="text-xs text-muted-foreground mt-1">
            حداقل ۲ حرف وارد کنید
          </p>
        )}
      </div>

      {/* Location */}
      <div>
        <Label htmlFor="location">مکان</Label>
        <Input
          id="location"
          value={filters.location}
          onChange={(e) => setFilter("location", e.target.value)}
          placeholder="شهر یا استان..."
          className="mt-1"
        />
      </div>

      {/* Price Range */}
      <div>
        <Label className="block mb-2">
          محدوده قیمت: {formatPrice(filters.minPrice)} -{" "}
          {formatPrice(filters.maxPrice)}
        </Label>
        <Slider
          value={[filters.minPrice, filters.maxPrice]}
          min={0}
          max={10000000}
          step={100000}
          onValueChange={handlePriceChange}
          className="my-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>۰ تومان</span>
          <span>۱۰ میلیون تومان</span>
        </div>
      </div>

      {/* Sort */}
      <div>
        <Label htmlFor="sort">مرتب‌سازی</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => setFilter("sortBy", value)}
        >
          <SelectTrigger id="sort" className="mt-1 w-full text-black">
            <SelectValue placeholder="انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>بر اساس</SelectLabel>
              <SelectItem value="newest">جدیدترین</SelectItem>
              <SelectItem value="cheapest">ارزان‌ترین</SelectItem>
              <SelectItem value="expensive">گران‌ترین</SelectItem>
              <SelectItem value="rating">بیشترین امتیاز</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Verified Owners */}
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <Label className="cursor-pointer font-medium" htmlFor="verified">
          فقط برگزارکنندگان تأیید شده
        </Label>
        <Button
          id="verified"
          type="button"
          variant={filters.ownerVerified ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("ownerVerified", !filters.ownerVerified)}
          className="h-9 w-9 p-0"
        >
          {filters.ownerVerified ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Active Filters Summary */}
      <div className="pt-4 border-t">
        <p className="text-sm font-medium mb-2">فیلترهای فعال:</p>
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full">
              جستجو: {filters.search}
              <button
                onClick={() => setFilter("search", "")}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.location && (
            <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full">
              مکان: {filters.location}
              <button
                onClick={() => setFilter("location", "")}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.ownerVerified && (
            <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full">
              تأیید شده‌ها
              <button
                onClick={() => setFilter("ownerVerified", false)}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {(filters.minPrice > 0 || filters.maxPrice < 10000000) && (
            <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full">
              قیمت: {formatPrice(filters.minPrice)} تا{" "}
              {formatPrice(filters.maxPrice)}
              <button
                onClick={() => {
                  setFilter("minPrice", 0);
                  setFilter("maxPrice", 10000000);
                }}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.sortBy !== "newest" && (
            <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full">
              مرتب‌سازی:{" "}
              {filters.sortBy === "cheapest"
                ? "ارزان‌ترین"
                : filters.sortBy === "expensive"
                ? "گران‌ترین"
                : "بیشترین امتیاز"}
              <button
                onClick={() => setFilter("sortBy", "newest")}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
