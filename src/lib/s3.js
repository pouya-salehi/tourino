// src/lib/s3.ts or /lib/s3.ts
import { S3 } from "@aws-sdk/client-s3";

export const s3 = new S3({
  region: "default",
  endpoint: `https://${process.env.LIARA_ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
  forcePathStyle: true,
});