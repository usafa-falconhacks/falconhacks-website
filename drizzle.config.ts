import { defineConfig } from "drizzle-kit";
import fs from "fs";
import path from "path";

// Helper function to find the local SQLite file created by wrangler
function getLocalD1Url() {
  const basePath = path.resolve(".wrangler");
  const dbFile = fs
    .readdirSync(basePath, { encoding: "utf-8", recursive: true })
    .find((f) => f.endsWith(".sqlite"));
  if (!dbFile) {
    throw new Error(`.sqlite file not found in ${basePath}`);
  }
  return `file:${path.join(basePath, dbFile)}`;
}

export default defineConfig({
  schema: "./src/lib/database/schemas/index.ts", // Path to your Drizzle schema file
  dialect: "sqlite",
  out: "./src/lib/database/migrations", // Path to your migration files
  dbCredentials: {
    // Determine the database URL based on the environment
    url: process.env.NODE_ENV === "production" ? "" : getLocalD1Url(),
  },
});
