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
    // اصلاح این خط: از tour.id استفاده کن نه tourId
    router.push(`/admin/tours/edit/${tour.id}`);
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const res = await fetch(`/api/tours/create/${tour.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("تور با موفقیت حذف شد");
      onRefresh();
    } catch (error) {
      toast.error(error.message || "خطا در حذف تور");
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
        <AlertDialogContent className="border-0 flex flex-col justify-center text-center items-center">
          <AlertDialogHeader className="flex flex-col text-center items-center justify-center">
            <AlertDialogTitle>حذف تور</AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف تور "{tour.title}" مطمئن هستید؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>لغو</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
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
