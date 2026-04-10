import { defineConfig } from "prisma/config";

import "dotenv/config";

const migrationUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "prisma/seed.js",
  },
  datasource: {
    url: migrationUrl,
  },
});
