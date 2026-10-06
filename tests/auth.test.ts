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

  it("sets a secure HttpOnly session cookie for valid credentials", async () => {
    await context.env.DB.prepare(
      "UPDATE users SET name = ?, mobile = ? WHERE id = ?"
    ).bind("Aisha Khan", "0501234567", "u_admin").run();
    const response = await app.fetch(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: " ADMIN@ESICO.COM.SA ", password: "demo123" }),
        headers: { "Content-Type": "application/json" },
      }),
      context.env
    );
    const body = await response.json() as { success: boolean; user: { role: string } };

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ success: true, user: { role: "ADMIN" } });
    expect(response.headers.get("set-cookie")).toMatch(/esico_session=.+HttpOnly/);
    expect(response.headers.get("set-cookie")).toMatch(/Secure/);
    expect(response.headers.get("set-cookie")).toMatch(/SameSite=Strict/);
    expect(response.headers.get("set-cookie")).not.toMatch(/demo_token/);

    const sessionResponse = await app.fetch(
      new Request("http://localhost/api/auth/session", {
        headers: { Cookie: response.headers.get("set-cookie")!.split(";")[0] },
      }),
      context.env
    );
    expect(sessionResponse.status).toBe(200);
    expect(await sessionResponse.json()).toMatchObject({
      authenticated: true,
      user: {
        id: "u_admin",
        name: "Aisha Khan",
        email: "admin@esico.com.sa",
        mobile: "0501234567",
        role: "ADMIN",
      },
    });
  });

  it("updates only the authenticated user's profile", async () => {
    const loginResponse = await app.fetch(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "admin@esico.com.sa", password: "demo123" }),
        headers: { "Content-Type": "application/json" },
      }),
      context.env
    );
    const cookie = loginResponse.headers.get("set-cookie")!.split(";")[0];
    const response = await app.fetch(
      new Request("http://localhost/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ name: "Updated Admin", gender: "Female", password: "new-password-123", id: "someone-else" }),
        headers: { Cookie: cookie, "Content-Type": "application/json" },
      }),
      context.env
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      status: "success",
      user: { id: "u_admin", name: "Updated Admin", gender: "Female" },
    });
    const stored = await context.env.DB.prepare(
      "SELECT password_hash FROM users WHERE id = ?"
    ).bind("u_admin").first<{ password_hash: string }>();
    expect(stored?.password_hash).toBe("new-password-123");
  });
});