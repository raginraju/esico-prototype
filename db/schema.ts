// src/db/schema.ts
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
  // Identifiers
  id: text("id").primaryKey(),
  unique_id: text("unique_id").notNull().unique(),
  report_number: text("report_number").notNull().unique(),
  sticker_number: text("sticker_number"),
  equipment_id: text("equipment_id"),

  // Title & Metadata
  certificate_title: text("certificate_title").notNull(),
  revision_number: text("revision_number").default("1"),
  as_name: text("as_name"),

  // Inspector details
  inspector_name: text("inspector_name").notNull(),
  inspected_by: text("inspected_by"),
  signature: text("signature"),

  // Dates
  selected_date: text("selected_date"),
  next_date: text("next_date"),
  date_of_issue: text("date_of_issue"),
  sel_date: text("sel_date"),
  nex_date: text("nex_date"),

  // Inspection standards & Employer info
  applied_standards: text("applied_standards"),
  employer_name_address: text("employer_name_address").notNull(),
  location: text("location").notNull(),

  // Equipment Specifications
  equipment_description: text("equipment_description").notNull(),
  equipment_description_pdf: text("equipment_description_pdf"),
  safe_working_loads: text("safe_working_loads"),
  manufacturer_name: text("manufacturer_name"),
  manufacture_date: text("manufacture_date"),

  // Inspection Questionnaire & Scheme
  first_examined: text("first_examined").default("No"),
  installed_correctly: text("installed_correctly").default(""),
  months_interval: text("months_interval").default("6"),
  six_months_interval: text("six_months_interval").default("No"),
  twelve_months_interval: text("twelve_months_interval").default("No"),
  exam_scheme: text("exam_scheme").default("Yes"),
  after_occur: text("after_occur").default("No"),

  // Defects & Status
  defect: text("defect").default("NONE"),
  defect2: text("defect2").default("N/A"),
  iminent_danger: text("iminent_danger").default("No"),
  repair_renewal: text("repair_renewal").default("NONE"),
  any_tests_carried: text("any_tests_carried").default("NONE"),
  observation: text("observation"),
  safe_to_operate: text("safe_to_operate").default("Yes"),

  // Display & System Fields
  checklist_type: text("checklist_type").default(""),
  show_in_certificate: text("show_in_certificate").default("0"),
  status: text("status").default("A"),
  created_on: text("created_on").default(sql`CURRENT_TIMESTAMP`),
  updated_on: text("updated_on"),
});

// Inferred TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Certificate = typeof certificates.$inferSelect;
export type NewCertificate = typeof certificates.$inferInsert;