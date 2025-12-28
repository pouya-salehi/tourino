"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Download } from "lucide-react";

// کامپوننت‌های داخلی
import TourFilters from "./TourFilters";
import ToursTable from "./ToursTable";
import TourStats from "./TourStats";
//params
import { useParams } from "next/navigation";
export default function TourManagementPage() {
  const router = useRouter();
  const { slug } = useParams();
  // Stateها
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [activeTab, setActiveTab] = useState("all");

  // Fetch تورها
  const fetchTours = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const res = await fetch(`/api/tours?${params}`);
      const result = await res.json();

      if (result.success) {
        setTours(result.data);
        setPagination(result.pagination);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("❌ Fetch tours error:", error);
      toast.error("خطا در دریافت اطلاعات تورها");
    } finally {
      setLoading(false);
    }
  };

  // Load اولیه
  useEffect(() => {
    fetchTours();
  }, [filters, pagination.page]);

  // Handlers
  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusChange = (status) => {
    setFilters((prev) => ({ ...prev, status }));
    setPagination((prev) => ({ ...prev, page: 1 }));
    setActiveTab(status);
  };

  const handleSort = (field) => {
    const newSortOrder =
      filters.sortBy === field && filters.sortOrder === "asc" ? "desc" : "asc";
    setFilters((prev) => ({ ...prev, sortBy: field, sortOrder: newSortOrder }));
  };

  const handleRefresh = () => {
    fetchTours();
  };

  const handleExport = () => {
    toast.info("این قابلیت به زودی اضافه می‌شود");
  };

  const handleCreate = () => {
    router.push(`/${slug}/panel/add-tour`);
  };

  // Loading skeleton
  if (loading && tours.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header با آمار */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">مدیریت تورها</h1>
          <p className="text-muted-foreground">
            مدیریت و نظارت بر تمامی تورهای سیستم ({pagination.totalCount} تور)
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="dark:text-white dark:border-white">
            <Download className="h-4 w-4 ml-2" />
            خروجی
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 ml-2" />
            تور جدید
          </Button>
        </div>
      </div>

      {/* فیلترها */}
      <TourFilters
        filters={filters}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        onSort={handleSort}
        onRefresh={handleRefresh}
      />

      {/* تب‌های مختلف */}
      <Tabs value={activeTab} onValueChange={handleStatusChange}>
        <TabsList className="grid w-full grid-cols-3 dark:bg-transparent">
          <TabsTrigger value="all">همه تورها</TabsTrigger>
          <TabsTrigger value="active">فعال</TabsTrigger>
          <TabsTrigger value="expired">منقضی شده</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* جدول تورها */}
          <Card>
            <CardHeader>
              <CardTitle>لیست تورها</CardTitle>
              <CardDescription>
                نمایش {tours.length} از {pagination.totalCount} تور
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ToursTable
                tours={tours}
                pagination={pagination}
                onPaginationChange={setPagination}
                onRefresh={fetchTours}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* آمار */}
      <TourStats tours={tours} />
    </div>
  );
}
