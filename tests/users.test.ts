// @vitest-environment node

import { beforeEach, afterEach, describe, expect, it } from "vitest";
import app from "../src/server/index";
import { getTestBindings, setupTestDatabase, type TestContext } from "./test-utils";

describe("users API route", () => {
  let context: TestContext;

  beforeEach(async () => {
    context = await getTestBindings();
    await setupTestDatabase(context.env.DB);
  });

  afterEach(async () => {
    await context.dispose();
  });

  it("lists users with pagination and excludes passwords", async () => {
    const response = await app.fetch(new Request("http://localhost/api/users?page=1&limit=10"), context.env);
    const body = await response.json() as { status: string; data: Array<Record<string, unknown>>; pagination: { total: number } };

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ status: "success", pagination: { total: 1 } });
    expect(body.data[0]).toMatchObject({ email: "admin@esico.com.sa", status: "Pending" });
    expect(body.data[0]).not.toHaveProperty("passwordHash");
  });

  it("creates, updates, and deletes a user", async () => {
    const createResponse = await app.fetch(new Request("http://localhost/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test User", mobile: "0500000000", email: "test@example.com", password: "secret" }),
    }), context.env);
    const created = await createResponse.json() as { data: { id: string } };
    const id = created.data.id;

    const updateResponse = await app.fetch(new Request(`http://localhost/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Active" }),
    }), context.env);
    const deleteResponse = await app.fetch(new Request(`http://localhost/api/users/${id}`, { method: "DELETE" }), context.env);

    expect(createResponse.status).toBe(201);
    expect(updateResponse.status).toBe(200);
    expect(deleteResponse.status).toBe(200);
  });
});