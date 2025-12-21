import { notFound } from "next/navigation";
import TourSlugs from "@/components/templates/TourSlugs";
export default async function Page({ params }) {
  try {
    const { slug, tourSlug } = await params;

    if (!slug || !tourSlug) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">آدرس نامعتبر</p>
        </div>
      );
    }

    console.log("Params:", { slug, tourSlug });

    // حالا باید API رو fetch کنید
    const res = await fetch(
      `http://localhost:3000/api/tours/${encodeURIComponent(tourSlug)}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      notFound();
    }

    const result = await res.json();

    if (!result.success || !result.tour) {
      notFound();
    }

    return <TourSlugs tour={result.tour} />;
  } catch (error) {
    console.error("Error in page:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">خطا در بارگذاری صفحه</p>
      </div>
    );
  }
}


export const dynamic = "force-dynamic";
