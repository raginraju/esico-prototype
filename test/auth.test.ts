// test/auth.test.ts
import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { onRequestPost as loginHandler } from "../functions/api/auth/login";
import { getTestBindings, setupTestDatabase, createExecutionContext, type TestEnv } from "./test-utils";

describe("POST /api/auth/login", () => {
  let env: TestEnv;

  beforeAll(async () => {
    env = await getTestBindings();
  });

  beforeEach(async () => {
    await setupTestDatabase(env.DB);

    // Seed test user
    await env.DB.prepare(
      "INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)"
    )
      .bind("u_test_1", "admin@esico.com.sa", "demo123", "ADMIN")
      .run();
  });

  it("returns 400 if email or password are missing", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "admin@esico.com.sa" }),
      headers: { "Content-Type": "application/json" },
    });

    const context = createExecutionContext(req, env);
    const res = await loginHandler(context);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Missing email or password");
  });

  it("returns 401 on incorrect credentials", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "admin@esico.com.sa", password: "wrong_password" }),
      headers: { "Content-Type": "application/json" },
    });

    const context = createExecutionContext(req, env);
    const res = await loginHandler(context);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe("Invalid credentials");
  });

  it("returns 200 with user session on valid credentials", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "admin@esico.com.sa", password: "demo123" }),
      headers: { "Content-Type": "application/json" },
    });

    const context = createExecutionContext(req, env);
    const res = await loginHandler(context);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.token).toBe("demo_token_u_test_1");
    expect(body.user.role).toBe("ADMIN");
  });
});