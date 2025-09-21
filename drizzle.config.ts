import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

// Load .env first, then override with .env.local
config({ path: '.env' });
config({ path: '.env.local', override: true });

export default defineConfig({
  dialect: "postgresql",
  schema: "./packages/shared/src/database/schema.ts",
  out: "./packages/shared/src/database/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});