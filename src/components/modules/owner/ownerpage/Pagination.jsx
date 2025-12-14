import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="flex items-center gap-3 justify-center mt-6 absolute bottom-2 w-5xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="py-5 px-3 shadow-lg cursor-pointer rounded-full"
      >
        <ChevronRight />
      </Button>
      <div className="text-sm text-gray-500">
        صفحه <strong>{page}</strong> از <strong>{totalPages}</strong>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="py-5 px-3 shadow-lg cursor-pointer rounded-full"
      >
        <ChevronLeft />
      </Button>
    </div>
  );
}
export default Pagination;
