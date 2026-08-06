import { betterAuth } from "better-auth";
import env from "./config/env.js";

const isSecureCookie = env.NODE_ENV === "production" || process.env.VERCEL === "1";
const backendOrigin = (() => {
  try {
    return new URL(env.BETTER_AUTH_URL).origin;
  } catch {
    return env.BETTER_AUTH_URL;
  }
})();

// As we use MongoDB/Mongoose natively elsewhere, this betterAuth instance
// is minimally configured to satisfy section 06 environment rules.
const trustedOrigins = [
  env.CLIENT_URL,
  backendOrigin,
  ...((env.BETTER_AUTH_TRUSTED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)),
].filter(Boolean);

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins,
  advanced: {
    useSecureCookies: isSecureCookie,
    defaultCookieAttributes: {
      secure: isSecureCookie,
      sameSite: isSecureCookie ? "none" : "lax",
      path: "/"
    },
    cookies: {
      oauth_state: {
        attributes: {
          secure: isSecureCookie,
          sameSite: isSecureCookie ? "none" : "lax",
          path: "/"
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
