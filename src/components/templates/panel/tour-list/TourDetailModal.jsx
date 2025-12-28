// components/tours/modals/TourDetailsModal.jsx
"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TourModalDetailTabs from "./tour-modal-detail/TourModalDetailTabs";
import TourInfoTab from "./tour-modal-detail/TourInfoTab";
import TourCommentsTab from "./tour-modal-detail/TourCommentsTab";
import TourDetailsTab from "./tour-modal-detail/TourDetails";
import TourParticipantsTab from "./tour-modal-detail/TourParticipantsTab";

export default function TourDetailsModal({ tour, open, onOpenChange }) {
  if (!tour) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] overflow-hidden p-8">
        <div className="flex flex-col h-full mt-4">
          <DialogTitle>
            جزئیات{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mr-2">
              {tour.slug}
            </span>
          </DialogTitle>
          {/* تب‌ها */}
          <div className="px-6 pt-4">
            <Tabs defaultValue="info" className="w-full">
              <TourModalDetailTabs />

              <div className="overflow-y-auto max-h-[60vh] px-1 pb-6">
                <TabsContent value="info" className="mt-0">
                  <TourInfoTab tour={tour} />
                </TabsContent>

                <TabsContent value="details" className="mt-0">
                  <TourDetailsTab tour={tour} />
                </TabsContent>

                <TabsContent value="comments" className="mt-0">
                  <TourCommentsTab tourId={tour.id} />
                </TabsContent>

                <TabsContent value="participants" className="mt-0">
                  <TourParticipantsTab tourId={tour.id} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
