"use client";
import { useToast } from "@/provider/ToastProvider";
export const toast = {
  success(msg, dur) {
    const t = window.__toast;
    return t?.success(msg, dur);
  },
  error(msg, dur) {
    const t = window.__toast;
    return t?.error(msg, dur);
  },
  warning(msg, dur) {
    const t = window.__toast;
    return t?.warning(msg, dur);
  },
  info(msg, dur) {
    const t = window.__toast;
    return t?.info(msg, dur);
  },
  loading(msg) {
    const t = window.__toast;
    return t?.loading(msg);
  },
  dismiss(id) {
    const t = window.__toast;
    return t?.dismiss(id);
  },
  update(id, type, msg) {
    const t = window.__toast;
    return t?.update(id, type, msg);
  },
};
