import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Instagram } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import TourActions from "./TourActions";
import ImageContainer from "./ImageContainer";
function TourHeader({ tour, handleShare, isLiked, setIsLiked }) {
  const ownerSlug = tour.owner?.slug;

  return (
    <motion.section
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative h-[80vh] rounded-md md:rounded-4xl overflow-hidden shadow-xl"
    >
      <ImageContainer images={tour.images} />
      <motion.section
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
      </motion.section>

      <div className="absolute top-0 right-0 p-2 md:p-12">
        <TourActions
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          handleShare={handleShare}
          tour={tour}
        />
      </div>

      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute block md:hidden p-2 bottom-30 ring-0 text-white"
      >
        <h1 className="text-3xl md:text-6xl font-black mb-2 md:mb-4">
          {tour.title}
        </h1>
        <div className="flex items-center gap-2 text-white/80">
          <MapPin className="hidden md:block" size={32} />
          مکان:
          {tour.location}
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute hidden md:block p-2 bottom-20 md:bottom-12 md:left-12 text-white"
      >
        <h1 className="text-3xl md:text-6xl font-black mb-2 md:mb-4">
          {tour.title}
        </h1>
        <div className="flex items-center gap-2 text-white/80">
          <MapPin className="hidden md:block" size={32} />
          مکان:
          {tour.location}
        </div>
      </motion.div>
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 p-2 md:p-12 bg-gradient-to-r from-black/20 via-black/10 to-transparent text-white"
      >
        <Link
          className="flex items-center gap-2"
          href={`/${encodeURIComponent(ownerSlug)}`}
        >
          <p className="text-white flex flex-col gap-2">
            <Badge
              className="bg-black/40 text-white"
              variant={
                tour.owner?.verifyStatus === "APPROVED"
                  ? "success"
                  : "secondary"
              }
            >
              {tour.owner?.verifyStatus === "APPROVED"
                ? "✅ تأیید شده"
                : "در انتظار تأیید"}
            </Badge>
            {tour.owner?.slug}@
          </p>
          <Avatar className="w-14 h-14 md:h-20 md:w-20 border-2 border-white shadow-lg">
            {tour.owner?.avatar ? (
              <AvatarImage src={tour.owner.avatar} alt={tour.owner.name} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-r from-indigo-500/50 to-purple-500/50  backdrop-blur-xl text-2xl">
              {tour.owner?.name?.[0] || "T"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </motion.div>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-8 right-0 p-2 md:p-12 bg-gradient-to-l from-black/20 via-black/10 to-transparent text-white"
      >
        <div>
          <p className="text-white mb-4">
            {tour.owner?.bio || "تورلیدر با تجربه و دارای مجوز گردشگری"}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white"
            >
              <Phone className="h-4 w-4 ml-2" />
              تماس
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white"
            >
              <MessageCircle className="h-4 w-4 ml-2" />
              پیام
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white"
            >
              <Instagram className="h-4 w-4 ml-2" />
              اینستاگرام
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default TourHeader;
