const { defineConfig } = require("prisma/config");

require("dotenv").config();

const migrationUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

const config = {
  schema: "src/prisma/schema.prisma",
  migrations: {
    path: "src/prisma/migrations",
  },
};

if (migrationUrl) {
  config.datasource = {
    url: migrationUrl,
  };
}

module.exports = defineConfig(config);
