// components/panel/tour-detail/TourFeatures.jsx
import { motion } from "framer-motion";
import { CheckCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function TourFeatures({ tour, showAllFeatures, setShowAllFeatures }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-emerald-500" />
          امکانات و خدمات
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tour.features
            ?.slice(0, showAllFeatures ? undefined : 6)
            .map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 transition-all"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{feature}</span>
              </motion.div>
            ))}
        </div>

        {tour.features?.length > 6 && (
          <Button
            variant="ghost"
            className="mt-6 w-full"
            onClick={() => setShowAllFeatures(!showAllFeatures)}
          >
            {showAllFeatures ? "نمایش کمتر" : "نمایش همه امکانات"}
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                showAllFeatures ? "rotate-90" : ""
              }`}
            />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default TourFeatures;
