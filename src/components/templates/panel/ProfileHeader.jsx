// components/modules/profile/ProfileHeader.jsx
"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  MapPin,
  Calendar,
  Phone,
  CheckCircle,
  ShieldCheck,
  ShieldBan,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
export default function ProfileHeader({ profile, tours }) {
  return (
    <div className="rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* آواتار (مثل تلگرام) */}
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
            {profile.avatar ? (
              <AvatarImage
                src={profile.avatar}
                alt={profile.name}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white text-4xl font-bold">
              {profile.initials}
            </AvatarFallback>
          </Avatar>

          {/* بج verified */}
          {profile.isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full border-4 border-white shadow-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* اطلاعات */}
        <div className="flex-1 text-center md:text-right">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {profile.name}
              </h1>

              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <span className="text-gray-600 dark:text-white">
                  {profile.slug}@
                </span>

                {profile.role === "OWNER" && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:text-white">
                    <Shield className="w-3 h-3 ml-1 " />
                    صاحب تور
                  </Badge>
                )}

                {profile.isPending && (
                  <Badge
                    variant="outline"
                    className="border-yellow-300 text-yellow-700"
                  >
                    در انتظار تأیید
                  </Badge>
                )}
              </div>
            </div>

            {/* اطلاعات تماس */}
            <div className="flex flex-col gap-2">
              <ul className="flex gap-4 mt-4 h-5 items-center justify-center space-x-1 text-sm">
                <li className="flex flex-col items-center">
                  <span>دنبال کننده ها</span>
                  <span>0</span>
                </li>
                <Separator orientation="vertical" />
                <li className="flex flex-col items-center">
                  <span>تعداد تورها</span>
                  <strong className="text-gray-600 dark:text-white">
                    {tours.length}
                  </strong>
                </li>
              </ul>
            </div>
          </div>

          {/* بیوگرافی */}
          {profile.bio && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-700 text-center md:text-right leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
