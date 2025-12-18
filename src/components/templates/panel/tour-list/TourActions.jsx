import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/toast";
import {
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ExternalLink,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function TourActions({ tour, onViewDetails, onRefresh }) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleView = (slug) => {
    window.open(`/tours/${slug}`, "_blank");
  };

  const handleEdit = (id) => {
    router.push(`/admin/tours/edit/${id}`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/tours/${tour.id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        toast.success("تور با موفقیت حذف شد");
        onRefresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("❌ Delete error:", error);
      toast.error("خطا در حذف تور");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleView(tour.slug)}>
              <ExternalLink className="h-4 w-4 ml-2" />
              مشاهده در سایت
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onViewDetails()}>
              <Info className="h-4 w-4 ml-2" />
              جزئیات بیشتر
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => handleEdit(tour.id)}>
              <Edit className="h-4 w-4 ml-2" />
              ویرایش تور
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setDeleteDialogOpen(true)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 ml-2" />
              حذف تور
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog حذف */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف تور</AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف تور "{tour.title}" مطمئن هستید؟
              <br />
              <span className="text-amber-600 font-medium">
                این عمل غیرقابل بازگشت است!
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>لغو</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full ml-2" />
                  در حال حذف...
                </>
              ) : (
                "حذف تور"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
