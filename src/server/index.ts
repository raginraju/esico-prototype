// src/server/index.ts
import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import { drizzle } from "drizzle-orm/d1";
import { and, desc, eq, like, or } from "drizzle-orm";
import { users, certificates, type NewCertificate } from "../../db/schema";
import type { D1Database } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

const app = new Hono<{ Bindings: Env }>();

app.use(trimTrailingSlash());

// ---------------- AUTH ----------------

app.post("/api/auth/login", async (c) => {
  const body = await c.req
    .json<{ email?: string; password?: string }>()
    .catch(() => null);

  if (!body?.email || !body?.password) {
    return c.json({ error: "Missing email or password" }, 400);
  }

  const db = drizzle(c.env.DB);
  const user = await db
    .select({ id: users.id, email: users.email, role: users.role })
    .from(users)
    .where(
      and(
        eq(users.email, body.email.trim().toLowerCase()),
        eq(users.passwordHash, body.password)
      )
    )
    .get();

  if (!user) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  return c.json({
    success: true,
    token: `demo_token_${user.id}`,
    user: { email: user.email, role: user.role },
  });
});

// ---------------- CERTIFICATES ----------------

// GET /api/certificates (Search & List)
app.get("/api/certificates", async (c) => {
  const search = c.req.query("search")?.trim();
  const status = c.req.query("status")?.trim();

  const db = drizzle(c.env.DB);
  const conditions = [];

  if (status) conditions.push(eq(certificates.status, status));
  if (search) {
    const term = `%${search}%`;
    conditions.push(
      or(
        like(certificates.report_number, term),
        like(certificates.employer_name_address, term),
        like(certificates.equipment_description, term),
        like(certificates.location, term),
        like(certificates.sticker_number, term),
        like(certificates.equipment_id, term)
      )
    );
  }

  const results = await db
    .select()
    .from(certificates)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(certificates.created_on));

  return c.json({
    status: "success",
    message: "Data has been retrieved successfully!",
    count: results.length,
    data: results,
  });
});

// GET /api/certificates/:id (Detail / Search / QR Scan)
app.get("/api/certificates/:id", async (c) => {
  const identifier = c.req.param("id").trim();
  const db = drizzle(c.env.DB);

  const cert = await db
    .select()
    .from(certificates)
    .where(
      or(
        eq(certificates.report_number, identifier),
        eq(certificates.id, identifier),
        eq(certificates.unique_id, identifier)
      )
    )
    .get();

  if (!cert) {
    return c.json(
      {
        status: "error",
        message: `Certificate '${identifier}' not found`,
        data: null,
      },
      404
    );
  }

  return c.json({
    status: "success",
    message: "Data has been retrieved successfully!",
    data: cert,
  });
});

// POST /api/certificates (Create Certificate)
app.post("/api/certificates", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, any>;

  const reportNumber = body.report_number || body.reportNo;
  const employer = body.employer_name_address || body.employer;
  const equipmentDesc = body.equipment_description || body.equipmentDesc;

  if (!reportNumber || !employer || !equipmentDesc) {
    return c.json(
      {
        status: "error",
        message: "report_number, employer_name_address, and equipment_description are required",
      },
      400
    );
  }

  const newCert: NewCertificate = {
    id: body.id || String(Date.now()),
    unique_id:
      body.unique_id || crypto.randomUUID().replace(/-/g, "").slice(0, 13),
    report_number: reportNumber,
    certificate_title:
      body.certificate_title ||
      "CERTIFICATE OF THOROUGH EXAMINATION AND /OR TEST",
    revision_number: body.revision_number || "1",
    as_name: body.as_name ?? null,
    inspector_name: body.inspector_name || "Inspector",
    inspected_by: body.inspected_by || "",
    signature: body.signature || "",
    selected_date:
      body.selected_date ||
      body.examDate ||
      new Date().toISOString().split("T")[0],
    next_date: body.next_date || "",
    date_of_issue: body.date_of_issue || "",
    sel_date: body.sel_date || "",
    nex_date: body.nex_date || "",
    applied_standards: body.applied_standards || "",
    sticker_number: body.sticker_number || "",
    employer_name_address: employer,
    location: body.location || "",
    equipment_id: body.equipment_id || "",
    equipment_description: equipmentDesc,
    equipment_description_pdf:
      body.equipment_description_pdf || equipmentDesc,
    safe_working_loads:
      body.safe_working_loads || body.safeWorkingLoad || "",
    manufacturer_name: body.manufacturer_name || "",
    manufacture_date: body.manufacture_date || "",
    first_examined: body.first_examined || "No",
    installed_correctly: body.installed_correctly || "",
    months_interval: body.months_interval || "6",
    six_months_interval: body.six_months_interval || "No",
    twelve_months_interval: body.twelve_months_interval || "No",
    exam_scheme: body.exam_scheme || "Yes",
    after_occur: body.after_occur || "No",
    defect: body.defect || "NONE",
    defect2: body.defect2 || "N/A",
    iminent_danger: body.iminent_danger || "No",
    repair_renewal: body.repair_renewal || "NONE",
    any_tests_carried: body.any_tests_carried || "NONE",
    observation: body.observation || "",
    safe_to_operate: body.safe_to_operate || "Yes",
    checklist_type: body.checklist_type || "",
    show_in_certificate: body.show_in_certificate || "0",
    status: body.status || "A",
    created_on: new Date().toISOString().replace("T", " ").slice(0, 19),
    updated_on: "0000-00-00 00:00:00",
  };

  const db = drizzle(c.env.DB);
  await db.insert(certificates).values(newCert);

  return c.json(
    {
      status: "success",
      message: "Certificate created successfully",
      data: newCert,
    },
    201
  );
});

// ---------------- STATIC ASSETS & 404 FALLBACK ----------------

app.all("/api/*", (c) =>
  c.json({ status: "error", message: "Endpoint not found" }, 404)
);

app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw as any) as any);

export default app;