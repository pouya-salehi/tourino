// src/app/(routes)/[slug]/panel/page.jsx
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
//components
import VerifyAlert from "@/components/modules/auth/VerifyAlert";

export default async function PanelPage({ params }) {
  const { slug } = await params;

  // middleware قبلاً چک کرده، نیازی به چک مجدد نیست
  // داده صاحب توور را بخوان
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.slug, slug))
    .limit(1);

  if (rows.length === 0) {
    return <div className="p-8">صاحب تور یافت نشد (404)</div>;
  }

  const owner = rows[0];

  return (
    <div className="flex justify-center flex-col items-center">
      {owner.verifyStatus !== "APPROVED" && <VerifyAlert owner={owner} />}
      {owner.verifyStatus === "APPROVED" && (
        <>
          <h1 className="text-2xl font-bold">
            پنل صاحب تور — {owner.title || owner.phone}
          </h1>
          <p className="mt-2 text-sm">خوش آمدی {owner.name || "صاحب تور"}</p>
        </>
      )}
    </div>
  );
}
