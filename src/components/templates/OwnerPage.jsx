"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  RefreshCcw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OwnerPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    tourId: "all",
    status: "all",
  });
  const [stats, setStats] = useState({
    totalClients: 0,
    pending: 0,
    confirmed: 0,
    totalRevenue: 0,
  });
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetchClients();
    fetchStats();
  }, [search, filters]);

  async function fetchClients() {
    setLoading(true);
    try {
      let url = `/api/owner/clients?search=${encodeURIComponent(search)}`;
      if (filters.tourId !== "all") url += `&tourId=${filters.tourId}`;
      if (filters.status !== "all") url += `&status=${filters.status}`;

      const res = await fetch(url, {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setClients(data.clients || []);
        setTours(data.filters?.tours || []);
      } else {
        console.error("Error fetching clients:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  }

  async function fetchStats() {
    try {
      const res = await fetch("/api/owner/clients?limit=1", {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setStats(data.stats || {});
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }

  // فیلتر مشتری‌ها بر اساس جستجو
  const filteredClients = clients.filter((c) =>
    `${c.fullName} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  // تابع برای نمایش وضعیت
  const getStatusBadge = (status) => {
    const config = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800",
        icon: "⏳",
        label: "در انتظار",
      },
      CONFIRMED: {
        color: "bg-green-100 text-green-800",
        icon: "✅",
        label: "تایید شده",
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800",
        icon: "❌",
        label: "لغو شده",
      },
      COMPLETED: {
        color: "bg-blue-100 text-blue-800",
        icon: "🏁",
        label: "تکمیل شده",
      },
    };

    const cfg = config[status] || {
      color: "bg-gray-100 text-gray-800",
      icon: "❓",
      label: status,
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}
      >
        {cfg.icon} {cfg.label}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 p-5 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-800">فیلتر مشتری‌ها</h2>

        {/* جستجو */}
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="جستجو با نام یا شماره تماس..."
            className="border-none bg-transparent focus-visible:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* فیلتر تور */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            فیلتر بر اساس تور
          </label>
          <Select
            value={filters.tourId}
            onValueChange={(value) => setFilters({ ...filters, tourId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="همه تورها" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه تورها</SelectItem>
              {tours.map((tour) => (
                <SelectItem key={tour.id} value={tour.id.toString()}>
                  {tour.title} ({tour.price?.toLocaleString()} ریال)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* فیلتر وضعیت */}
        <div className="space-y-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            فیلتر بر اساس وضعیت
          </label>
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="همه وضعیت‌ها" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="all">همه وضعیت‌ها</SelectItem>
              <SelectItem value="PENDING">در انتظار تایید</SelectItem>
              <SelectItem value="CONFIRMED">تایید شده</SelectItem>
              <SelectItem value="CANCELLED">لغو شده</SelectItem>
              <SelectItem value="COMPLETED">تکمیل شده</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* آمار */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">آمار کلی</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">کل مشتریان:</span>
              <span className="font-bold">{stats.totalClients}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">در انتظار:</span>
              <span className="font-bold text-yellow-600">{stats.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">تایید شده:</span>
              <span className="font-bold text-green-600">
                {stats.confirmed}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">لیست مشتری‌ها</h1>
          <Button
            onClick={fetchClients}
            variant="outline"
            size="sm"
            className="border-0 rounded-md"
          >
            <RefreshCcw />
            بروزرسانی
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">هنوز مشتری‌ای ثبت‌نام نکرده است.</p>
            <p className="text-sm text-gray-400 mt-2">
              بعد از ثبت‌نام کاربران در تورهای شما، اینجا نمایش داده می‌شوند.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="bg-white shadow-sm rounded-xl p-4 border cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-lg text-gray-800">
                      {client.fullName}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">{client.phone}</p>
                  </div>
                  {getStatusBadge(client.status)}
                </div>

                <div className="mt-3 space-y-1">
                  <p className="text-sm">
                    <span className="text-gray-600">تور:</span>{" "}
                    <span className="font-medium">{client.tourTitle}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">تعداد نفرات:</span>{" "}
                    <span className="font-medium">{client.people} نفر</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">مبلغ:</span>{" "}
                    <span className="font-medium text-green-600">
                      {client.price?.toLocaleString()} ریال
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    📅 {client.createdAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal نمایش جزئیات */}
      <Dialog
        open={!!selectedClient}
        onOpenChange={() => setSelectedClient(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>جزئیات رزرو مشتری</DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p>
                    <strong className="text-gray-700">نام کامل:</strong>
                  </p>
                  <p className="bg-gray-50 p-2 rounded">
                    {selectedClient.fullName}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong className="text-gray-700">شماره تماس:</strong>
                  </p>
                  <p className="bg-gray-50 p-2 rounded">
                    {selectedClient.phone}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p>
                    <strong className="text-gray-700">کد ملی:</strong>
                  </p>
                  <p className="bg-gray-50 p-2 rounded">
                    {selectedClient.nationalCode || "ثبت نشده"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong className="text-gray-700">وضعیت رزرو:</strong>
                  </p>
                  <div className="p-2">
                    {getStatusBadge(selectedClient.status)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p>
                  <strong className="text-gray-700">تور:</strong>
                </p>
                <p className="bg-gray-50 p-2 rounded">
                  {selectedClient.tourTitle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p>
                    <strong className="text-gray-700">تعداد نفرات:</strong>
                  </p>
                  <p className="bg-gray-50 p-2 rounded">
                    {selectedClient.people} نفر
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong className="text-gray-700">مبلغ کل:</strong>
                  </p>
                  <p className="bg-gray-50 p-2 rounded font-bold text-green-600">
                    {selectedClient.price?.toLocaleString()} ریال
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p>
                  <strong className="text-gray-700">تاریخ رزرو:</strong>
                </p>
                <p className="bg-gray-50 p-2 rounded">
                  {selectedClient.createdAt}
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="default"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 ml-2" />
                  تایید رزرو
                </Button>
                <Button variant="destructive" className="flex-1">
                  <XCircle className="w-4 h-4 ml-2" />
                  لغو رزرو
                </Button>
                <Button variant="outline" className="flex-1">
                  ویرایش
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
