// @vitest-environment node

import { beforeEach, afterEach, describe, expect, it } from "vitest";
import app from "../src/server/index";
import { getTestBindings, setupTestDatabase, type TestContext } from "./test-utils";

describe("auth API route", () => {
  let context: TestContext;

  beforeEach(async () => {
    context = await getTestBindings();
    await setupTestDatabase(context.env.DB);
  });

  afterEach(async () => {
    await context.dispose();
  });

  it("rejects requests with missing credentials", async () => {
    const response = await app.fetch(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "admin@esico.com.sa" }),
        headers: { "Content-Type": "application/json" },
      }),
      context.env
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Missing email or password" });
  });

  it("rejects invalid credentials", async () => {
    const response = await app.fetch(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "admin@esico.com.sa", password: "wrong" }),
        headers: { "Content-Type": "application/json" },
      }),
      context.env
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Invalid credentials" });
  });

  it("returns a token for valid credentials", async () => {
    const response = await app.fetch(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: " ADMIN@ESICO.COM.SA ", password: "demo123" }),
        headers: { "Content-Type": "application/json" },
      }),
      context.env
    );
    const body = await response.json() as { success: boolean; token: string; user: { role: string } };

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ success: true, token: "demo_token_u_admin", user: { role: "ADMIN" } });
  });
});