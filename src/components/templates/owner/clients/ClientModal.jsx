// components/modules/owner/clients/ClientModal.jsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import ClientTabs from "./ClientTabs";
import { Loader2 } from "lucide-react";

export default function ClientModal({ open, onClose, clientId }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && clientId) {
      fetchClientDetails();
    }
  }, [open, clientId]);

  const fetchClientDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/owner/clients/${clientId}`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "خطا در دریافت اطلاعات");
      }

      setClient(data.data);
    } catch (error) {
      toast.error(error.message);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (action, note = "") => {
    try {
      const response = await fetch(`/api/owner/clients/${clientId}/verify`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          note: action === "reject" ? note : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "خطا در انجام عملیات");
      }

      // آپدیت وضعیت کاربر
      setClient((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          verifyStatus: data.data.newStatus,
        },
      }));

      return data;
    } catch (error) {
      throw error;
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : client ? (
          <ClientTabs
            client={client.user || client}
            documents={client.documents}
            bookings={client.bookings}
            onStatusChange={handleStatusChange}
            onClose={onClose}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">اطلاعات کاربر یافت نشد</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
