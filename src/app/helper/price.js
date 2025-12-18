// lib/helpers/price.ts

/**
 * تبدیل عدد به رقم فارسی با جداکننده
 */
export function formatPriceFa(value) {
  if (!value) return "";

  const number = Number(value);
  if (isNaN(number)) return "";

  return number.toLocaleString("fa-IR").replace(/٬/g, ","); // برای سازگاری بهتر
}

/**
 * تبدیل عدد به حروف فارسی (تا میلیارد)
 */
export function numberToPersianWords(num) {
  if (num === 0) return "صفر";

  const ones = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];

  const tens = [
    "",
    "ده",
    "بیست",
    "سی",
    "چهل",
    "پنجاه",
    "شصت",
    "هفتاد",
    "هشتاد",
    "نود",
  ];

  const teens = [
    "ده",
    "یازده",
    "دوازده",
    "سیزده",
    "چهارده",
    "پانزده",
    "شانزده",
    "هفده",
    "هجده",
    "نوزده",
  ];

  const hundreds = [
    "",
    "صد",
    "دویست",
    "سیصد",
    "چهارصد",
    "پانصد",
    "ششصد",
    "هفتصد",
    "هشتصد",
    "نهصد",
  ];

  const units = ["", "هزار", "میلیون", "میلیارد"];

  const chunk = (n) => {
    let result = "";
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const o = n % 10;

    if (h) result += hundreds[h] + " ";

    if (t === 1) {
      result += teens[o] + " ";
    } else {
      if (t > 1) result += tens[t] + " ";
      if (o) result += ones[o] + " ";
    }

    return result.trim();
  };

  let result = "";
  let unitIndex = 0;

  while (num > 0) {
    const part = num % 1000;
    if (part) {
      result =
        chunk(part) +
        (units[unitIndex] ? " " + units[unitIndex] : "") +
        " " +
        result;
    }
    num = Math.floor(num / 1000);
    unitIndex++;
  }

  return result.trim();
}

/**
 * خروجی نهایی مناسب UI
 */
export function formatPriceForUI(value) {
  const number = Number(value);
  if (!number || isNaN(number)) return null;

  return {
    numeric: `${formatPriceFa(number)} تومان`,
    words: `${numberToPersianWords(number)} تومان`,
  };
}
