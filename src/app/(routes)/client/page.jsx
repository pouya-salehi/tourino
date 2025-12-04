import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function ClientPage() {
  const cookieStore = await cookies(); // ✅ اضافه کردن await
  const token = cookieStore.get("token")?.value;

  let user = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      user = payload;
    } catch (error) {
      // توکن نامعتبر
      console.log("Invalid token");
    }
  }

  return (
    <div className="text-center py-4">
      <h1 className="text-2xl font-bold">پنل کاربری</h1>
      <p className="mt-3">خوش اومدی {user?.name || "کاربر عزیز"} 👋</p>
      <p className="text-gray-600 dark:text-white">شماره شما: {user?.phone}</p>
    </div>
  );
}
