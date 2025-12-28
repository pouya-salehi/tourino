import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import TourActions from "./TourActions";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Instagram } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function TourHeader({ tour, handleShare, isLiked, setIsLiked }) {
  const ownerSlug = tour.owner?.slug;

  return (
    <motion.section
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative h-[80vh] rounded-[40px] overflow-hidden shadow-xl"
    >
      <motion.div
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.02 },
        }}
        transition={{
          duration: 1,
          ease: [0.19, 1, 0.22, 1],
        }}
        className="absolute inset-0"
      >
        <img
          src={tour.images?.[0]}
          className="inset-0 w-full h-full object-cover scale-110 shadow-xl"
        />
      </motion.div>
      <motion.section
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
      </motion.section>

      <div className="absolute top-0 right-0 p-12">
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
        className="absolute bottom-12 left-12 text-white"
      >
        <h1 className="text-6xl font-black mb-4">{tour.title}</h1>
        <div className="flex items-center gap-2 text-white/80">
          <MapPin size={32} />
          مکان:
          {tour.location}
        </div>
      </motion.div>
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 p-12 bg-gradient-to-r from-black/20 via-black/10 to-transparent text-white"
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
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
            {tour.owner?.avatar ? (
              <AvatarImage src={tour.owner.avatar} alt={tour.owner.name} />
            ) : null}
            <AvatarFallback className="bg-black/50 backdrop-blur-xl text-2xl">
              {tour.owner?.name?.[0] || "T"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </motion.div>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-0 right-0 p-12 bg-gradient-to-l from-black/20 via-black/10 to-transparent text-white"
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
