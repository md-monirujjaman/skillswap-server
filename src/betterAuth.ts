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
  env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: backendOrigin,
  basePath: "/api/auth",
  trustedOrigins,
  onAPIError: {
    errorURL: `${env.FRONTEND_URL}/login?error=oauth_failed`,
  },
  advanced: {
    useSecureCookies: isSecureCookie,
    defaultCookieAttributes: {
      httpOnly: true,
      secure: isSecureCookie,
      sameSite: isSecureCookie ? "none" : "lax",
      path: "/",
    },
    cookies: {
      oauth_state: {
        attributes: {
          httpOnly: true,
          secure: isSecureCookie,
          sameSite: isSecureCookie ? "none" : "lax",
          path: "/",
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
