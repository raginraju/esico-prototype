import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("INSPECTOR"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const certificates = sqliteTable("certificates", {
  reportNo: text("report_no").primaryKey(),
  employer: text("employer").notNull(),
  location: text("location").notNull(),
  equipmentDesc: text("equipment_desc").notNull(),
  safeWorkingLoad: text("safe_working_load").notNull(),
  examDate: text("exam_date").notNull(),
  status: text("status").default("PASS"),
});

// Infer TypeScript types directly from the schema

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Certificate = typeof certificates.$inferSelect;
export type NewCertificate = typeof certificates.$inferInsert;