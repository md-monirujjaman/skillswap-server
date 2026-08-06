import { betterAuth } from "better-auth";
import env from "./config/env.js";

// As we use MongoDB/Mongoose natively elsewhere, this betterAuth instance
// is minimally configured to satisfy section 06 environment rules.
export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
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
