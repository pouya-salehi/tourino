import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function TourSchedule({ tour }) {
  return (
    <Card className="shadow-xl rounded-4xl dark:bg-transparent dark:border">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-10 flex items-center gap-2 text-gray-500 dark:text-white">
          <Clock className="h-6 w-6" />
          برنامه سفر
        </h2>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute right-[14px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/40 via-primary/20 to-transparent dark:bg-gradient-to-b dark:from-white dark:via-white/80 dark:to-transparent" />

          <div className="space-y-10">
            {tour.schedule.map((day, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12, duration: 0.5 }}
                className="relative flex gap-6"
              >
                {/* Timeline Dot */}
                <div className="relative z-10">
                  <div className="h-8 w-8 rounded-full bg-background border-primary flex items-center justify-center shadow-md dark:border-white dark:bg-secondary">
                    <div className="h-4 w-4 rounded-full bg-radial-[at_50%_50%] from-primary/40 via-primary/20 to-transparent dark:from-white/80 dark:via-white60 dark:to-transparent" />
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1">
                  <div className="rounded-2xl border-none bg-gradient-to-l from-secondary via-secondary/90 to-transparent p-6 hover:shadow-md transition">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge className="text-sm px-3 py-1">روز {idx + 1}</Badge>

                      <h3 className="text-lg font-bold">
                        {day.title || `برنامه روز ${idx + 1}`}
                      </h3>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {day.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TourSchedule;
