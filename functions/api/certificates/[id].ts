// functions/api/certificates/[id].ts
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { certificates } from "../../../db/schema";

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env, "id"> = async (context) => {
  const { params, env } = context;
  const rawId = params.id;

  if (!rawId || typeof rawId !== "string") {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid report number" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const reportNo = decodeURIComponent(rawId);

  try {
    const db = drizzle(env.DB);
    const result = await db
      .select()
      .from(certificates)
      .where(eq(certificates.reportNo, reportNo))
      .get(); // .get() returns a single row or undefined in SQLite

    if (!result) {
      return new Response(
        JSON.stringify({ success: false, error: `Certificate '${reportNo}' not found` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};