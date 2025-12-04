// src/lib/phone.js
export function normalizePhone(phone = "") {
  if (!phone) return "";
  // remove spaces, +, -, ()
  let p = phone.toString().replace(/\s+/g, "");
  p = p.replace(/\+/g, "");
  // if starts with 98 -> convert to 0xxxx
  if (p.startsWith("98") && p.length >= 11) {
    p = "0" + p.slice(2);
  }
  // ensure leading 0 for iran numbers
  if (p.length === 10 && !p.startsWith("0")) {
    p = "0" + p;
  }
  return p;
}
