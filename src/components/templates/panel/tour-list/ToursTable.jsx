import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import TourRow from "./TourRow";
import TourDetailsModal from "./TourDetailModal";
import { useState } from "react";

export default function ToursTable({
  tours,
  pagination,
  onPaginationChange,
  onRefresh,
}) {
  const [selectedTour, setSelectedTour] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const handleViewDetails = (tour) => {
    setSelectedTour(tour);
    setDetailsModalOpen(true);
  };

  if (tours.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">هیچ توری یافت نشد</p>
        <Button variant="outline" className="mt-4" onClick={onRefresh}>
          تلاش مجدد
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>عنوان تور</TableHead>
              <TableHead>مالک</TableHead>
              <TableHead>قیمت</TableHead>
              <TableHead>تاریخ‌ها</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.map((tour, index) => (
              <TourRow
                key={tour.id}
                tour={tour}
                index={index}
                pagination={pagination}
                onViewDetails={() => handleViewDetails(tour)}
                onRefresh={onRefresh}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            صفحه {pagination.page} از {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPaginationChange((prev) => ({
                  ...prev,
                  page: prev.page - 1,
                }))
              }
              disabled={!pagination.hasPrev}
            >
              قبلی
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPaginationChange((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }))
              }
              disabled={!pagination.hasNext}
            >
              بعدی
            </Button>
          </div>
        </div>
      )}

      {/* Modal جزئیات */}
      <TourDetailsModal
        tour={selectedTour}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
    </>
  );
}
