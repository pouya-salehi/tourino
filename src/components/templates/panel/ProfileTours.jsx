// components/modules/profile/ProfileTours.jsx
//extra
import { useParams } from "next/navigation";
import Link from "next/link";
//components
import TourCard from "./TourCard";
//ui
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export default function ProfileTours({ tours, profile }) {
  const { slug } = useParams();
  if (tours.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-10 h-10 text-gray-400" />
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          هنوز توری ثبت نشده است
        </h3>

        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {profile.name} هنوز هیچ توری ایجاد نکرده است.
          {profile.isOwner && "می‌توانید اولین تور خود را ایجاد کنید."}
        </p>

        {profile.isOwner && (
          <Button>
            <Link href={`/${slug}/panel/add-tour`}>ساخت اولین تور</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          تورهای <span className="text-gray-500">{profile.slug}@</span>
        </h2>
        <span className="text-gray-600">{tours.length} تور</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} profile={profile} />
        ))}
      </div>
    </div>
  );
}
