"use client";
import { useState, useEffect } from "react";
// toast
import { toast } from "@/components/toast";
//modules
import ModalForm from "./ModalForm";
import ModalPreview from "./ModalPreview";
import ModalList from "./ModalList";
//ui 
import { Button } from "@/components/ui/button";
export default function AddModalPage() {
  const [loader, setLoader] = useState(false);
  const [modals, setModals] = useState([]);

  const [form, setForm] = useState({
    title: "",
    couponPercentage: 0,
    expiresAt: "",
    backgroundType: "solid",
    backgroundValue: "",
    animation: "fade",
  });

  const bgColors = [
    { title: "Gradient", value: "linear-gradient(135deg,#ff6ec7,#4facfe)" },
    { title: "Neon Glow", value: "radial-gradient(circle,#ff00cc,#333399)" },
    { title: "Glass", value: "rgba(255,255,255,0.1)" },
  ];

  async function fetchModals() {
    try {
      const res = await fetch("/api/owner/modals");
      const data = await res.json();
      if (data.status === "success") setModals(data.data);
    } catch {
      toast.error("خطا در دریافت اطلاعیه‌ها");
    }
  }

  useEffect(() => {
    fetchModals();
  }, []);

  async function handleSubmit() {
    if (!form.title || !form.expiresAt || !form.backgroundValue) {
      toast.error("لطفا همه فیلدها را پر کنید");
      return;
    }

    setLoader(true);

    try {
      const res = await fetch("/api/owner/modals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success("اطلاعیه ذخیره شد!");

        setForm({
          title: "",
          couponPercentage: 0,
          expiresAt: "",
          backgroundType: "solid",
          backgroundValue: "",
          animation: "fade",
        });

        fetchModals();
      }
    } finally {
      setLoader(false);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/owner/modals/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("حذف شد!");
        fetchModals();
      }
    } catch {
      toast.error("خطا در حذف");
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-2xl font-extrabold text-gray-700 mt-3">
        ساخت اطلاعیه جدید
      </h3>

      <ModalForm form={form} setForm={setForm} bgColors={bgColors} />

      <ModalPreview form={form} />

      {/* دکمه */}
      <Button
        disabled={loader}
        onClick={handleSubmit}
        className="text-white px-6 py-2 rounded-lg mt-6 hover:bg-emerald-700 transition ease-in-out w-full"
      >
        {loader ? "در حال ذخیره..." : "ثبت اطلاعیه"}
      </Button>

      <ModalList modals={modals} handleDelete={handleDelete} />
    </div>
  );
}
