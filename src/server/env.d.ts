// src/server/env.d.ts
import type { D1Database, Fetcher, R2Bucket } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  ID_CARD_BUCKET?: R2Bucket;
  JWT_SECRET: string;
}