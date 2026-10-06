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

  const user = await drizzle(c.env.DB)
    .select({ id: users.id, name: users.name, email: users.email, mobile: users.mobile, gender: users.gender, role: users.role })
    .from(users)
    .where(eq(users.id, actor.id))
    .get();

  if (!user) return c.json({ authenticated: false }, 401);

  return c.json({
    authenticated: true,
    user,
  });
});

auth.put("/profile", async (c) => {
  const actor = await getRequestActor(c);
  if (actor.id === "anonymous") {
    return c.json({ status: "error", message: "Authentication required" }, 401);
  }

  const body = await c.req.json<{
    name?: string;
    gender?: string;
    password?: string;
  }>().catch(() => null);

  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return c.json({ status: "error", message: "Full name is required" }, 400);
  }
  if (body.gender !== undefined && !["", "Male", "Female"].includes(body.gender)) {
    return c.json({ status: "error", message: "Invalid gender" }, 400);
  }

  const updatePayload: Partial<typeof users.$inferInsert> = {
    name: body.name.trim(),
  };
  if (body.gender !== undefined) updatePayload.gender = body.gender;
  if (typeof body.password === "string" && body.password.length > 0) {
    updatePayload.passwordHash = body.password;
  }

  const db = drizzle(c.env.DB);
  await db.update(users).set(updatePayload).where(eq(users.id, actor.id));
  const user = await db
    .select({ id: users.id, name: users.name, email: users.email, mobile: users.mobile, gender: users.gender, role: users.role })
    .from(users)
    .where(eq(users.id, actor.id))
    .get();

  auditLogger.info("auth.profile.update", "User profile updated", {
    actor: { id: actor.id, authenticated: true, role: actor.role },
    item: { type: "user", reference: actor.id },
    fields: Object.keys(updatePayload).filter((field) => field !== "passwordHash"),
    passwordChanged: Boolean(updatePayload.passwordHash),
  });

  return c.json({ status: "success", message: "Profile updated", user });
});

export default auth;