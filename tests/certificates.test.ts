// @vitest-environment node

import { beforeEach, afterEach, describe, expect, it } from "vitest";
import app from "../src/server/index";
import { getTestBindings, setupTestDatabase, type TestContext } from "./test-utils";

const baseCertificate = {
  id: "cert-1",
  unique_id: "unique-cert-1",
  report_number: "ESICO-API-001",
  certificate_title: "Test Certificate",
  inspector_name: "Inspector",
  employer_name_address: "Acme Co",
  location: "Ras Tanura",
  equipment_description: "Test crane",
};

describe("certificates API route", () => {
  let context: TestContext;

  beforeEach(async () => {
    context = await getTestBindings();
    await setupTestDatabase(context.env.DB);
  });

  afterEach(async () => {
    await context.dispose();
  });

  it("returns an empty paginated list", async () => {
    const response = await app.fetch(new Request("http://localhost/api/certificates?page=1&limit=10"), context.env);
    const body = await response.json() as { status: string; data: unknown[]; pagination: { total: number } };

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ status: "success", data: [], pagination: { total: 0 } });
  });

  it("rejects incomplete certificate data", async () => {
    const response = await app.fetch(
      new Request("http://localhost/api/certificates", {
        method: "POST",
        body: JSON.stringify({ report_number: "ESICO-MISSING" }),
        headers: { "Content-Type": "application/json" },
      }),
      context.env
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ status: "error" });
  });

  it("creates and retrieves a certificate by report number", async () => {
    const createResponse = await app.fetch(
      new Request("http://localhost/api/certificates", {
        method: "POST",
        body: JSON.stringify(baseCertificate),
        headers: { "Content-Type": "application/json" },
      }),
      context.env
    );
    const created = await createResponse.json() as { data: { report_number: string } };

    const detailResponse = await app.fetch(
      new Request("http://localhost/api/certificates/ESICO-API-001"),
      context.env
    );

    expect(createResponse.status).toBe(201);
    expect(created.data.report_number).toBe("ESICO-API-001");
    expect(detailResponse.status).toBe(200);
    expect(await detailResponse.json()).toMatchObject({ status: "success", data: { employer_name_address: "Acme Co" } });
  });

  it("returns not found for an unknown certificate", async () => {
    const response = await app.fetch(new Request("http://localhost/api/certificates/unknown"), context.env);

    expect(response.status).toBe(404);
    expect(await response.json()).toMatchObject({ status: "error", data: null });
  });
});