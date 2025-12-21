// components/panel/tour-detail/TourSchedule.jsx
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function TourSchedule({ tour }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Clock className="h-6 w-6 text-blue-500" />
          برنامه سفر
        </h2>

        <div className="space-y-6">
          {tour.schedule.map((day, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-8 pb-6 border-r-2 border-dashed border-gray-200 last:border-none"
            >
              <div className="absolute -right-2.5 top-0 h-5 w-5 rounded-full bg-primary border-4 border-white" />
              <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="outline" className="text-lg px-4 py-1">
                    روز {idx + 1}
                  </Badge>
                  <h3 className="font-bold text-lg">
                    {day.title || `روز ${idx + 1}`}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {day.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TourSchedule;
