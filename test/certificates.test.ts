// test/certificates.test.ts
import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import {
  onRequestGet as listCertificatesHandler,
  onRequestPost as createCertificateHandler,
} from "../functions/api/certificates/index";
import { onRequestGet as getCertificateHandler } from "../functions/api/certificates/[id]";
import { getTestBindings, setupTestDatabase, createExecutionContext, type TestEnv } from "./test-utils";

describe("Certificates Endpoints", () => {
  let env: TestEnv;

  beforeAll(async () => {
    env = await getTestBindings();
  });

  beforeEach(async () => {
    await setupTestDatabase(env.DB);

    // Seed two certificates for listing tests
    await env.DB.prepare(
      `INSERT INTO certificates (report_no, employer, location, equipment_desc, safe_working_load, exam_date, status)
       VALUES 
       ('ESC-2026-001', 'Aramco Site A', 'Dammam', 'Overhead Crane 50T', '50 Ton', '2026-08-01', 'PASS'),
       ('ESC-2026-002', 'Sabic Plant B', 'Jubail', 'Forklift 5T', '5 Ton', '2026-08-15', 'FAIL')`
    ).run();
  });

  describe("GET /api/certificates", () => {
    it("lists all certificates ordered by date descending", async () => {
      const req = new Request("http://localhost/api/certificates");
      const context = createExecutionContext(req, env);

      const res = await listCertificatesHandler(context);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.count).toBe(2);
      expect(body.data[0].reportNo).toBe("ESC-2026-002"); // Newer date first
    });

    it("filters certificates by search term", async () => {
      const req = new Request("http://localhost/api/certificates?search=Crane");
      const context = createExecutionContext(req, env);

      const res = await listCertificatesHandler(context);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.count).toBe(1);
      expect(body.data[0].equipmentDesc).toContain("Crane");
    });

    it("filters certificates by status", async () => {
      const req = new Request("http://localhost/api/certificates?status=FAIL");
      const context = createExecutionContext(req, env);

      const res = await listCertificatesHandler(context);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.count).toBe(1);
      expect(body.data[0].status).toBe("FAIL");
    });
  });

  describe("POST /api/certificates", () => {
    it("validates missing required fields", async () => {
      const req = new Request("http://localhost/api/certificates", {
        method: "POST",
        body: JSON.stringify({ employer: "Test Corp" }), // Missing reportNo & equipmentDesc
        headers: { "Content-Type": "application/json" },
      });

      const context = createExecutionContext(req, env);
      const res = await createCertificateHandler(context);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.error).toContain("required");
    });

    it("creates a new certificate successfully", async () => {
      const payload = {
        reportNo: "ESC-2026-003",
        employer: "Maaden Mining",
        location: "Ras Al Khair",
        equipmentDesc: "Tower Crane 20T",
        safeWorkingLoad: "20 Ton",
        status: "PASS",
      };

      const req = new Request("http://localhost/api/certificates", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      const context = createExecutionContext(req, env);
      const res = await createCertificateHandler(context);
      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body.success).toBe(true);

      // Verify insertion in D1
      const saved = await env.DB.prepare("SELECT * FROM certificates WHERE report_no = ?")
        .bind("ESC-2026-003")
        .first();
      expect(saved).not.toBeNull();
      expect(saved?.employer).toBe("Maaden Mining");
    });
  });

  describe("GET /api/certificates/:id", () => {
    it("returns single certificate matching ID", async () => {
      const req = new Request("http://localhost/api/certificates/ESC-2026-001");
      const context = createExecutionContext(req, env, { id: "ESC-2026-001" });

      const res = await getCertificateHandler(context);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.data.reportNo).toBe("ESC-2026-001");
    });

    it("returns 404 when certificate does not exist", async () => {
      const req = new Request("http://localhost/api/certificates/ESC-NONEXISTENT");
      const context = createExecutionContext(req, env, { id: "ESC-NONEXISTENT" });

      const res = await getCertificateHandler(context);
      const body = await res.json();

      expect(res.status).toBe(404);
      expect(body.success).toBe(false);
    });
  });
});