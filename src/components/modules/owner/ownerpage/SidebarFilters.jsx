import { Input } from "@/components/ui/input";
import StatsCard from "./StatsCards";
import { Search, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
function SidebarFilters({
  search,
  setSearch,
  tours,
  filters,
  setFilters,
  stats,
  onRefresh,
}) {
  return (
    <aside className="w-full md:w-72 p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold mb-2">فیلتر مشتری‌ها</h2>

        <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="جستجو با نام یا شماره..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 shadow-none"
          />
        </div>
      </div>
      <Separator className="my-2" />
      <div>
        <label className="text-sm text-gray-700 block mb-2">تور</label>
        <Select
          value={filters.tourId}
          onValueChange={(v) => setFilters((p) => ({ ...p, tourId: v }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="همه تورها" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه تورها</SelectItem>
            {tours.map((t) => (
              <SelectItem key={t.id} value={t.id?.toString() ?? ""}>
                {t.title}{" "}
                {t.price ? `— ${Number(t.price).toLocaleString()} ﷼` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-2" />
      <div>
        <label className="text-sm text-gray-700 block mb-2">وضعیت</label>
        <Select
          value={filters.status}
          onValueChange={(v) => setFilters((p) => ({ ...p, status: v }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="همه وضعیت‌ها" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            <SelectItem value="PENDING">در انتظار</SelectItem>
            <SelectItem value="CONFIRMED">تایید شده</SelectItem>
            <SelectItem value="CANCELLED">لغو شده</SelectItem>
            <SelectItem value="COMPLETED">تکمیل شده</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-2" />
      <StatsCard stats={stats} onRefresh={onRefresh} />

      <div className="mt-auto text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          فیلتری فعال:{" "}
          <strong>
            {filters.tourId !== "all" ? `تور:${filters.tourId}` : "همه"} —{" "}
            {filters.status !== "all" ? filters.status : "همه"}
          </strong>
        </div>
      </div>
    </aside>
  );
}
export default SidebarFilters;
