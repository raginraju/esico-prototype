// test/auth.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import app from "../src/server/index";
import { getTestBindings, setupTestDatabase, type TestContext } from "./test-utils";

describe("Auth Integration Tests (/api/auth/login)", () => {
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

  it("returns 200 and token on valid credentials", async () => {
    const res = await app.request(
      "/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@esico.com.sa",
          password: "demo123",
        }),
      },
      context.env
    );

    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.success).toBe(true);
    expect(data.token).toBe("demo_token_u_admin");
    expect(data.user.email).toBe("admin@esico.com.sa");
    expect(data.user.role).toBe("ADMIN");
  });

  it("handles case-insensitive email input", async () => {
    const res = await app.request(
      "/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "ADMIN@ESICO.COM.SA",
          password: "demo123",
        }),
      },
      context.env
    );

    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.success).toBe(true);
    expect(data.user.email).toBe("admin@esico.com.sa");
  });

  it("returns 401 on incorrect password", async () => {
    const res = await app.request(
      "/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@esico.com.sa",
          password: "wrongpassword",
        }),
      },
      context.env
    );

    expect(res.status).toBe(401);
    const data = (await res.json()) as any;
    expect(data.error).toBe("Invalid credentials");
  });

  it("returns 401 when email does not exist", async () => {
    const res = await app.request(
      "/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "nonexistent@esico.com.sa",
          password: "demo123",
        }),
      },
      context.env
    );

    expect(res.status).toBe(401);
    const data = (await res.json()) as any;
    expect(data.error).toBe("Invalid credentials");
  });

  it("returns 400 when email or password is omitted", async () => {
    const res = await app.request(
      "/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@esico.com.sa",
        }),
      },
      context.env
    );

    expect(res.status).toBe(400);
    const data = (await res.json()) as any;
    expect(data.error).toBe("Missing email or password");
  });

  it("returns 400 on malformed request JSON", async () => {
    const res = await app.request(
      "/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid-json-body",
      },
      context.env
    );

    expect(res.status).toBe(400);
  });
});