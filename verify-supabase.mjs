import postgres from "postgres";

const connectionString = process.env.SUPABASE_DATABASE_URL;
if (!connectionString) throw new Error("SUPABASE_DATABASE_URL is required");
const sql = postgres(connectionString, { prepare: false, max: 1 });
try {
  const result = await sql.unsafe(`SELECT (SELECT count(*)::int FROM "categories") AS categories, (SELECT count(*)::int FROM "products") AS products, (SELECT count(*)::int FROM "orders") AS orders`);
  console.log(JSON.stringify({ ok: true, counts: result[0] }));
} finally {
  await sql.end({ timeout: 5 });
}
