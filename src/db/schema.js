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
//For Modal announcement modal
export const modalBackgroundEnum = pgEnum("modal_background", [
  "solid",
  "gradient",
  "image",
]);

export const modalAnimationEnum = pgEnum("modal_animation", [
  "fade",
  "slide-up",
  "slide-down",
  "zoom-in",
]);
// -------------------- MODALS --------------------
export const modals = pgTable("modals", {
  id: serial("id").primaryKey(),

  title: text("title").notNull(),
  couponPercentage: integer("coupon_percentage").default(0),

  expiresAt: timestamp("expires_at").notNull(),

  backgroundType: modalBackgroundEnum("background_type").default("solid"),
  backgroundValue: text("background_value").notNull(),

  animation: modalAnimationEnum("animation").default("fade"),

  ownerId: integer("owner_id")
    .references(() => users.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});
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

  // 🔗 ارتباط با صاحب تور
  ownerId: integer("owner_id")
    .references(() => users.id)
    .notNull(),

  // 📝 اطلاعات اصلی
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),

  // 💰 قیمت و ظرفیت
  price: integer("price").notNull(),
  maxPeople: integer("max_people"),

  // 🖼️ تصاویر (URL های نهایی)
  images: text("images").array(),

  // 📍 لوکیشن و زمان
  location: text("location"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  features: text("features").array().default([]),
  includes: text("includes").array().default([]),
  excludes: text("excludes").array().default([]),
  schedule: text("schedule").array().default([]),
  faqs: text("faqs").array().default([]),
  enableComments: boolean("enable_comments").default(true),
  showLikes: boolean("show_likes").default(true),
  showRating: boolean("show_rating").default(true),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});
// -------------------- COMMENTS --------------------
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),

  // ارتباط‌ها
  tourId: integer("tour_id")
    .references(() => tours.id, { onDelete: "cascade" })
    .notNull(),

  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  // برای reply
  parentId: integer("parent_id").references(() => comments.id),

  // محتوا
  content: text("content").notNull(),

  // وضعیت
  isDeleted: boolean("is_deleted").default(false),

  createdAt: timestamp("created_at").defaultNow(),
});
// -------------------- COMMENT LIKES --------------------
export const commentLikes = pgTable("comment_likes", {
  id: serial("id").primaryKey(),

  commentId: integer("comment_id")
    .references(() => comments.id, { onDelete: "cascade" })
    .notNull(),

  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

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
// -------------------- FOLLOW --------------------
export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),

  followerId: integer("follower_id")
    .references(() => users.id)
    .notNull(),

  followingId: integer("following_id")
    .references(() => users.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});
