// @vitest-environment node

import { beforeEach, afterEach, describe, expect, it } from "vitest";
import app from "../src/server/index";
import { getTestBindings, setupTestDatabase, type TestContext } from "./test-utils";

describe("ID cards API route", () => {
  let context: TestContext;

  beforeEach(async () => {
    context = await getTestBindings();
    await setupTestDatabase(context.env.DB);
  });

  afterEach(async () => {
    await context.dispose();
  });

  it("returns an empty list", async () => {
    const response = await app.fetch(new Request("http://localhost/api/idcards"), context.env);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "success", data: [] });
  });

  it("rejects incomplete ID card data", async () => {
    const form = new FormData();
    form.set("name", "Aisha");

    const response = await app.fetch(
      new Request("http://localhost/api/idcards", { method: "POST", body: form }),
      context.env
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ status: "error" });
  });

  it("creates an ID card and deletes it", async () => {
    const form = new FormData();
    form.set("name", "Aisha");
    form.set("company_name", "MSSI Company");
    form.set("file_number", "FILE-1");
    form.set("civil_id_number", "CIVIL-1");
    form.set("designation", "Inspector");
    form.set("type_model", "LTM 1160");
    form.set("capacity_swl", "1100 t");
    form.set("expiry_date", "2027-01-01");

    const createResponse = await app.fetch(
      new Request("http://localhost/api/idcards", { method: "POST", body: form }),
      context.env
    );
    const created = await createResponse.json() as {
      data: { id: string; name: string; company_name: string; type_model: string; capacity_swl: string };
    };

    const deleteResponse = await app.fetch(
      new Request(`http://localhost/api/idcards/${created.data.id}`, { method: "DELETE" }),
      context.env
    );

    expect(createResponse.status).toBe(201);
    expect(created.data.name).toBe("Aisha");
    expect(created.data.company_name).toBe("MSSI Company");
    expect(created.data.type_model).toBe("LTM 1160");
    expect(created.data.capacity_swl).toBe("1100 t");
    expect(deleteResponse.status).toBe(200);
  });
});