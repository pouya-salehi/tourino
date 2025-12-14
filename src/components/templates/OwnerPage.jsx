"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
//modules
import Pagination from "../modules/owner/ownerpage/Pagination";
import ClientModal from "../modules/owner/ownerpage/ClientModal";
import ClientCard from "../modules/owner/ownerpage/ClinetCard";
import SidebarFilters from "../modules/owner/ownerpage/SidebarFilters";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  RefreshCcw,
  Users,
  CheckCircle,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/* ---------------------------
  Constants
--------------------------- */
const DEFAULT_LIMIT = 20;

/* ---------------------------
  Helper: debounce hook
--------------------------- */
function useDebounce(value, delay = 400) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return deb;
}

/* ---------------------------
  Main OwnerPage
--------------------------- */
export default function OwnerPage() {
  // state
  const [clients, setClients] = useState([]);
  const [tours, setTours] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedClientDocs, setSelectedClientDocs] = useState(null); // 👈 اینو اضافه کن

  const [search, setSearch] = useState("");
  const debSearch = useDebounce(search, 450);

  const [filters, setFilters] = useState({ tourId: "all", status: "all" });

  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedClient, setSelectedClient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // fetch function (memoized)
  const fetchClients = useCallback(
    async (opts = {}) => {
      setLoading(true);
      try {
        const q = new URLSearchParams();
        if (debSearch) q.append("search", debSearch);
        if (filters.tourId && filters.tourId !== "all")
          q.append("tourId", filters.tourId);
        if (filters.status && filters.status !== "all")
          q.append("status", filters.status);
        q.append("page", opts.page ?? page);
        q.append("limit", limit);

        const url = `/api/owner/clients?${q.toString()}`;

        const res = await fetch(url, {
          cache: "no-store",
          credentials: "include",
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "خطا در دریافت داده‌ها");
        }

        setClients(json.clients || []);
        setTours(json.filters?.tours || []);
        setStats(json.stats || {});
        setTotalPages(json.pagination?.totalPages || 1);
      } catch (err) {
        console.error("fetchClients error:", err);
        toast.error(err.message || "خطا در دریافت مشتری‌ها");
      } finally {
        setLoading(false);
      }
    },
    [debSearch, filters, page, limit]
  );

  // initial + deps
  useEffect(() => {
    // whenever search/filters/page change -> fetch
    setPage(1); // reset page on new filter/search
  }, [debSearch, filters]);

  useEffect(() => {
    fetchClients({ page });
  }, [fetchClients, page]);

  // actions
  const openClient = (client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedClient(null);
    setModalOpen(false);
  };

  const confirmBooking = async (client) => {
    // optimistic UI example: call API to confirm booking
    try {
      const res = await fetch("/api/owner/bookings/confirm", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: client.id }),
      });
      const j = await res.json();
      if (!res.ok || !j.success) throw new Error(j.message || "خطا");

      toast.success("رزرو تایید شد");
      // refresh small: update local item
      setClients((prev) =>
        prev.map((c) =>
          c.id === client.id ? { ...c, status: "CONFIRMED" } : c
        )
      );
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "خطا در تایید رزرو");
    }
  };

  const cancelBooking = async (client) => {
    try {
      const res = await fetch("/api/owner/bookings/cancel", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: client.id }),
      });
      const j = await res.json();
      if (!res.ok || !j.success) throw new Error(j.message || "خطا");

      toast.success("رزرو لغو شد");
      setClients((prev) =>
        prev.map((c) =>
          c.id === client.id ? { ...c, status: "CANCELLED" } : c
        )
      );
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "خطا در لغو رزرو");
    }
  };

  const handleRefresh = () => {
    fetchClients({ page: 1 });
  };

  return (
    <div className="min-h-screen shadow-none">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <SidebarFilters
          search={search}
          setSearch={setSearch}
          tours={tours}
          filters={filters}
          setFilters={setFilters}
          stats={stats}
          onRefresh={handleRefresh}
        />

        <main className="rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-500">
                لیست مشتری‌ها
              </h1>
              <span className="text-sm text-gray-500">
                ({stats.totalClients ?? 0})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-2 rounded-md"
                onClick={() => fetchClients({ page: 1 })}
              >
                <RefreshCcw className="w-4 h-4" />
                بروزرسانی
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-lg" />
              ))}
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Users className="mx-auto w-16 h-16 mb-4" />
              <div className="text-lg">مشتری‌ای یافت نشد</div>
              <div className="text-sm mt-2">
                با تغییر فیلترها دوباره امتحان کنید
              </div>
            </div>
          ) : (
            <div className="">
              <div className="flex flex-col gap-4">
                {clients.map((c) => (
                  <ClientCard key={c.id} client={c} onOpen={openClient} />
                ))}
              </div>
            </div>
          )}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </main>
      </div>
      <ClientModal
        open={modalOpen}
        onClose={closeModal}
        user={selectedClient} // اطلاعات کاربر
        documents={selectedClientDocs} // مدارک احراز
      />
    </div>
  );
}
