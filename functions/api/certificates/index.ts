// functions/api/certificates/index.ts
import { drizzle } from "drizzle-orm/d1";
import { and, desc, eq, like, or } from "drizzle-orm";
import { certificates, type NewCertificate } from "../../../db/schema";

interface Env {
  DB: D1Database;
}

// GET /api/certificates (List & Search)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim();
  const status = url.searchParams.get("status")?.trim();

  try {
    const db = drizzle(env.DB);
    const conditions = [];

    if (status) {
      conditions.push(eq(certificates.status, status));
    }

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

    return new Response(
      JSON.stringify({
        success: true,
        count: results.length,
        data: results,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

// POST /api/certificates (Create Certificate)
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body = await request.json<Record<string, string>>();

    // Support both camelCase and snake_case request bodies
    const newCert: NewCertificate = {
      reportNo: body.reportNo || body.report_no,
      employer: body.employer,
      location: body.location || "",
      equipmentDesc: body.equipmentDesc || body.equipment_desc,
      safeWorkingLoad: body.safeWorkingLoad || body.safe_working_load || "",
      examDate: body.examDate || body.exam_date || new Date().toISOString().split("T")[0],
      status: body.status || "PASS",
    };

    if (!newCert.reportNo || !newCert.employer || !newCert.equipmentDesc) {
      return new Response(
        JSON.stringify({
          error: "reportNo, employer, and equipmentDesc are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const db = drizzle(env.DB);
    await db.insert(certificates).values(newCert);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Certificate created",
        reportNo: newCert.reportNo,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};