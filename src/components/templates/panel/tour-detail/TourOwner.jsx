// components/panel/tour-detail/TourOwner.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Instagram } from "lucide-react";

function TourOwner({ tour }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
            {tour.owner?.avatar ? (
              <AvatarImage
                src={tour.owner.avatar}
                alt={tour.owner.name}
              />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-2xl">
              {tour.owner?.name?.[0] || "T"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold">{tour.owner?.name}</h3>
                <p className="text-gray-500">@{tour.owner?.slug}</p>
              </div>

              <Badge
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
            </div>

            <p className="text-gray-600 mb-4">
              {tour.owner?.bio ||
                "تورلیدر با تجربه و دارای مجوز گردشگری"}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 ml-2" />
                تماس
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 ml-2" />
                پیام
              </Button>
              <Button variant="outline" size="sm">
                <Instagram className="h-4 w-4 ml-2" />
                اینستاگرام
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TourOwner;