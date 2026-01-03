// components/modules/owner/clients/ClientTabs.jsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ClientProfileTab from "./ClientProfileTab";
import ClientDocumentsTab from "./ClientDocumentTab";
import ClientBookingsTab from "./ClientBookingTab"
import ClientStatisticsTab from "./ClientStaticsTab";

export default function ClientTabs({ client, onStatusChange, onClose }) {
  const [activeTab, setActiveTab] = useState("profile");

  const handleStatusChange = async (action, note = "") => {
    try {
      const response = await onStatusChange(action, note);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{client.name}</h2>
          <p className="text-sm text-gray-500">
            {client.email} • {client.phone}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="profile">پروفایل</TabsTrigger>
          <TabsTrigger value="documents">مدارک</TabsTrigger>
          <TabsTrigger value="bookings">تورها</TabsTrigger>
          <TabsTrigger value="stats">آمار</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ClientProfileTab client={client} />
        </TabsContent>

        <TabsContent value="documents">
          <ClientDocumentsTab 
            client={client} 
            onStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="bookings">
          <ClientBookingsTab client={client} />
        </TabsContent>

        <TabsContent value="stats">
          <ClientStatisticsTab client={client} />
        </TabsContent>
      </Tabs>
    </div>
  );
}