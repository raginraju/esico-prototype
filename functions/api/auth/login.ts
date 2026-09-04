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

  // Query your D1 database
  const user = await env.DB.prepare(
    "SELECT id, email, role FROM users WHERE email = ? AND password_hash = ?"
  )
    .bind(email, password)
    .first<{ id: string; email: string; role: string }>();

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