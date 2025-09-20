import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import * as schema from "./schema";

// Database connection configuration
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create postgres client
const client: Sql = postgres(connectionString, {
  prepare: false, // Disable prepared statements for compatibility
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Create Drizzle instance
export const db = drizzle(client, { schema });

// Export schema for use in other modules
export * from "./schema";

// Connection management
export const closeConnection = async () => {
  await client.end();
};

// Health check function
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
};