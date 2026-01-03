// components/modules/owner/clients/tabs/ClientProfileTab.jsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Shield,
  IdCard,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";

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

export default function ClientProfileTab({ client }) {
  return (
    <div className="space-y-4">
      {/* اطلاعات اصلی */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            اطلاعات اصلی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IdCard className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">نام کامل:</span>
              </div>
              <p className="text-lg font-semibold">{client.name}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">شماره تماس:</span>
              </div>
              <p className="text-lg font-semibold">{client.phone}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">ایمیل:</span>
              </div>
              <p className="text-lg font-semibold">{client.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">کد ملی:</span>
              </div>
              <p className="text-lg font-semibold">{client.nationalCode}</p>
            </div>
          </div>

          <Separator />

          {/* وضعیت */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">وضعیت احراز هویت:</span>
            </div>
            <Badge
              className={`px-3 py-1 ${getStatusColor(client.verifyStatus)}`}
            >
              {getStatusText(client.verifyStatus)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* اطلاعات تکمیلی */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            اطلاعات زمانی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">تاریخ عضویت:</span>
              </div>
              <p className="text-sm">
                {client.createdAt
                  ? format(new Date(client.createdAt), "PPP", { locale: faIR })
                  : "--"}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">آخرین به‌روزرسانی:</span>
              </div>
              <p className="text-sm">
                {client.updatedAt
                  ? format(new Date(client.updatedAt), "PPP", { locale: faIR })
                  : "--"}
              </p>
            </div>
          </div>

          {client.lastLogin && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">آخرین ورود:</span>
              </div>
              <p className="text-sm">
                {format(new Date(client.lastLogin), "PPP HH:mm", {
                  locale: faIR,
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* اطلاعات تماس اضطراری */}
      {client.emergencyContact && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              تماس اضطراری
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">نام:</span>{" "}
                {client.emergencyContact.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">نسبت:</span>{" "}
                {client.emergencyContact.relation}
              </p>
              <p className="text-sm">
                <span className="font-medium">تلفن:</span>{" "}
                {client.emergencyContact.phone}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
