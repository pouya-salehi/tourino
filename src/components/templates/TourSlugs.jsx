// components/templates/TourDetailPage.jsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Import Components
import TourHeader from "./panel/tour-detail/TourHeader";
import TourFeatures from "./panel/tour-detail/TourFeatures";
import TourSchedule from "./panel/tour-detail/TourSchedule";
import TourOwner from "./panel/tour-detail/TourOwner";
import TourBookingCard from "./panel/tour-detail/TourBookingCard";

export default function TourDetailPage({ tour, ownerSlug }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [peopleCount, setPeopleCount] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // Helper functions
  const remainingSpots = tour.maxPeople
    ? Math.max(0, tour.maxPeople - 50)
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
      try {
        await navigator.share({
          title: tour.title,
          text: tour.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // toast here
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
      className="min-h-screen py-12 px-4"
    >
      {/* Header */}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-8">
            {/* Features */}
            <TourFeatures
              tour={tour}
              showAllFeatures={showAllFeatures}
              setShowAllFeatures={setShowAllFeatures}
            />

            {/* Schedule */}
            {tour.schedule?.length > 0 && <TourSchedule tour={tour} />}

            {/* Owner Profile */}
            <TourOwner tour={tour} />
          </motion.div>

          {/* Right Column - Booking Card */}
          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <TourBookingCard
              tour={tour}
              peopleCount={peopleCount}
              setPeopleCount={setPeopleCount}
              formatDate={formatDate}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
