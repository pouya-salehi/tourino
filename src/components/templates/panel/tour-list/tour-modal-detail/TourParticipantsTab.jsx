// components/tours/modals/tour-modal-detail/tabs/TourParticipantsTab.jsx
import { Users, UserCheck, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
export default function TourParticipantsTab({ tourId }) {
  const participants = [
    { id: 1, name: "علی احمدی", status: "تأیید شده", joinDate: "۱۴۰۲/۱۰/۱۵" },
    { id: 2, name: "سارا محمدی", status: "در انتظار", joinDate: "۱۴۰۲/۱۰/۱۶" },
    { id: 3, name: "رضا کریمی", status: "تأیید شده", joinDate: "۱۴۰۲/۱۰/۱۴" },
    { id: 4, name: "مریم جعفری", status: "لغو شده", joinDate: "۱۴۰۲/۱۰/۱۳" },
  ];

  return (
    <ScrollArea className="h-100">
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* آمار */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">۱۲</div>
                <div className="text-sm text-gray-600">کل شرکت‌کنندگان</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">۸</div>
                <div className="text-sm text-gray-600">تأیید شده</div>
              </div>
            </div>
          </div>
        </div>

        {/* لیست شرکت‌کنندگان */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            لیست شرکت‌کنندگان
          </h3>

          <div className="space-y-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      {participant.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{participant.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      عضویت: {participant.joinDate}
                    </div>
                  </div>
                </div>

                <Badge
                  variant={
                    participant.status === "تأیید شده"
                      ? "success"
                      : participant.status === "در انتظار"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {participant.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
