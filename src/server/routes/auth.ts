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
    return c.json({ error: "Missing email or password" }, 400);
  }

  const db = drizzle(c.env.DB);
  const user = await db
    .select({ id: users.id, email: users.email, role: users.role })
    .from(users)
    .where(
      and(
        eq(users.email, body.email.trim().toLowerCase()),
        eq(users.passwordHash, body.password)
      )
    )
    .get();

  if (!user) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  return c.json({
    success: true,
    token: `demo_token_${user.id}`,
    user: { email: user.email, role: user.role },
  });
});

export default auth;