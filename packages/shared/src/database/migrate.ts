import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, closeConnection } from "./connection";

// Migration runner
export const runMigrations = async () => {
  console.log("🏃‍♂️ Running database migrations...");
  
  try {
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("✅ Database migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await closeConnection();
  }
};

// Development seed data (optional)
export const seedDatabase = async () => {
  console.log("🌱 Seeding database with development data...");
  
  try {
    // Add seed logic here if needed
    console.log("✅ Database seeding completed");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations().catch((error) => {
    console.error("Migration process failed:", error);
    process.exit(1);
  });
}