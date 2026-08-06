import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "3000",
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  APP_URL: process.env.APP_URL || "http://localhost:5173",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "",
  // For production, use the public backend auth mount. In non-production,
  // fall back to any explicitly configured env value or localhost.
  BETTER_AUTH_URL:
    (process.env.VERCEL === "1" || process.env.NODE_ENV === "production")
      ? process.env.BETTER_AUTH_URL || "https://skillswap-server-monirujjaman.vercel.app/api/auth"
      : process.env.BETTER_AUTH_URL || "http://localhost:3000",
  BETTER_AUTH_TRUSTED_ORIGINS: process.env.BETTER_AUTH_TRUSTED_ORIGINS || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
};

export default env;
