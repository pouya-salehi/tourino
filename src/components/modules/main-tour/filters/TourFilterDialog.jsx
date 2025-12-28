// components/modules/tours/filters/TourFilterDialog.jsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import TourFiltersForm from "./TourFiltersForm";
import { useRouter } from "next/navigation";
export default function TourFiltersDialog({ onApply, activeFilterCount = 0 }) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    minPrice: 0,
    maxPrice: 10000000,
    sortBy: "createdAt",
    sortOrder: "desc",
    ownerVerified: false,
  });

  const handleApply = () => {
    if (onApply) {
      onApply(filters);
    }
  };

  const handleReset = () => {
    router.push("/tours");
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 cursor-pointer">
          <Filter className="h-4 w-4" />
          جستجو | فیلتر
          {activeFilterCount > 0 && (
            <span className="text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>فیلتر تورها</DialogTitle>
        </DialogHeader>

        <TourFiltersForm filters={filters} setFilter={updateFilter} />

        <div className="flex gap-2 pt-4 border-t">
          <DialogClose asChild>
            <Button onClick={handleApply} className="flex-1">
              اعمال فیلترها
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleReset}>
              بازنشانی
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
