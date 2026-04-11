const { Client } = require("pg");

const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("SUPABASE_DATABASE_URL or DATABASE_URL is required");
  process.exit(1);
}

const client = new Client({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

const run = async () => {
  await client.connect();
  const result = await client.query("select now() as checked_at");
  console.log(`Supabase keepalive ok at ${result.rows[0].checked_at.toISOString()}`);
};

run()
  .catch((error) => {
    console.error("Supabase keepalive failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end().catch(() => {});
  });
