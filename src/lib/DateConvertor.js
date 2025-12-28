// utils/DateConvertor.js
export function DateConvertor(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now - date; // تفاوت به میلی‌ثانیه
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSeconds < 60) {
    return "لحظاتی پیش";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} دقیقه پیش`;
  }

  if (diffHours < 24) {
    return `${diffHours} ساعت پیش`;
  }

  if (diffDays < 7) {
    return `${diffDays} روز پیش`;
  }

  if (diffWeeks < 4) {
    return `${diffWeeks} هفته پیش`;
  }

  // اگر بیشتر از یک ماه گذشته بود، تاریخ کامل را نمایش بده
  return date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
