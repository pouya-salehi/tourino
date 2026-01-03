// components/modules/owner/clients/ClientFilters.jsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCcw, Download, Filter } from "lucide-react";

export default function ClientFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  onRefresh,
  onExport,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-center md:justify-between md:flex-row gap-4">
        {/* جستجو */}
        <div className="w-90 md:w-full">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="جستجوی نام، ایمیل یا شماره تلفن..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* فیلتر وضعیت */}
        <div className="w-full md:w-sm">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="وضعیت احراز" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه وضعیت‌ها</SelectItem>
              <SelectItem value="APPROVED">تایید شده</SelectItem>
              <SelectItem value="PENDING">در حال بررسی</SelectItem>
              <SelectItem value="REJECTED">رد شده</SelectItem>
              <SelectItem value="NOT_SUBMITTED">ثبت‌نشده</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* مرتب‌سازی */}
        <div className="w-full md:w-sm">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="مرتب‌سازی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">جدیدترین</SelectItem>
              <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
              <SelectItem value="name_asc">نام (الف-ی)</SelectItem>
              <SelectItem value="name_desc">نام (ی-الف)</SelectItem>
              <SelectItem value="bookings_desc">بیشترین تور</SelectItem>
              <SelectItem value="bookings_asc">کمترین تور</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* دکمه‌های اکشن */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 ">
          <Filter className="inline h-4 w-4 ml-1" />
          فیلترها اعمال شده
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onRefresh}
            size="sm"
            className="dark:text-white dark:border-white"
          >
            <RefreshCcw className="h-4 w-4 ml-2" />
            بروزرسانی
          </Button>

          <Button
            variant="outline"
            onClick={onExport}
            size="sm"
            className="dark:text-white dark:border-white"
          >
            <Download className="h-4 w-4 ml-2" />
            خروجی اکسل
          </Button>
        </div>
      </div>
    </div>
  );
}
