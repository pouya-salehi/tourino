"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ToastContext = createContext(null);

export const toastTypes = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  LOADING: "loading",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const show = useCallback(
    (message, type = toastTypes.INFO, duration = 3000) => {
      const id = Math.random().toString(36).slice(2);

      setToasts((prev) => [...prev, { id, message, type }]);

      if (type !== toastTypes.LOADING) {
        setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    []
  );

  const update = (id, newType, newMessage) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, type: newType, message: newMessage } : t
      )
    );
    setTimeout(() => removeToast(id), 2000);
  };

  const api = {
    success: (msg, dur) => show(msg, toastTypes.SUCCESS, dur),
    error: (msg, dur) => show(msg, toastTypes.ERROR, dur),
    warning: (msg, dur) => show(msg, toastTypes.WARNING, dur),
    info: (msg, dur) => show(msg, toastTypes.INFO, dur),
    loading: (msg) => show(msg, toastTypes.LOADING, 999999),
    dismiss: removeToast,
    update,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.25 }}
              className={`
                min-w-[250px] max-w-[300px] text-white px-4 py-3 rounded-xl shadow-lg border
                backdrop-blur-md flex items-center gap-3
                ${t.type === "success" && "bg-green-600/80 border-green-400/40"}
                ${t.type === "error" && "bg-red-600/80 border-red-400/40"}
                ${
                  t.type === "warning" &&
                  "bg-yellow-600/80 border-yellow-400/40"
                }
                ${t.type === "info" && "bg-blue-600/80 border-blue-400/40"}
                ${t.type === "loading" && "bg-gray-700/80 border-gray-500/40"}
              `}
            >
              {/* ICONS */}
              <div>
                {t.type === "success" && <span>✅</span>}
                {t.type === "error" && <span>❌</span>}
                {t.type === "warning" && <span>⚠️</span>}
                {t.type === "info" && <span>ℹ️</span>}
                {t.type === "loading" && (
                  <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                )}
              </div>

              <p className="text-sm">{t.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
