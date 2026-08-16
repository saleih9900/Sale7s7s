import postgres from "postgres";

const connectionString = process.env.SUPABASE_DATABASE_URL;
if (!connectionString) throw new Error("SUPABASE_DATABASE_URL is required");
const sql = postgres(connectionString, { prepare: false, max: 1 });

try {
  await sql.begin(async (tx) => {
    await tx.unsafe(`DO $$ BEGIN CREATE TYPE "public"."order_status" AS ENUM('new', 'preparing', 'ready', 'completed', 'cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
    await tx.unsafe(`DO $$ BEGIN CREATE TYPE "public"."user_role" AS ENUM('user', 'admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
    await tx.unsafe(`CREATE TABLE IF NOT EXISTS "categories" ("id" serial PRIMARY KEY NOT NULL, "name" varchar(120) NOT NULL, "slug" varchar(120) NOT NULL UNIQUE, "createdAt" timestamptz DEFAULT now() NOT NULL);`);
    await tx.unsafe(`CREATE TABLE IF NOT EXISTS "orderItems" ("id" serial PRIMARY KEY NOT NULL, "orderId" integer NOT NULL, "productId" integer NOT NULL, "productName" varchar(180) NOT NULL, "quantity" integer NOT NULL, "unitPrice" numeric(10,2) NOT NULL);`);
    await tx.unsafe(`CREATE TABLE IF NOT EXISTS "orders" ("id" serial PRIMARY KEY NOT NULL, "orderNumber" varchar(32) NOT NULL UNIQUE, "customerName" varchar(180) NOT NULL, "customerPhone" varchar(40) NOT NULL, "notes" text, "total" numeric(10,2) NOT NULL, "status" "order_status" DEFAULT 'new' NOT NULL, "createdAt" timestamptz DEFAULT now() NOT NULL);`);
    await tx.unsafe(`CREATE TABLE IF NOT EXISTS "products" ("id" serial PRIMARY KEY NOT NULL, "categoryId" integer NOT NULL, "name" varchar(180) NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "imageUrl" text NOT NULL, "isAvailable" integer DEFAULT 1 NOT NULL, "featured" integer DEFAULT 0 NOT NULL, "createdAt" timestamptz DEFAULT now() NOT NULL, "updatedAt" timestamptz DEFAULT now() NOT NULL);`);
    await tx.unsafe(`CREATE TABLE IF NOT EXISTS "users" ("id" serial PRIMARY KEY NOT NULL, "openId" varchar(64) NOT NULL UNIQUE, "name" text, "email" varchar(320), "loginMethod" varchar(64), "role" "user_role" DEFAULT 'user' NOT NULL, "createdAt" timestamptz DEFAULT now() NOT NULL, "updatedAt" timestamptz DEFAULT now() NOT NULL, "lastSignedIn" timestamptz DEFAULT now() NOT NULL);`);
    await tx.unsafe(`INSERT INTO "categories" ("name", "slug") VALUES ('مشروبات', 'drinks'), ('حلويات', 'desserts') ON CONFLICT ("slug") DO NOTHING;`);
    await tx.unsafe(`INSERT INTO "products" ("categoryId", "name", "description", "price", "imageUrl", "isAvailable", "featured") SELECT c.id, v.name, v.description, v.price, v.image_url, 1, v.featured FROM (VALUES ('drinks','إسبريسو','مركّز، عميق، وبنهاية ناعمة',12.00,'/manus-storage/elo-espresso_81202654.jpg',1),('drinks','كابتشينو','رغوة مخملية مع نكهة متوازنة',16.00,'/manus-storage/elo-cappuccino_dbdb4cbd.jpg',1),('drinks','لاتيه إيلو','حليب ناعم ولمسة إسبريسو',18.00,'/manus-storage/elo-latte_67c25fca.jpg',1),('drinks','كولد برو','استخلاص بارد، نكهة صافية ومنعشة',20.00,'/manus-storage/elo-latte_67c25fca.jpg',0),('desserts','تشيزكيك إيلو','ناعم بلمسة كراميل خفيفة',22.00,'/manus-storage/elo-dessert_4ff8dec5.jpg',1),('desserts','كرواسون زبدة','مخبوز طازجًا كل صباح',14.00,'/manus-storage/elo-dessert_4ff8dec5.jpg',0)) AS v(slug,name,description,price,image_url,featured) JOIN "categories" c ON c.slug = v.slug WHERE NOT EXISTS (SELECT 1 FROM "products" p WHERE p.name = v.name);`);
  });
  const tables = await sql.unsafe(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('categories','products','orders','orderItems','users') ORDER BY table_name;`);
  console.log(JSON.stringify({ ok: true, tables: tables.map((row) => row.table_name) }));
} finally {
  await sql.end({ timeout: 5 });
}
