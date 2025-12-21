import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Share2, Bookmark } from "lucide-react";
function TourActions({ handleShare, isLiked, setIsLiked }) {
  return (
    <div className=" flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-white/20 text-white"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>اشتراک‌گذاری</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm hover:bg-white/20 text-white"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Bookmark
                className={`h-5 w-5 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isLiked ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default TourActions;
