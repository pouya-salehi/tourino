// src/db/schema.js
import {
  pgTable,
  varchar,
  integer,
  timestamp,
  pgEnum,
  text,
  serial,
  boolean,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "OWNER", "ADMIN"]);
export const verifyEnum = pgEnum("verify_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

// -------------------- USERS --------------------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  title: text("title"),

  phone: text("phone").notNull().unique(),
  name: text("name"),
  slug: text("slug").unique(),

  // پروفایل کامل شده؟
  profileCompleted: boolean("profile_completed").default(false),

  // اطلاعات مهم مالک تور
  nationalCode: text("national_code"),
  licenseNumber: text("license_number"),

  // عکس‌ها
  avatar: text("avatar"),
  city: text("city"),
  bio: text("bio"),

  // OTP Login
  otp: text("otp"),
  otpExpire: timestamp("otp_expire"),

  // نقش
  role: roleEnum("role").default("USER"),

  // وضعیت تایید مالک تور
  verifyStatus: verifyEnum("verify_status").default("PENDING"),
  rejectedReason: text("rejected_reason"), // علت رد شدن

  createdAt: timestamp("created_at").defaultNow(),
});

// -------------------- TOURS --------------------
export const tours = pgTable("tours", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  images: text("images").array(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  maxPeople: integer("max_people"),
  createdAt: timestamp("created_at").defaultNow(),
});

// -------------------- BOOKINGS --------------------
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  tourId: integer("tour_id")
    .references(() => tours.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  people: integer("people"),
  price: integer("price"),
  status: text("status").default("PENDING"),
  createdAt: timestamp("created_at").defaultNow(),
});

// -------------------- VERIFICATION DOCUMENTS --------------------
export const verificationDocuments = pgTable("verification_documents", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id")
    .references(() => users.id)
    .notNull(),

  // پرونده مالک تور
  licenseImage: text("license_image").notNull(),
  nationalCard: text("national_card").notNull(),

  status: verifyEnum("verify_status").default("PENDING"),
  adminNote: text("admin_note"),

  createdAt: timestamp("created_at").defaultNow(),
});
