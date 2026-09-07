import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { asc, eq, like, or, sql } from "drizzle-orm";
import { users, type NewUser } from "../../../db/schema";
import type { Env } from "../env";
import { getRequestActor } from "../lib/requestActor";
import { auditLogger } from "../lib/logger";

const usersRouter = new Hono<{ Bindings: Env }>();

usersRouter.get("/", async (c) => {
  const actor = await getRequestActor(c);
  const search = c.req.query("search")?.trim();
  const page = Math.max(1, Number(c.req.query("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(c.req.query("limit")) || 10));
  const offset = (page - 1) * limit;
  const db = drizzle(c.env.DB);
  const whereClause = search
    ? or(like(users.name, `%${search}%`), like(users.mobile, `%${search}%`), like(users.email, `%${search}%`))
    : undefined;

  const [data, totalRecord] = await Promise.all([
    db.select({ id: users.id, name: users.name, mobile: users.mobile, email: users.email, status: users.status })
      .from(users).where(whereClause).orderBy(asc(users.name)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(users).where(whereClause).get(),
  ]);
  const total = totalRecord?.count || 0;

  auditLogger.info("users.list", "Users retrieved", {
    actor: { id: actor.id, authenticated: actor.id !== "anonymous", role: actor.role },
    page, limit, returned: data.length, total,
  });

  return c.json({
    status: "success",
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    count: data.length,
    data,
  });
});

usersRouter.post("/", async (c) => {
  const actor = await getRequestActor(c);
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const mobile = typeof body.mobile === "string" ? body.mobile.trim() : "";

  if (!name || !email || !password) {
    return c.json({ status: "error", message: "name, email, and password are required" }, 400);
  }

  const newUser: NewUser = {
    id: typeof body.id === "string" && body.id ? body.id : crypto.randomUUID(),
    name,
    mobile,
    email,
    passwordHash: password,
    role: typeof body.role === "string" && body.role ? body.role : "INSPECTOR",
    status: typeof body.status === "string" && body.status ? body.status : "Pending",
  };

  try {
    await drizzle(c.env.DB).insert(users).values(newUser);
  } catch (error) {
    if (String(error).toLowerCase().includes("unique")) {
      return c.json({ status: "error", message: "A user with this email already exists" }, 409);
    }
    throw error;
  }

  auditLogger.info("users.create", "User created", {
    actor: { id: actor.id, authenticated: actor.id !== "anonymous", role: actor.role },
    item: { type: "user", reference: newUser.id },
  });
  return c.json({ status: "success", message: "User created successfully", data: {
    id: newUser.id, name: newUser.name, mobile: newUser.mobile, email: newUser.email, status: newUser.status,
  } }, 201);
});

usersRouter.put("/:id", async (c) => {
  const actor = await getRequestActor(c);
  const id = c.req.param("id");
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const updatePayload: Partial<NewUser> = {};

  for (const field of ["name", "mobile", "role", "status"] as const) {
    if (typeof body[field] === "string") updatePayload[field] = body[field].trim();
  }
  if (typeof body.email === "string") updatePayload.email = body.email.trim().toLowerCase();
  if (typeof body.password === "string" && body.password) updatePayload.passwordHash = body.password;

  if (Object.keys(updatePayload).length === 0) {
    return c.json({ status: "error", message: "No fields to update" }, 400);
  }

  const db = drizzle(c.env.DB);
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.id, id)).get();
  if (!existing) return c.json({ status: "error", message: "User not found" }, 404);
  await db.update(users).set(updatePayload).where(eq(users.id, id));

  auditLogger.info("users.update", "User updated", {
    actor: { id: actor.id, authenticated: actor.id !== "anonymous", role: actor.role },
    item: { type: "user", reference: id },
  });
  return c.json({ status: "success", message: "User updated successfully" });
});

usersRouter.delete("/:id", async (c) => {
  const actor = await getRequestActor(c);
  const id = c.req.param("id");
  const db = drizzle(c.env.DB);
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.id, id)).get();
  if (!existing) return c.json({ status: "error", message: "User not found" }, 404);
  await db.delete(users).where(eq(users.id, id));
  auditLogger.info("users.delete", "User deleted", {
    actor: { id: actor.id, authenticated: actor.id !== "anonymous", role: actor.role },
    item: { type: "user", reference: id },
  });
  return c.json({ status: "success", message: "User deleted successfully" });
});

export default usersRouter;