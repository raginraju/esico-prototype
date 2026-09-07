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
    JWT_SECRET: "test-jwt-secret-with-enough-entropy",
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
    "DROP TABLE IF EXISTS id_cards",
    "DROP TABLE IF EXISTS certificates",
    "DROP TABLE IF EXISTS users",
    `CREATE TABLE users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      mobile TEXT NOT NULL DEFAULT '',
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'INSPECTOR',
      status TEXT NOT NULL DEFAULT 'Pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE certificates (
      id TEXT PRIMARY KEY NOT NULL,
      unique_id TEXT NOT NULL UNIQUE,
      report_number TEXT NOT NULL UNIQUE,
      sticker_number TEXT,
      equipment_id TEXT,
      certificate_title TEXT NOT NULL,
      revision_number TEXT DEFAULT '1',
      as_name TEXT,
      inspector_name TEXT NOT NULL,
      inspected_by TEXT,
      signature TEXT,
      selected_date TEXT,
      next_date TEXT,
      date_of_issue TEXT,
      sel_date TEXT,
      nex_date TEXT,
      applied_standards TEXT,
      employer_name_address TEXT NOT NULL,
      location TEXT NOT NULL,
      equipment_description TEXT NOT NULL,
      equipment_description_pdf TEXT,
      safe_working_loads TEXT,
      manufacturer_name TEXT,
      manufacture_date TEXT,
      first_examined TEXT DEFAULT 'No',
      installed_correctly TEXT DEFAULT '',
      months_interval TEXT DEFAULT '6',
      six_months_interval TEXT DEFAULT 'No',
      twelve_months_interval TEXT DEFAULT 'No',
      exam_scheme TEXT DEFAULT 'Yes',
      after_occur TEXT DEFAULT 'No',
      defect TEXT DEFAULT 'NONE',
      defect2 TEXT DEFAULT 'N/A',
      iminent_danger TEXT DEFAULT 'No',
      repair_renewal TEXT DEFAULT 'NONE',
      any_tests_carried TEXT DEFAULT 'NONE',
      observation TEXT,
      safe_to_operate TEXT DEFAULT 'Yes',
      checklist_type TEXT DEFAULT '',
      show_in_certificate TEXT DEFAULT '0',
      status TEXT DEFAULT 'A',
      created_on TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_on TEXT
    )`,
    `CREATE TABLE id_cards (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      file_number TEXT NOT NULL,
      civil_id_number TEXT NOT NULL,
      designation TEXT NOT NULL,
      expiry_date TEXT NOT NULL,
      file_url TEXT,
      created_at TEXT NOT NULL
    )`,
    `INSERT INTO users (id, email, password_hash, role) 
     VALUES ('u_admin', 'admin@esico.com.sa', 'demo123', 'ADMIN')`,
  ];

  for (const sql of statements) {
    await db.prepare(sql).run();
  }
}