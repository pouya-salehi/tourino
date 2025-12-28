// app/tours/page.jsx
import TourMainPageClient from "@/components/templates/TourMainPage";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function ToursPage({ searchParams }) {
  // ساخت URL پارامترها
  const params = new URLSearchParams();

  // اضافه کردن تمام پارامترهای موجود
  if (searchParams.search) params.set("search", searchParams.search);
  if (searchParams.location) params.set("location", searchParams.location);
  if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice);
  if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice);
  if (searchParams.ownerVerified)
    params.set("ownerVerified", searchParams.ownerVerified);
  if (searchParams.sortBy) params.set("sortBy", searchParams.sortBy);
  if (searchParams.sortOrder) params.set("sortOrder", searchParams.sortOrder);
  if (searchParams.page) params.set("page", searchParams.page);

  params.set("limit", "12"); // محدودیت پیش‌فرض

  const apiUrl = `${process.env.NEXTAUTH_URL}/api/tours?${params.toString()}`;

  console.log("📡 Fetching tours from:", apiUrl);

  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 60 },
      cache: "no-store", // برای فیلترهای پویا
    });

    if (!res.ok) {
      console.error("API error:", res.status, res.statusText);
      notFound();
    }

    const data = await res.json();

    if (!data.success) {
      console.error("API returned failure:", data.message);
      notFound();
    }

    console.log("✅ Tours fetched:", data.data?.length || 0, "tours");

    // پاس دادن هم داده‌ها و هم پارامترهای فیلتر به کامپوننت کلاینت
    return (
      <TourMainPageClient
        initialTours={data.data || []}
        initialPagination={data.pagination}
        initialFilters={searchParams}
      />
    );
  } catch (error) {
    console.error("❌ Fetch error:", error);
    notFound();
  }
}
