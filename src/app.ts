import express, { type Request, type Response, type NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import env from "./config/env.js";
import apiRoutes from "./api.js";
import { connectDatabase } from "./db.js";

export function createApp() {
  const app = express();
  const PORT = env.PORT;
  // When running behind a proxy (e.g., Vercel), trust the proxy
  // so secure cookies and protocol detection work correctly in production.
  if (env.NODE_ENV === "production" || process.env.VERCEL === "1") {
    app.set("trust proxy", true);
  }

  const corsOrigins = [
    env.FRONTEND_URL,
    env.APP_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
  ].filter((origin, index, origins) => origins.indexOf(origin) === index);

  app.use(
    cors({
      origin: corsOrigins,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
      credentials: true,
      optionsSuccessStatus: 204,
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  app.get("/", (_req: Request, res: Response) => {
    res.json({ success: true, message: "Server is Running 🚀" });
  });

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "OK" });
  });

  app.use("/api", async (req: Request, _res: Response, next: NextFunction) => {
    if (req.method === "OPTIONS" || req.path.startsWith("/auth")) {
      next();
      return;
    }
    try {
      await connectDatabase();
      next();
    } catch (error) {
      next(error);
    }
  });

  app.use("/api", apiRoutes);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({
      success: false,
      message: env.NODE_ENV === "production" ? "Internal Server Error" : err.message,
    });
  });

  app.locals.port = PORT;
  return app;
}

export const app = createApp();
export default app;
