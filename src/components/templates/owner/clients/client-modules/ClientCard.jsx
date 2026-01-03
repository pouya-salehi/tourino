// components/modules/owner/clients/client-modules/ClientCard.jsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Calendar, View } from "lucide-react";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import Link from "next/link";
const getStatusColor = (status) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "APPROVED":
      return "تایید شده";
    case "PENDING":
      return "در حال بررسی";
    case "REJECTED":
      return "رد شده";
    default:
      return "ثبت‌نشده";
  }
};

export default function ClientCard({ client, onViewDetails }) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between flex-col md:flex-row">
        <div className="flex items-center flex-col md:flex-row gap-4">
          {/* آواتار */}
          <div className="relative">
            {client.avatar ? (
              <img
                src={client.avatar}
                alt={client.name || "کاربر"}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            )}
          </div>

          {/* اطلاعات */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 justify-between md:justify-start">
              <h3 className="font-semibold text-lg">
                {client.name || "بدون نام"}
              </h3>
              <Badge className={getStatusColor(client.verifyStatus)}>
                {getStatusText(client.verifyStatus)}
              </Badge>
            </div>

            <div className="flex items-center gap-16 md:gap-4 text-sm text-gray-600">
              {client.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{client.phone}</span>
                </div>
              )}

              {client.nationalCode && (
                <div className="flex items-center gap-1">
                  <span>کد ملی: {client.nationalCode}</span>
                </div>
              )}

              {client.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    عضویت:{" "}
                    {format(new Date(client.createdAt), "yyyy/MM/dd", {
                      locale: faIR,
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* اسلاگ */}
            {client.slug && (
              <div className="text-xs text-gray-500">
                شناسه:
                <Link href={`/${client.slug}`}>{client.slug}@</Link>
              </div>
            )}
          </div>
        </div>

        {/* دکمه‌ها */}
        <div>
          <Button
            onClick={onViewDetails}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 mt-2 dark:text-white border-none md:border"
          >
            <View className="h-4 w-4" />
            مشاهده جزئیات
          </Button>
        </div>
      </div>
    </Card>
  );
}
