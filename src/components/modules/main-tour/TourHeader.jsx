// components/modules/main-tour/TourHeader.jsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

import TourFiltersDialog from "./filters/TourFilterDialog";
import TourSearchDialog from "./search/TourSearchDialog";

function TourHeader({ onFilterChange, activeFilterCount }) {
  const router = useRouter();

  const handleSearch = (query) => {
    router.push(`/tours?search=${encodeURIComponent(query)}`);
  };

  const handleFilterApply = (filters) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">تورهای موجود</h1>
            <p className="text-muted-foreground mt-2">
              بهترین تجربه‌های سفر را با ما کشف کنید
            </p>
          </div>

          <div className="flex gap-3">
            <TourFiltersDialog
              onApply={handleFilterApply}
              activeFilterCount={activeFilterCount}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TourHeader;
