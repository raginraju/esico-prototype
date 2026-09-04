// test/certificates.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import app from "../src/server/index";
import { getTestBindings, setupTestDatabase, type TestContext } from "./test-utils";

describe("Certificates Integration Tests (/api/certificates)", () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await getTestBindings();
  });

  afterAll(async () => {
    await context.dispose();
  });

  beforeEach(async () => {
    await setupTestDatabase(context.env.DB);
  });

  it("POST /api/certificates creates a certificate successfully", async () => {
    const newCert = {
      reportNo: "ESICO-2026-001",
      employer: "Aramco Operations",
      location: "Ras Tanura",
      equipmentDesc: "Overhead Crane 50T",
      safeWorkingLoad: "50 Tonnes",
      examDate: "2026-03-01",
      status: "PASS",
    };

    const res = await app.request(
      "/api/certificates",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCert),
      },
      context.env
    );

    expect(res.status).toBe(201);
    const data = (await res.json()) as any;
    expect(data.success).toBe(true);
    expect(data.reportNo).toBe("ESICO-2026-001");

    // Verify row was committed into D1
    const dbRow = await context.env.DB.prepare(
      "SELECT * FROM certificates WHERE report_no = ?"
    )
      .bind("ESICO-2026-001")
      .first<any>();

    expect(dbRow).not.toBeNull();
    expect(dbRow.employer).toBe("Aramco Operations");
  });

  it("POST /api/certificates returns 400 if required fields are missing", async () => {
    const res = await app.request(
      "/api/certificates",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employer: "Aramco Operations",
          // missing reportNo and equipmentDesc
        }),
      },
      context.env
    );

    expect(res.status).toBe(400);
    const data = (await res.json()) as any;
    expect(data.error).toContain("required");
  });

  it("GET /api/certificates returns all records and supports search", async () => {
    // Seed test records
    await context.env.DB.prepare(
      `INSERT INTO certificates (report_no, employer, location, equipment_desc, safe_working_load, exam_date, status)
       VALUES 
       ('CERT-101', 'Aramco', 'Dammam', 'Forklift 5T', '5 Tonnes', '2026-01-10', 'PASS'),
       ('CERT-102', 'SABIC', 'Jubail', 'Mobile Crane 80T', '80 Tonnes', '2026-01-15', 'FAIL')`
    ).run();

    // 1. Fetch all
    const listRes = await app.request("/api/certificates", { method: "GET" }, context.env);
    expect(listRes.status).toBe(200);
    const listData = (await listRes.json()) as any;
    expect(listData.count).toBe(2);

    // 2. Search query filter
    const searchRes = await app.request(
      "/api/certificates?search=Forklift",
      { method: "GET" },
      context.env
    );
    expect(searchRes.status).toBe(200);
    const searchData = (await searchRes.json()) as any;
    expect(searchData.count).toBe(1);
    expect(searchData.data[0].reportNo).toBe("CERT-101");

    // 3. Status filter
    const statusRes = await app.request(
      "/api/certificates?status=FAIL",
      { method: "GET" },
      context.env
    );
    expect(statusRes.status).toBe(200);
    const statusData = (await statusRes.json()) as any;
    expect(statusData.count).toBe(1);
    expect(statusData.data[0].reportNo).toBe("CERT-102");
  });

  it("GET /api/certificates/:id returns single record or 404", async () => {
    await context.env.DB.prepare(
      `INSERT INTO certificates (report_no, employer, location, equipment_desc, safe_working_load, exam_date, status)
       VALUES ('CERT-999', 'Baker Hughes', 'Khobar', 'Pressure Vessel', '150 Bar', '2026-02-01', 'PASS')`
    ).run();

    // Existing cert
    const resFound = await app.request(
      "/api/certificates/CERT-999",
      { method: "GET" },
      context.env
    );
    expect(resFound.status).toBe(200);
    const dataFound = (await resFound.json()) as any;
    expect(dataFound.data.reportNo).toBe("CERT-999");
    expect(dataFound.data.employer).toBe("Baker Hughes");

    // Missing cert
    const resNotFound = await app.request(
      "/api/certificates/NONEXISTENT",
      { method: "GET" },
      context.env
    );
    expect(resNotFound.status).toBe(404);
    const dataNotFound = (await resNotFound.json()) as any;
    expect(dataNotFound.success).toBe(false);
  });
});