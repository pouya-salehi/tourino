import { Calendar, Users, DollarSign, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import TourActions from "./TourActions";

export default function TourRow({
  tour,
  index,
  pagination,
  onViewDetails,
  onRefresh,
}) {
  // Helper functions
  const getStatusBadge = (endDate) => {
    if (!endDate) return <Badge variant="outline">بدون تاریخ</Badge>;

    const now = new Date();
    const end = new Date(endDate);

    if (end < now) {
      return <Badge variant="destructive">منقضی شده</Badge>;
    } else if (end < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) {
      return (
        <Badge variant="default" className="bg-amber-500">
          به زودی
        </Badge>
      );
    } else {
      return <Badge variant="success">فعال</Badge>;
    }
  };

  const formatPrice = (price) => {
    return price ? price.toLocaleString("fa-IR") + " تومان" : "رایگان";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMMM yyyy", { locale: faIR });
  };

  const rowNumber =
    pagination.page > 1
      ? (pagination.page - 1) * pagination.limit + index + 1
      : index + 1;

  return (
    <TableRow>
      <TableCell>{rowNumber}</TableCell>

      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{tour.title}</div>
          <div className="text-sm text-gray-500 flex items-center">
            <MapPin className="h-3 w-3 ml-1" />
            {tour.location}
          </div>
        </div>
      </TableCell>

      <TableCell>
        {tour.owner ? (
          <div className="space-y-2">
            <div className="font-medium">{tour.owner.name}</div>
            <div className="text-sm text-gray-500">@{tour.owner.slug}</div>
          </div>
        ) : (
          <span className="text-gray-400">نامشخص</span>
        )}
      </TableCell>

      <TableCell>
        <div className="flex items-center text-green-600">
          <DollarSign className="h-4 w-4 ml-1" />
          {formatPrice(tour.price)}
        </div>
        {tour.maxPeople && (
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <Users className="h-3 w-3 ml-1" />
            تا {tour.maxPeople} نفر
          </div>
        )}
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Calendar className="h-3 w-3 ml-1" />
            شروع: {formatDate(tour.startDate)}
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-3 w-3 ml-1" />
            پایان: {formatDate(tour.endDate)}
          </div>
        </div>
      </TableCell>

      <TableCell>
        {getStatusBadge(tour.endDate)}
        <div className="text-xs text-gray-500 mt-1">
          {format(new Date(tour.createdAt), "dd/MM/yyyy", { locale: faIR })}
        </div>
      </TableCell>

      <TableCell>
        <TourActions
          tour={tour}
          onViewDetails={onViewDetails}
          onRefresh={onRefresh}
        />
      </TableCell>
    </TableRow>
  );
}
