/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./src/db/schema.js",
  out: "./src/db/migrations",

  dialect: "postgresql", // ← مشکل اصلی این بود
  dbCredentials: {
    url: process.env.DATABASE_URL, // ← درستش اینه، نه connectionString
  },
};
