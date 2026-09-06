// test/test-utils.ts
import type { D1Database } from "@cloudflare/workers-types";
import { getPlatformProxy } from "wrangler";
import type { Env } from "../src/server/index";

export interface TestContext {
  env: Env;
  dispose: () => Promise<void>;
}

export async function getTestBindings(): Promise<TestContext> {
  const proxy = await getPlatformProxy<{ DB: D1Database }>({
    persist: false,
  });

  const env: Env = {
    DB: proxy.env.DB,
    ASSETS: {
      fetch: async () => new Response("Mock Static Asset", { status: 200 }),
    },
  };

  return {
    env,
    dispose: proxy.dispose,
  };
}

export async function setupTestDatabase(db: D1Database) {
  const statements = [
    "DROP TABLE IF EXISTS certificates",
    "DROP TABLE IF EXISTS users",
    `CREATE TABLE users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'INSPECTOR',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE certificates (
      report_no TEXT PRIMARY KEY,
      employer TEXT NOT NULL,
      location TEXT NOT NULL,
      equipment_desc TEXT NOT NULL,
      safe_working_load TEXT NOT NULL,
      exam_date TEXT NOT NULL,
      status TEXT DEFAULT 'PASS'
    )`,
    `INSERT INTO users (id, email, password_hash, role) 
     VALUES ('u_admin', 'admin@esico.com.sa', 'demo123', 'ADMIN')`,
  ];

  for (const sql of statements) {
    await db.prepare(sql).run();
  }
}