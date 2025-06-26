import "dotenv/config";
import { defineConfig } from "drizzle-kit";
const url = process.env.DATABASE_URL!;
if (url) {
  console.log("url:", url);
}
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
