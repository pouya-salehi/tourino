import { Search, Filter, ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TourFilters({
  filters,
  onSearch,
  onStatusChange,
  onSort,
  onRefresh,
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* جستجو */}
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="جستجوی تور..."
              value={filters.search}
              onChange={(e) => onSearch(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* فیلتر وضعیت */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <Filter className="h-4 w-4 ml-2" />
                {filters.status === "all"
                  ? "همه وضعیت‌ها"
                  : filters.status === "active"
                  ? "فعال"
                  : "منقضی"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>فیلتر وضعیت</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onStatusChange("all")}>
                همه تورها
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange("active")}>
                فعال
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange("expired")}>
                منقضی شده
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* مرتب‌سازی */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                مرتب‌سازی:{" "}
                {filters.sortBy === "createdAt"
                  ? "تاریخ ایجاد"
                  : filters.sortBy === "price"
                  ? "قیمت"
                  : filters.sortBy === "startDate"
                  ? "تاریخ شروع"
                  : "عنوان"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>مرتب‌سازی بر اساس</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onSort("createdAt")}>
                تاریخ ایجاد{" "}
                {filters.sortBy === "createdAt" &&
                  (filters.sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort("title")}>
                عنوان{" "}
                {filters.sortBy === "title" &&
                  (filters.sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort("price")}>
                قیمت{" "}
                {filters.sortBy === "price" &&
                  (filters.sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort("startDate")}>
                تاریخ شروع{" "}
                {filters.sortBy === "startDate" &&
                  (filters.sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh */}
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 ml-2" />
            به‌روزرسانی
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
