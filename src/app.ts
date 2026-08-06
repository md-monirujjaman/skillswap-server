import express, { type Request, type Response, type NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import env from "./config/env.js";
import apiRoutes from "./api.js";

export function createApp() {
  const app = express();
  const PORT = env.PORT;
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    env.APP_URL,
  ].filter(Boolean) as string[];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || env.NODE_ENV !== "production") {
          return callback(null, true);
        }
        return callback(new Error("CORS policy violation"), false);
      },
      credentials: true,
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
