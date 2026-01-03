// components/modules/owner/clients/tabs/ClientStatisticsTab.jsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Calendar, TrendingUp, Activity } from "lucide-react";

const formatPrice = (price) => {
  return new Intl.NumberFormat("fa-IR").format(price || 0) + " تومان";
};

export default function ClientStatisticsTab({ client, bookings = [] }) {
  // محاسبه آمار واقعی از bookings
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length;
  const cancelledBookings = bookings.filter(
    (b) => b.status === "CANCELLED"
  ).length;
  const totalSpent = bookings.reduce(
    (sum, b) => sum + (parseFloat(b.totalPrice) || 0),
    0
  );
  const avgBookingPrice = totalBookings > 0 ? totalSpent / totalBookings : 0;

  // اگر booking نداره، پیام نمایش بده
  if (totalBookings === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">
            هنوز توری رزرو نکرده
          </h3>
          <p className="text-gray-500 mt-2">
            این کاربر تاکنون هیچ توری از شما رزرو نکرده است
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* آمار کلیدی */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">کل هزینه‌ها</p>
                <p className="text-2xl font-bold">{formatPrice(totalSpent)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">تعداد تورها</p>
                <p className="text-2xl font-bold">{totalBookings} تور</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">میانگین هزینه هر تور</p>
                <p className="text-2xl font-bold">
                  {formatPrice(avgBookingPrice)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">نرخ تکمیل</p>
                <p className="text-2xl font-bold">
                  {Math.round((completedBookings / totalBookings) * 100)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول آمار */}
      <Card>
        <CardHeader>
          <CardTitle>جزئیات آماری</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">معیار</th>
                  <th className="text-right py-3 px-4">مقدار</th>
                  <th className="text-right py-3 px-4">درصد</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">تورهای تکمیل شده</td>
                  <td className="py-3 px-4 font-medium">
                    {completedBookings} از {totalBookings}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (completedBookings / totalBookings) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span>
                        {Math.round((completedBookings / totalBookings) * 100)}٪
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">تورهای لغو شده</td>
                  <td className="py-3 px-4 font-medium">{cancelledBookings}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (cancelledBookings / totalBookings) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span>
                        {Math.round((cancelledBookings / totalBookings) * 100)}٪
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">میانگین هزینه</td>
                  <td className="py-3 px-4 font-medium">
                    {formatPrice(avgBookingPrice)}
                  </td>
                  <td className="py-3 px-4">--</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
