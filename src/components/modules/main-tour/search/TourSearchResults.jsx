"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TourSearchResults({ results, query, setOpen }) {
  const router = useRouter();

  const handleViewAll = () => {
    router.push(`/tours?search=${encodeURIComponent(query)}`);
    setOpen(false);
  };

  if (!results.length) {
    return <p className="text-sm text-muted-foreground">نتیجه‌ای یافت نشد</p>;
  }

  return (
    <div className="space-y-3">
      {results.map((tour) => (
        <Link
          key={tour.id}
          href={`/${tour.ownerSlug}/${tour.slug}`}
          className="flex gap-3 items-center hover:bg-muted p-2 rounded-md"
          onClick={() => setOpen(false)}
        >
          {tour.image && (
            <img
              src={tour.image}
              className="w-14 h-14 rounded-lg object-cover"
              alt={tour.title}
            />
          )}

          <div>
            <p className="font-medium">{tour.title}</p>
            <span className="text-xs text-muted-foreground">
              {tour.location}
            </span>
          </div>
        </Link>
      ))}

      {/* 🔥 CTA */}
      <Button
        variant="ghost"
        className="w-full text-primary"
        onClick={handleViewAll}
      >
        دیدن همه تورهای «{query}»
      </Button>
    </div>
  );
}
