// test/test-utils.ts
import { getPlatformProxy } from "wrangler";

export interface TestEnv {
  DB: D1Database;
}

// 1. Get bindings from root wrangler.toml (without looking for [env.test])
export async function getTestBindings(): Promise<TestEnv> {
  const proxy = await getPlatformProxy<TestEnv>({
    persist: false, // Clean in-memory DB for test isolation
  });
  return proxy.env;
}

// 2. Sequential execution avoids Miniflare D1 batch/exec parsing bugs
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
  ];

  for (const sql of statements) {
    await db.prepare(sql).run();
  }
}

// 3. Execution context helper
export function createExecutionContext<Params = Record<string, string>>(
  request: Request,
  env: TestEnv,
  params: Params = {} as Params
) {
  return {
    request,
    env,
    params,
    functionPath: "",
    waitUntil: () => {},
    next: async () => new Response(),
    data: {},
  } as any;
}