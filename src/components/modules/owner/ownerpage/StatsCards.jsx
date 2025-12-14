import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
function StatsCard({ stats, onRefresh }) {
  return (
    <div className="shadow rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">آمار کلی</h3>
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          <RefreshCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-slate-50 rounded flex justify-end flex-col items-center text-center">
          <div className="text-xs text-gray-500">کل مشتریان</div>
          <div className="text-lg font-bold text-gray-600">{stats.totalClients ?? 0}</div>
        </div>

        <div className="p-3 bg-yellow-50 rounded  flex justify-between flex-col items-center text-center">
          <div className="text-xs text-gray-500">در انتظار</div>
          <div className="text-lg font-bold text-yellow-700">
            {stats.pending ?? 0}
          </div>
        </div>

        <div className="p-3 bg-green-50 rounded  flex justify-end flex-col items-center text-center">
          <div className="text-xs text-gray-500">تایید شده</div>
          <div className="text-lg font-bold text-green-700">
            {stats.confirmed ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;