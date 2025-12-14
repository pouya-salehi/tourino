// app/(routes)/[slug]/page.jsx
import TourPage from "@/components/templates/panel/TourPage";

export default async function Page({ params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">آدرس نامعتبر</p>
        </div>
      );
    }

    return <TourPage slug={slug} />;
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
