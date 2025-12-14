export default function ModalPreview({ form }) {
  return (
    <div
      className="w-full h-44 mt-6 border rounded-xl flex flex-col items-center justify-center text-white font-bold shadow-xl transition-all"
      style={{
        background:
          form.backgroundType === "image"
            ? `url(${form.backgroundValue}) center/cover`
            : form.backgroundValue,
      }}
    >
      <span className="text-2xl drop-shadow-lg">
        {form.couponPercentage
          ? `تخفیف ${form.couponPercentage}%`
          : "پیشنمایش درصد تخفیف"}
      </span>
      <span className="text-lg drop-shadow-md">
        {form.title || "پیشنمایش عنوان"}
      </span>
    </div>
  );
}
