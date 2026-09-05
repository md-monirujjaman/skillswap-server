import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "./models.js";
import env from "./config/env.js";
import { auth as betterAuth } from "./betterAuth.js";

const authRouter = express.Router();
const JWT_SECRET = env.JWT_SECRET;
const isSecureCookie = env.NODE_ENV === 'production' || process.env.VERCEL === '1';
const authCookieSettings = {
  httpOnly: true,
  secure: isSecureCookie,
  sameSite: isSecureCookie ? 'none' as const : 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

if (!JWT_SECRET) {
  console.warn("Warning: JWT_SECRET environment variable is missing.");
}

// Register
authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, image, password, role, skills, bio, hourlyRate } = req.body;
    
    // Check if role is Admin (Cannot register admin here)
    if (role === 'Admin') {
      res.status(403).json({ error: "Cannot register as Admin" });
      return; 
    }

    if (password) {
      if (password.length < 6) {
        res.status(400).json({ error: "Password must be at least 6 characters long." });
        return;
      }
      if (!/[A-Z]/.test(password)) {
        res.status(400).json({ error: "Password must contain at least one uppercase letter." });
        return;
      }
      if (!/[a-z]/.test(password)) {
        res.status(400).json({ error: "Password must contain at least one lowercase letter." });
        return;
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : "";

    const user = await User.create({
      name,
      email,
      image: image || "",
      password: hashedPassword,
      role,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map((s: string) => s.trim()) : []),
      bio: bio || "",
      hourlyRate: hourlyRate ? Number(hourlyRate) : 0
    });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET as string, { expiresIn: '7d' });

    res.cookie('auth_token', token, authCookieSettings);

    res.status(201).json({ message: "Registered successfully", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return; 
    }

    if (user.isBlocked) {
      res.status(403).json({ error: "Your account is blocked. Contact support." });
      return; 
    }

    // Google OAuth login will bypass password check if we specify, but here we expect credential login if password is provided
    if (password && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         res.status(401).json({ error: "Invalid email or password" });
         return; 
      }
    } else if (password && !user.password) { // User used OAuth initially
      res.status(401).json({ error: "Please log in using Google OAuth" });
      return; 
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET as string, { expiresIn: '7d' });

    res.cookie('auth_token', token, authCookieSettings);

    res.status(200).json({ message: "Logged in successfully", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout
authRouter.post("/logout", (req, res) => {
  res.clearCookie("auth_token", {
    secure: isSecureCookie,
    sameSite: isSecureCookie ? 'none' : 'lax',
    path: '/'
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Get Current Auth State
authRouter.get("/me", async (req, res) => {
  try {
    const session = await betterAuth.api.getSession({
      headers: req.headers,
    });

    if (session?.user) {
      const appUser = await User.findOne({ email: session.user.email }).select("-password");

      if (appUser) {
        const token = jwt.sign({ id: appUser._id, role: appUser.role }, JWT_SECRET as string, {
          expiresIn: "7d",
        });
        res.cookie("auth_token", token, authCookieSettings);
        res.status(200).json({ user: appUser });
        return;
      }

      res.status(200).json({ user: session.user });
      return;
    }

    const token = req.cookies.auth_token;
    if (!token) {
      res.status(401).json({ error: "Not authenticated" });
      return; 
    }

    const decoded = jwt.verify(token, JWT_SECRET as string) as { id: string, role: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
       res.status(404).json({ error: "User not found" });
       return; 
    }

    if (user.isBlocked) {
       res.clearCookie("auth_token");
       res.status(403).json({ error: "Your account is blocked." });
       return;
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// MOCK Google OAuth Login
// Note: mock Google OAuth handler removed. Real OAuth routes are provided
// by Better Auth and will be mounted under /api/auth via toNodeHandler(auth).

// Compatibility: Better Auth expects a POST to `/sign-in/social` to initiate
// social sign-in. Some clients may issue a GET (browser link). Provide a
// lightweight GET handler that explains the correct method to avoid a
// confusing 404 and guide callers to use POST.
authRouter.get('/sign-in/social', (req, res) => {
  res.status(405).json({
    error: 'Method Not Allowed. Use POST /api/auth/sign-in/social?provider=google',
    hint: 'Better Auth exposes POST /sign-in/social for initiating social OAuth flows.'
  });
});

export default authRouter;
