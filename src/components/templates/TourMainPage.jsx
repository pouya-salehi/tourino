// components/templates/TourMainPageClient.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TourCard from "./panel/TourCard";
import TourHeader from "../modules/main-tour/TourHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { X } from "lucide-react";
export default function TourMainPageClient({
  initialTours = [],
  initialPagination = {},
  initialFilters = {},
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tours, setTours] = useState(initialTours);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    location: initialFilters.location || "",
    minPrice: initialFilters.minPrice ? Number(initialFilters.minPrice) : 0,
    maxPrice: initialFilters.maxPrice
      ? Number(initialFilters.maxPrice)
      : 10000000,
    ownerVerified: initialFilters.ownerVerified === "true",
    sortBy: initialFilters.sortBy || "createdAt",
    sortOrder: initialFilters.sortOrder || "desc",
  });

  // وقتی URL تغییر کرد، داده‌ها رو بروزرسانی کن
  useEffect(() => {
    const fetchToursWithFilters = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams(searchParams);
        params.set("limit", "12");

        const response = await fetch(`/api/tours?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setTours(data.data || []);
          setPagination(data.pagination || {});
          setFilters(data.filters || {});
        }
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchToursWithFilters();
  }, [searchParams]);

  // اعمال فیلترهای جدید
  const applyFilters = (newFilters) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "" && value !== 0 && value !== false) {
        params.set(key, value.toString());
      }
    });

    params.set("page", "1"); // برگشت به صفحه اول

    router.push(`/tours?${params.toString()}`);
  };

  // تغییر صفحه
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/tours?${params.toString()}`);
  };

  // بازنشانی فیلترها
  const resetFilters = () => {
    router.push("/tours");
  };

  // شمارش فیلترهای فعال
  const activeFilterCount = [
    filters.search ? 1 : 0,
    filters.location ? 1 : 0,
    filters.ownerVerified ? 1 : 0,
    filters.minPrice > 0 ? 1 : 0,
    filters.maxPrice < 10000000 ? 1 : 0,
    filters.sortBy !== "createdAt" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <section className="mx-auto px-4 py-8">
      {/* هدر با دکمه‌های جستجو و فیلتر */}
      <div className="mb-8">
        <TourHeader
          onFilterChange={applyFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* نمایش فیلترهای فعال */}
        {activeFilterCount > 0 && (
          <div className="mt-4 p-3 bg-muted w-fit flex items-center flex-col justify-center rounded-2xl relative">
            <div className="flex items-center w-full justify-center mb-2">
              <span className="text-sm font-medium">
                {activeFilterCount} فیلتر فعال
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs py-3 rounded-full px-2 bg-red-400 text-white absolute -top-2 -left-2"
              >
                <X />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 w-full">
              {filters.search && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  جستجو: {filters.search}
                </span>
              )}
              {filters.location && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  مکان: {filters.location}
                </span>
              )}
              {filters.ownerVerified && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  تأیید شده‌ها
                </span>
              )}
              {filters.minPrice > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  حداقل قیمت: {filters.minPrice.toLocaleString()} تومان
                </span>
              )}
              {filters.maxPrice < 10000000 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  حداکثر قیمت: {filters.maxPrice.toLocaleString()} تومان
                </span>
              )}
              {filters.sortBy !== "createdAt" && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  مرتب‌سازی:{" "}
                  {filters.sortBy === "price"
                    ? "قیمت"
                    : filters.sortBy === "startDate"
                    ? "تاریخ شروع"
                    : filters.sortBy === "rating"
                    ? "امتیاز"
                    : ""}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* نمایش تعداد نتایج */}
      {!loading && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            {pagination.totalCount?.toLocaleString() || 0} تور یافت شد
          </p>
        </div>
      )}

      {/* لیست تورها */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[400px]">
              <Skeleton className="w-full h-full rounded-2xl" />
            </div>
          ))}
        </div>
      ) : tours.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} profile={tour.owner || {}} />
            ))}
          </div>

          {/* صفحه‌بندی */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={!pagination.hasPrev}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4 rotate-180" />
                  قبلی
                </Button>

                <div className="flex items-center gap-1">
                  <span className="px-3 py-2">
                    صفحه {pagination.page} از {pagination.totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  disabled={!pagination.hasNext}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="gap-2"
                >
                  بعدی
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                نمایش {(pagination.page - 1) * pagination.limit + 1} تا{" "}
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.totalCount
                )}{" "}
                از {pagination.totalCount} تور
              </p>
            </div>
          )}
        </>
      ) : (
        tours.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🏕️</div>
            <h3 className="text-xl font-semibold mb-2">تور یافت نشد</h3>
            <p className="text-muted-foreground mb-6">
              هیچ توری با فیلترهای انتخاب شده مطابقت ندارد
            </p>
            <Button onClick={resetFilters} variant="outline">
              حذف فیلترها
            </Button>
          </div>
        )
      )}
    </section>
  );
}
