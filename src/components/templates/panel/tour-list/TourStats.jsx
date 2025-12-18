import { Card, CardContent } from "@/components/ui/card";

export default function TourStats({ tours }) {
  const stats = {
    total: tours.length,
    active: tours.filter((t) => new Date(t.endDate) > new Date()).length,
    upcoming: tours.filter(
      (t) =>
        t.startDate &&
        new Date(t.startDate) <
          new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    ).length,
    expired: tours.filter((t) => new Date(t.endDate) <= new Date()).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-500">کل تورها</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <div className="text-sm text-gray-500">تورهای فعال</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">
              {stats.upcoming}
            </div>
            <div className="text-sm text-gray-500">به زودی شروع می‌شوند</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.expired}
            </div>
            <div className="text-sm text-gray-500">منقضی شده</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
