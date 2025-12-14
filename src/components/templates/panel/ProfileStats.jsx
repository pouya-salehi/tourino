// components/modules/profile/ProfileStats.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, Star, Calendar, Shield, Award } from "lucide-react";

export default function ProfileStats({ profile, toursCount }) {
  const stats = [
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "تورها",
      value: toursCount,
      color: "from-blue-500 to-cyan-500",
      description: "تور فعال",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "اعتبار",
      value: profile.isVerified ? "تأیید شده" : "در انتظار",
      color: "from-green-500 to-emerald-500",
      description: "وضعیت احراز هویت",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "عضویت",
      value: profile.joinDate?.split(" ")[0] || "نامشخص",
      color: "from-purple-500 to-pink-500",
      description: "سال شروع فعالیت",
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: "پروفایل",
      value: profile.profileCompleted ? "تکمیل شده" : "ناقص",
      color: "from-orange-500 to-red-500",
      description: "وضعیت پروفایل",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className={`h-2 bg-gradient-to-r ${stat.color}`} />
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-10`}
              >
                <div
                  className={
                    stat.color.includes("blue")
                      ? "text-blue-600"
                      : stat.color.includes("green")
                      ? "text-green-600"
                      : stat.color.includes("purple")
                      ? "text-purple-600"
                      : "text-orange-600"
                  }
                >
                  {stat.icon}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
