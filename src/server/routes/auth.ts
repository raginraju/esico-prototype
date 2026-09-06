// src/routes/auth.ts
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { and, eq } from "drizzle-orm";
import { users } from "../../../db/schema";
import type { Env } from "../env"; 

const auth = new Hono<{ Bindings: Env }>();

auth.post("/login", async (c) => {
  const body = await c.req
    .json<{ email?: string; password?: string }>()
    .catch(() => null);

  if (!body?.email || !body?.password) {
    console.warn("[auth.login] rejected request: missing credentials", {
      actor: { id: "unknown", authenticated: false, role: "unknown" },
    });
    return c.json({ error: "Missing email or password" }, 400);
  }

  const email = body.email.trim().toLowerCase();
  const actor = {
    id: "unknown",
    authenticated: false,
    role: "unknown",
  };
  console.info("[auth.login] authenticating user", { actor });

  const db = drizzle(c.env.DB);
  const user = await db
    .select({ id: users.id, email: users.email, role: users.role })
    .from(users)
    .where(
      and(
        eq(users.email, email),
        eq(users.passwordHash, body.password)
      )
    )
    .get();

  if (!user) {
    console.warn("[auth.login] rejected request: invalid credentials", { actor });
    return c.json({ error: "Invalid credentials" }, 401);
  }

  console.info("[auth.login] authentication succeeded", {
    actor: { id: user.id, authenticated: true, role: user.role },
  });

  return c.json({
    success: true,
    token: `demo_token_${user.id}`,
    user: { email: user.email, role: user.role },
  });
});

export default auth;