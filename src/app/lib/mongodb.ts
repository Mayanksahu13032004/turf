import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  var mongooseCache: MongooseCache;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

export async function connectToDatabase(): Promise<mongoose.Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {}).then((mongoose) => {
      console.log(" MongoDB Connected!");
      return mongoose.connection;
    }).catch((error) => {
      console.error(" MongoDB Connection Error:", error);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

if (process.env.NODE_ENV !== "production") {
  global.mongooseCache = cached;
}