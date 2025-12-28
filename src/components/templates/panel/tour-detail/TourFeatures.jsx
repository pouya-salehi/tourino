import { motion } from "framer-motion";
import { Check, Package, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function TourFeatures({ tour, showAllFeatures, setShowAllFeatures }) {
  return (
    <div className="min-h-86 shadow-xl rounded-4xl p-4 dark:border">
      <h2 className="text-2xl font-bold  py-6 flex items-center gap-2 text-gray-500 dark:text-white">
        <Sparkles />
        امکانات و خدمات تور
      </h2>

      <Accordion
        type="multiple"
        defaultValue={["features"]}
        className="w-full space-y-4"
      >
        {/* امکانات تور */}
        <AccordionItem value="features" className="border rounded-2xl px-4">
          <AccordionTrigger className="text-lg font-semibold cursor-pointer">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              امکانات تور
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
              {tour.features
                ?.slice(0, showAllFeatures ? undefined : 6)
                .map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-muted/70 transition dark:bg-black/10"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray/50 shadow flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </motion.div>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="includes" className="border rounded-2xl px-4 ">
          <AccordionTrigger className="text-lg font-semibold cursor-pointer">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              شامل می‌شود
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tour.includes
                ?.slice(0, showAllFeatures ? undefined : 6)
                .map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-muted/70 transition dark:bg-black/10"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray/50 shadow flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </motion.div>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default TourFeatures;
