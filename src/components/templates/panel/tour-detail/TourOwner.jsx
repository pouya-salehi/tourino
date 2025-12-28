// components/panel/tour-detail/TourOwner.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";


function TourOwner({ tour }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          

          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold">{tour.owner?.name}</h3>
                
              </div>

              
            </div>

            <p className="text-gray-600 mb-4">
              {tour.owner?.bio ||
                "تورلیدر با تجربه و دارای مجوز گردشگری"}
            </p>

            
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TourOwner;