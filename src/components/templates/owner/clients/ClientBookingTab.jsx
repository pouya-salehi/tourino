// components/modules/owner/clients/tabs/ClientDocumentsTab.jsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import {
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";

const DocumentViewer = ({ document, onClose }) => {
  const getFileUrl = (fileKey) => {
    return `/api/owner/files/${fileKey}`;
  };

  return (
    <Dialog open={!!document} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>مشاهده مدرک</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {document && (
            <div className="space-y-4">
              <p className="font-medium">{document.name}</p>
              {document.type?.startsWith("image/") ? (
                <img
                  src={getFileUrl(document.fileKey)}
                  alt={document.name}
                  className="w-full h-auto rounded-lg border"
                />
              ) : (
                <div className="border rounded-lg p-8 text-center">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    پیش‌نمایش فایل PDF در دسترس نیست
                  </p>
                  <a
                    href={getFileUrl(document.fileKey)}
                    download
                    className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800"
                  >
                    <Download className="h-4 w-4" />
                    دانلود فایل
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function ClientDocumentsTab({ client, onStatusChange }) {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // اینجا باید documents از API بیاد - فعلاً نمونه
  const documents = client.documents || [];

  const handleActionClick = (type) => {
    setActionType(type);
    setIsActionDialogOpen(true);
  };

  const handleSubmitAction = async () => {
    if (actionType === "reject" && rejectionNote.trim().length < 10) {
      toast.error("لطفاً دلیل رد را به طور کامل وارد کنید (حداقل ۱۰ کاراکتر)");
      return;
    }

    setIsSubmitting(true);
    try {
      await onStatusChange(
        actionType,
        actionType === "reject" ? rejectionNote : ""
      );
      toast.success(
        actionType === "approve"
          ? "مدارک با موفقیت تایید شد"
          : "مدارک با موفقیت رد شد"
      );
      setIsActionDialogOpen(false);
      setRejectionNote("");
    } catch (error) {
      toast.error(error.message || "خطا در انجام عملیات");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      APPROVED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      REJECTED: { color: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      icon: FileText,
    };
    const Icon = config.icon;

    return (
      <Badge className={`flex items-center gap-1 px-2 py-1 ${config.color}`}>
        <Icon className="h-3 w-3" />
        {status === "APPROVED"
          ? "تایید شده"
          : status === "PENDING"
          ? "در حال بررسی"
          : status === "REJECTED"
          ? "رد شده"
          : "نامشخص"}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* وضعیت فعلی و دکمه‌های اقدام */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">وضعیت فعلی احراز هویت</h3>
              {getStatusBadge(client.verifyStatus)}
              {client.verifyStatus === "PENDING" && (
                <p className="text-sm text-yellow-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  منتظر بررسی مدارک
                </p>
              )}
            </div>

            {client.verifyStatus === "PENDING" && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleActionClick("approve")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="ml-2 h-4 w-4" />
                  تایید مدارک
                </Button>
                <Button
                  onClick={() => handleActionClick("reject")}
                  variant="destructive"
                >
                  <XCircle className="ml-2 h-4 w-4" />
                  رد مدارک
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* لیست مدارک */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            مدارک ارسالی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>هنوز مدرکی ارسال نشده است</p>
              </div>
            ) : (
              documents.map((doc, index) => (
                <Card key={doc.id || index} className="border">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <h4 className="font-medium">
                            مدرک شماره {index + 1}
                          </h4>
                          {getStatusBadge(doc.status)}
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          {doc.createdAt && (
                            <p>
                              <span className="font-medium">تاریخ ارسال:</span>{" "}
                              {format(new Date(doc.createdAt), "PPP HH:mm", {
                                locale: faIR,
                              })}
                            </p>
                          )}
                          {doc.reviewedAt && (
                            <p>
                              <span className="font-medium">تاریخ بررسی:</span>{" "}
                              {format(new Date(doc.reviewedAt), "PPP HH:mm", {
                                locale: faIR,
                              })}
                            </p>
                          )}
                          {doc.adminNote && (
                            <p>
                              <span className="font-medium">توضیحات:</span>{" "}
                              {doc.adminNote}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedDocument(doc)}
                        >
                          <Eye className="ml-2 h-4 w-4" />
                          مشاهده
                        </Button>
                        <a
                          href={`/api/owner/files/${doc.fileKey}`}
                          download
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
                        >
                          <Download className="h-4 w-4" />
                          دانلود
                        </a>
                      </div>
                    </div>

                    {/* لیست فایل‌ها */}
                    {doc.files && doc.files.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="text-sm font-medium mb-2">فایل‌ها:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {doc.files.map((file, fileIndex) => (
                            <div
                              key={fileIndex}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-3 w-3 text-gray-500" />
                                <span className="text-sm">{file.name}</span>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setSelectedDocument(file)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <a
                                  href={`/api/owner/files/${file.fileKey}`}
                                  download
                                  className="p-1"
                                >
                                  <Download className="h-3 w-3 text-gray-500" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* دیالوگ اقدام */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "تایید مدارک" : "رد مدارک"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "آیا از تایید مدارک این کاربر اطمینان دارید؟"
                : "لطفاً دلیل رد مدارک را وارد کنید:"}
            </DialogDescription>
          </DialogHeader>

          {actionType === "reject" && (
            <div className="mt-4">
              <Textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="مثال: تصویر کارت ملی خوانا نیست، تاریخ پروانه کسب منقضی شده است، ..."
                className="min-h-[100px]"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                حداقل ۱۰ کاراکتر - این توضیح برای کاربر نمایش داده می‌شود
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsActionDialogOpen(false)}
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button
              onClick={handleSubmitAction}
              disabled={
                isSubmitting ||
                (actionType === "reject" && rejectionNote.trim().length < 10)
              }
              className={
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent ml-2" />
                  در حال انجام...
                </>
              ) : actionType === "approve" ? (
                <>
                  <CheckCircle className="ml-2 h-4 w-4" />
                  تایید مدارک
                </>
              ) : (
                <>
                  <XCircle className="ml-2 h-4 w-4" />
                  رد مدارک
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ویور مدارک */}
      <DocumentViewer
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </div>
  );
}
