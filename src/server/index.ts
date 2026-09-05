// src/server/index.ts
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { and, desc, eq, like, or } from "drizzle-orm";
import { users, certificates, type NewCertificate } from "../../db/schema";
import type { D1Database } from "@cloudflare/workers-types";

// 1. Worker runtime environment bindings
export interface Env {
  DB: D1Database;
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}
// 2. Strongly-typed payload interface for POST /api/certificates
interface CertificateInput {
  reportNo?: string;
  report_no?: string;
  employer?: string;
  location?: string;
  equipmentDesc?: string;
  equipment_desc?: string;
  safeWorkingLoad?: string;
  safe_working_load?: string;
  examDate?: string;
  exam_date?: string;
  status?: string;
}

const app = new Hono<{ Bindings: Env }>();

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
        like(certificates.reportNo, term),
        like(certificates.employer, term),
        like(certificates.equipmentDesc, term),
        like(certificates.location, term)
      )
    );
  }

  const results = await db
    .select()
    .from(certificates)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(certificates.examDate));

  return c.json({ success: true, count: results.length, data: results });
});

// GET /api/certificates/:id (Detail)
app.get("/api/certificates/:id", async (c) => {
  const reportNo = c.req.param("id");
  const db = drizzle(c.env.DB);

  const cert = await db
    .select()
    .from(certificates)
    .where(eq(certificates.reportNo, reportNo))
    .get();

  if (!cert) {
    return c.json(
      { success: false, error: `Certificate '${reportNo}' not found` },
      404
    );
  }

  return c.json({ success: true, data: cert });
});

// POST /api/certificates (Create)
app.post("/api/certificates", async (c) => {
  const body: CertificateInput = await c.req
    .json<CertificateInput>()
    .catch(() => ({}));

  const reportNo = body.reportNo || body.report_no;
  const employer = body.employer;
  const equipmentDesc = body.equipmentDesc || body.equipment_desc;

  if (!reportNo || !employer || !equipmentDesc) {
    return c.json(
      { error: "reportNo, employer, and equipmentDesc are required" },
      400
    );
  }

  const newCert: NewCertificate = {
    reportNo,
    employer,
    equipmentDesc,
    location: body.location || "",
    safeWorkingLoad: body.safeWorkingLoad || body.safe_working_load || "",
    examDate:
      body.examDate || body.exam_date || new Date().toISOString().split("T")[0],
    status: body.status || "PASS",
  };

  const db = drizzle(c.env.DB);
  await db.insert(certificates).values(newCert);

  return c.json(
    { success: true, message: "Certificate created", reportNo: newCert.reportNo },
    201
  );
});

// ---------------- STATIC ASSETS FALLBACK ----------------

// Strict 404 for unmapped API routes so they return JSON, not HTML
app.all("/api/*", (c) => c.json({ error: "Endpoint not found" }, 404)); 

// Serve Vite frontend build from dist/ for all non-API paths
app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw as any) as any);

export default app;