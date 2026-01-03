import { Trash } from "lucide-react";

export default function ModalList({ modals, handleDelete }) {
  return (
    <div className="w-full mt-10 border-t-2 border-gray-300 pt-3">
      <h2 className="text-gray-600 font-bold mb-3">اطلاعیه‌های ثبت‌شده</h2>

      {modals.length === 0 && <p>هیچ اطلاعیه‌ای ثبت نشده</p>}

      <div className="space-y-3">
        {modals.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center text-gray-500 p-3 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <span className="font-bold text-gray-700 truncate w-48">
              {item.title}
            </span>

            <span className="flex flex-col text-gray-500 text-sm text-center">
              <em>تاریخ انقضا:</em>
              {new Date(item.expiresAt).toLocaleDateString("fa-IR")}
            </span>

            <span className="font-bold">{item.couponPercentage}% تخفیف</span>

            <button
              className="flex items-center gap-2 bg-rose-600 text-white p-2 rounded-md hover:bg-rose-700 transition"
              onClick={() => handleDelete(item._id)}
            >
              حذف <Trash className="" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
