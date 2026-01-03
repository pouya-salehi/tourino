// components/templates/TourDetailPage.jsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import TourHeader from "./panel/tour-detail/TourHeader";
import TourFeatures from "./panel/tour-detail/TourFeatures";
import TourSchedule from "./panel/tour-detail/TourSchedule";
import TourBookingCard from "./panel/tour-detail/TourBookingCard";
import TourComments from "./panel/tour-detail/TourComments";

export default function TourDetailPage({ tour }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [peopleCount, setPeopleCount] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const remainingSpots =
    typeof tour.maxPeople === "number"
      ? Math.max(0, tour.maxPeople - (tour.bookedCount || 0))
      : null;

  const formatDate = (date) => {
    if (!date) return "انعطاف‌پذیر";
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: tour.title,
        text: tour.description,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen mt-12 md:px-4"
    >
      <TourHeader
        tour={tour}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        handleShare={handleShare}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        remainingSpots={remainingSpots}
        formatDate={formatDate}
      />

      <div className="mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TourFeatures
              tour={tour}
              showAllFeatures={showAllFeatures}
              setShowAllFeatures={setShowAllFeatures}
            />

            {tour.schedule?.length > 0 && <TourSchedule tour={tour} />}

            <TourComments tourId={tour.id} />
          </div>

          <div className="lg:col-span-1">
            <TourBookingCard
              tour={tour}
              peopleCount={peopleCount}
              setPeopleCount={setPeopleCount}
              formatDate={formatDate}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
