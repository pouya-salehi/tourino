// components/modules/owner/OwnerPage.jsx (نسخه نهایی)
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "../toast";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

import ClientFilters from "./owner/clients/client-modules/ClientFilter";
import ClientCard from "./owner/clients/client-modules/ClientCard";
import ClientModal from "./owner/clients/ClientModal";

// هوک debounce
function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function OwnerPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [selectedClientId, setSelectedClientId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  // تابع fetch
  const fetchClients = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter !== "all" && { verifyStatus: statusFilter }),
        ...(sortBy && { sort: sortBy }),
      });
      const response = await fetch(`/api/owner/clients?${params}`, {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "خطا در دریافت اطلاعات");
      }
      setClients(data.data || []);
      setStats(data.meta.stats || {});
      setTotalPages(data.meta.pagination.totalPages || 1);
    } catch (error) {
      toast.error(error.message);
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, sortBy]);
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);
console.log(clients)
  // بازکردن مودال
  const handleOpenClientModal = (clientId) => {
    setSelectedClientId(clientId);
    setModalOpen(true);
  };

  // خروجی اکسل
  const exportToExcel = () => {
    toast.success("در حال آماده‌سازی فایل اکسل...");
    // کد تولید اکسل
  };

  return (
    <div className="min-h-screen md:p-6 mt-10">
      <div className="mx-auto">
        {/* هدر */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">مدیریت مشتریان</h1>
          <p className="text-gray-600 dark:text-gray-400">مدیریت و بررسی مشتریان شما</p>
        </div>

        {/* فیلترها */}
        <ClientFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onRefresh={fetchClients}
          onExport={exportToExcel}
        />

        {/* لیست مشتریان */}
        <Card className="mt-6">
          <CardContent className="p-0">
            {loading ? (
              // اسکلتون
              <div className="space-y-4 p-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-gray-200 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700">
                  مشتری‌ای یافت نشد
                </h3>
                <p className="text-gray-500 mt-2">
                  با تغییر فیلترها دوباره امتحان کنید
                </p>
              </div>
            ) : (
              <div className="py-1 px-4">
                {clients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onViewDetails={() => handleOpenClientModal(client.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* مودال مشتری */}
      <ClientModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedClientId(null);
        }}
        clientId={selectedClientId}
      />
    </div>
  );
}
