import { drizzle } from "drizzle-orm/d1";
import { and, eq } from "drizzle-orm";
import { users } from "../../../db/schema";

interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const { email, password } = await request.json<{ email?: string; password?: string }>();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing email or password" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Initialize Drizzle with D1 binding
  const db = drizzle(env.DB);

  // Type-safe SELECT query
  const user = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(and(eq(users.email, email), eq(users.passwordHash, password)))
    .get();

  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      token: "demo_token_" + user.id,
      user: { email: user.email, role: user.role },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};