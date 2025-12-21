// components/panel/tour-detail/TourHeader.jsx
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TourActions from "./TourActions";

function TourHeader({
  tour,
  selectedImage,
  setSelectedImage,
  handleShare,
  isLiked,
  setIsLiked,
  remainingSpots,
  formatDate,
}) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    // اگر فقط می‌خواهی دو ستون ساده داشته باشی:
    <section className="w-full">
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-12">
        {/* تصویر - 50% عرض */}
        <div className="lg:w-1/2">
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={tour.images?.[0] || "/placeholder.jpg"}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
              <div className="p-2 absolute top-0 left-0">
                <TourActions
                  isLiked={isLiked}
                  setIsLiked={setIsLiked}
                  handleShare={handleShare}
                />
              </div>
              <div className="absolute bottom-0 right-0 p-2">
                <h2 className="bg-gradient-to-r from-white via-white/60 to-white text-transparent bg-clip-text text-4xl">
                  {tour.title}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* متن - 50% عرض */}
        <div className="lg:w-1/2 flex flex-col justify-center">
          <h1 className="text-5xl font-black mb-6">{tour.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{tour.description}</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-lg">{tour.location}</span>
            </div>
            {/* ... سایر اطلاعات */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TourHeader;
