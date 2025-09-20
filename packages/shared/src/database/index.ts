// Database layer exports
export { db, closeConnection, checkDatabaseHealth } from "./connection";
export * from "./schema";
export { runMigrations, seedDatabase } from "./migrate";

// Re-export auth for convenience
export { AuthService } from "../auth/kinde";
export type { User } from "../auth/types";