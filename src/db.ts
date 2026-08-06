import mongoose from "mongoose";
import env from "./config/env.js";

mongoose.set("bufferCommands", false);

let dbPromise: Promise<typeof mongoose> | null = null;

export function connectDatabase() {
  if (dbPromise) {
    return dbPromise;
  }

  if (!env.MONGODB_URI) {
    const missingUriError = new Error("MONGODB_URI is not set. Please configure it in your environment.");
    console.error("MongoDB Connection Failed:", missingUriError);
    dbPromise = Promise.reject(missingUriError);
    return dbPromise;
  }

  console.log("MongoDB URI loaded from environment");

  dbPromise = mongoose
    .connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    })
    .then((connection) => {
      console.log("MongoDB Connected");
      return connection;
    })
    .catch((err) => {
      console.error("MongoDB Connection Failed:", err);
      throw err;
    });

  return dbPromise;
}

export function ensureDatabaseConnected() {
  return connectDatabase();
}
