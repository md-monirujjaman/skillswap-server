import { betterAuth } from "better-auth";
import env from "./config/env.js";

// As we use MongoDB/Mongoose natively elsewhere, this betterAuth instance
// is minimally configured to satisfy section 06 environment rules.
const trustedOrigins = [
  "https://skillswap-client-monirujjaman.vercel.app",
  ...((env.BETTER_AUTH_TRUSTED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)),
];

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins,
  advanced: {
    useSecureCookies: env.NODE_ENV === "production" || process.env.VERCEL === "1",
    defaultCookieAttributes: {
      sameSite: "none"
    },
    cookies: {
      oauth_state: {
        attributes: {
          sameSite: "none"
        }
      }
    }
  },
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  }
});
