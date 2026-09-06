// src/routes/auth.ts
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { and, eq } from "drizzle-orm";
import { users } from "../../../db/schema";
import type { Env } from "../env"; 
import { auditLogger } from "../lib/logger";
import { createJwt } from "../lib/jwt";
import { getRequestActor } from "../lib/requestActor";

const auth = new Hono<{ Bindings: Env }>();
const cookieName = "esico_session";

function sessionCookie(token: string, maxAge: number): string {
  return `${cookieName}=${token}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Strict`;
}

auth.post("/login", async (c) => {
  const body = await c.req
    .json<{ email?: string; password?: string }>()
    .catch(() => null);

  if (!body?.email || !body?.password) {
    auditLogger.warn("auth.login", "Rejected request: missing credentials", {
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
  auditLogger.info("auth.login", "Authenticating user", { actor });

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
    auditLogger.warn("auth.login", "Rejected request: invalid credentials", { actor });
    return c.json({ error: "Invalid credentials" }, 401);
  }

  auditLogger.info("auth.login", "Authentication succeeded", {
    actor: { id: user.id, authenticated: true, role: user.role },
  });

  const token = await createJwt(
    { id: user.id, email: user.email, role: user.role },
    c.env.JWT_SECRET
  );
  c.header("Set-Cookie", sessionCookie(token, 60 * 60 * 8));

  return c.json({
    success: true,
    user: { email: user.email, role: user.role },
  });
});

auth.post("/logout", (c) => {
  c.header("Set-Cookie", sessionCookie("", 0));
  return c.json({ success: true });
});

auth.get("/session", async (c) => {
  const actor = await getRequestActor(c);
  if (actor.id === "anonymous") {
    return c.json({ authenticated: false }, 401);
  }
  return c.json({ authenticated: true, user: { email: actor.email, role: actor.role } });
});

export default auth;